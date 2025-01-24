import os
import json

base_path = r"C:\Users\91911\OneDrive\Documents\SEM-V\DBMS\PROJECT\END SEM PROJECT\THEATRUM_Content"
thumbnail_base_url = 'http://localhost:5000/uploads/thumbnails'
video_base_url = 'http://localhost:5000/uploads/videos'

movies = []

genres = os.listdir(base_path + '/Thumbnails')
for genre in genres:
    languages = os.listdir(base_path + f'/Thumbnails/{genre}')
    for language in languages:
        files = os.listdir(base_path + f'/Thumbnails/{genre}/{language}')
        for file in files:
            if file.endswith('.jpg'):
                movie_name = file.replace(f'{genre}_', '').replace(f'_{language}.jpg', '')
                movies.append({
                    "title": movie_name,
                    "genre": genre,
                    "language": language,
                    "thumbnail": f"{thumbnail_base_url}/{genre}_{movie_name}_{language}.jpg",
                    "video": f"{video_base_url}/{genre}_{movie_name}_{language}.mp4"
                })

# Save to movies.json
with open('movies.json', 'w') as f:
    json.dump(movies, f, indent=4)

print("movies.json has been generated.")
