import os

# Define the base URL for videos
BASE_URL = "http://localhost:5000/uploads/videos"

# Define the root directory where videos are stored
VIDEOS_DIR = r"C:\Users\91911\OneDrive\Documents\SEM-V\DBMS\PROJECT\END SEM PROJECT\THEATRUM_Content\Videos"

# Open a file to save video URLs
with open("video_urls.txt", "w") as file:
    for genre in os.listdir(VIDEOS_DIR):
        genre_path = os.path.join(VIDEOS_DIR, genre)
        if os.path.isdir(genre_path):
            for language in os.listdir(genre_path):
                language_path = os.path.join(genre_path, language)
                if os.path.isdir(language_path):
                    for video in os.listdir(language_path):
                        if video.endswith(".mp4"):
                            video_url = f"{BASE_URL}/{genre}/{language}/{video}"
                            file.write(video_url + "\n")

print("Video URLs generated successfully in video_urls.txt")
