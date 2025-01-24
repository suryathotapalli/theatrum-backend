const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const User = require('../models/User'); // MongoDB User model
const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user data with default role as 'user'
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role is user
            plan: null,
            paymentStatus: null,
            paymentMethod: null,
        });
        await newUser.save();

        // Send a success response
        res.status(201).json({
            message: 'User created successfully. Proceed to plan selection and payment.',
            user: { name, email, role: 'user' }, // Send back minimal data
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});


// Save User After Successful Payment
router.post('/save-user', async (req, res) => {
    const { name, email, password, plan, paymentStatus, paymentMethod } = req.body;

    try {
        // Validate the payment status
        if (paymentStatus !== 'Paid') {
            return res.status(400).json({ message: 'Payment not successful. User not saved.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with plan and payment details
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            plan, // Expecting values like 'Basic', 'Standard', 'Premium'
            paymentStatus,
            paymentMethod,
        });

        await newUser.save();

        res.status(201).json({ message: 'User saved successfully after successful payment.' });
    } catch (error) {
        console.error('Error saving user after payment:', error.message);
        res.status(500).json({ message: 'Error saving user after payment', error: error.message });
    }
});

// Plan Selection Endpoint
router.post('/select-plan', authMiddleware, async (req, res) => {
    const { name, price } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's plan
        user.plan = {
            name,
            price,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        };

        await user.save();

        res.status(200).json({ message: 'Plan selected successfully. Proceed to payment.' });
    } catch (error) {
        console.error('Error during plan selection:', error.message);
        res.status(500).json({ message: 'Error selecting plan', error: error.message });
    }
});

// Payment Status Storage Endpoint
router.post('/payment-status', authMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's payment status
        user.paymentStatus = status; // Example: "success", "pending", "failed"
        await user.save();

        res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
        console.error('Error updating payment status:', error.message);
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
});

// Test Endpoint to Verify Save User Flow
router.get('/test-save-user', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Sign-in request received with username:', username);

        // Check if the user exists
        const user = await User.findOne({ name: username });
        if (!user) {
            console.log('User not found in the database:', username);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid password' });
        }

        console.log('Password validation successful for user:', username);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET,           // Secret key
            { expiresIn: '1h' }               // Token expiration
        );

        console.log('JWT token generated successfully:', token);

        // Respond with token and user details
        res.status(200).json({
            message: 'Login successful',
            token, // Include the JWT token in the response
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Either 'admin' or 'user'
                plan: user.plan,
                paymentStatus: user.paymentStatus,
            },
        });
        console.log('Sign-in response sent successfully for user:', username);
    } catch (error) {
        console.error('Error during sign-in process:', error.message);
        res.status(500).json({ message: 'Error during sign-in', error: error.message });
    }
});

module.exports = router;
