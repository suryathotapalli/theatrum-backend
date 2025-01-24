import os
import json

# Define the base folder containing thumbnails
base_folder = r"C:\Users\91911\OneDrive\Documents\SEM-V\DBMS\PROJECT\END SEM PROJECT\theatrum-backend"

movies = []

# Loop through genres and languages
for genre in os.listdir(base_folder):
    genre_path = os.path.join(base_folder, genre)
    if os.path.isdir(genre_path):
        for language in os.listdir(genre_path):
            language_path = os.path.join(genre_path, language)
            if os.path.isdir(language_path):
                for file in os.listdir(language_path):
                    if file.endswith(".jpg"):  # Only process .jpg files
                        # Extract movie details from the filename
                        parts = file.replace(".jpg", "").split("_")
                        if len(parts) == 3:
                            movie = {
                                "title": parts[1],
                                "genre": parts[0],
                                "language": parts[2],
                                "thumbnail": None
                            }
                            movies.append(movie)

# Save to movies.json
with open("movies.json", "w") as json_file:
    json.dump(movies, json_file, indent=4)

print("movies.json created successfully!")
