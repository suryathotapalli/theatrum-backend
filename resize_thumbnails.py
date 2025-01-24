import os
from PIL import Image

# Path to your 'Thumbnails' folder
BASE_DIR = r"C:\Users\91911\OneDrive\Documents\SEM-V\DBMS\PROJECT\END SEM PROJECT\THEATRUM_Content\Thumbnails"

# Desired thumbnail size
THUMBNAIL_SIZE = (1920, 1080)  # Resize to 1920x1080 pixels

def resize_images():
    for genre in os.listdir(BASE_DIR):
        genre_path = os.path.join(BASE_DIR, genre)
        if os.path.isdir(genre_path):  # Check if it's a folder
            for language in os.listdir(genre_path):
                language_path = os.path.join(genre_path, language)
                if os.path.isdir(language_path):  # Check if it's a folder
                    for file_name in os.listdir(language_path):
                        if file_name.endswith('.jpg'):  # Process only .jpg files
                            file_path = os.path.join(language_path, file_name)
                            try:
                                with Image.open(file_path) as img:
                                    # Resize and save the image
                                    img = img.resize(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
                                    img.save(file_path)
                                    print(f"Resized: {file_path}")
                            except Exception as e:
                                print(f"Error processing {file_path}: {e}")

if __name__ == '__main__':
    resize_images()
