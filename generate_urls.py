import os

# Base URL for your server
BASE_URL = "http://localhost:5000/uploads"

# Path to your "THEATRUM_Content/Thumbnails" folder
base_path = r"C:\Users\91911\OneDrive\Documents\SEM-V\DBMS\PROJECT\END SEM PROJECT\THEATRUM_Content\Thumbnails"

# Output file to save URLs
output_file = "thumbnail_urls.txt"

# Open file to write URLs
with open(output_file, "w") as file:
    for genre_folder in os.listdir(base_path):
        genre_path = os.path.join(base_path, genre_folder)
        if os.path.isdir(genre_path):  # Check if it's a directory
            for language_folder in os.listdir(genre_path):
                language_path = os.path.join(genre_path, language_folder)
                if os.path.isdir(language_path):  # Check if it's a directory
                    for thumbnail in os.listdir(language_path):
                        if thumbnail.endswith(".jpg"):  # Process only JPG files
                            # Construct URL
                            url = f"{BASE_URL}/thumbnails/{thumbnail}"
                            file.write(url + "\n")  # Write URL to file

print(f"Thumbnail URLs generated and saved in {output_file}")
