const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Enforce role values
            default: 'user',
        },
        plan: {
            type: String,
            enum: ['Basic', 'Standard', 'Premium', 'No Plan'], // Added 'Standard'
            default: 'No Plan', // Default to 'No Plan'
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Pending', 'Failed'], // Valid statuses
            default: 'Pending',
        },
        paymentMethod: {
            type: String,
            enum: ['UPI', 'Card', 'None'], // Valid payment methods
            default: 'None',
        },
    },
    { timestamps: true }
);

// Export the User model
module.exports = mongoose.model('User', userSchema);
