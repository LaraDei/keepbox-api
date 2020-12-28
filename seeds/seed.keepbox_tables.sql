BEGIN;

TRUNCATE
  keepbox_users,
  keepbox_albums,
  keepbox_photos
  RESTART IDENTITY CASCADE;
  
INSERT INTO keepbox_users (email, full_name, password)
VALUES
  ('test123@test.com', 'Test User', 'password123'),
  ('test123Bodeep@test.com', 'Bodeep Deboop', '$2a$12$lHK6LVpc15/ZROZcKU00'),
  ('test123Charlie@test.com', 'Charlie Bloggs', 'lmu59cy2jcZiV6U1.bE8rBBnC9'),
  ('test123Sam@test.com', 'Sam Smith', '$2a$12$ntGOlTLG5nEXYgDVqk4b');


INSERT INTO keepbox_albums (title, user_id)
VALUES
  ('TestAlbum', 1),
  ('MyAlbum', 1),
  ('My Kid Rocks!', 2),
  ('Best Album', 1),
  ('Cool Album', 3),
  ('Growing Strong', 4),
  ('TestAlbum123', 3);
  
INSERT INTO keepbox_photos (
  caption,
  summary,
  file_location,
  date_created,
  age,
  user_id,
  album_id
) VALUES
  (
    'sand castle',
    'Photo by Giuseppe Famiani on Unsplash',
    'https://source.unsplash.com/skmzjgBlCIA/900x600',
     '12/9/2020',
     '4',
     1,
     1
  ),
  (
    'construction paper santa face',
    'Photo by Markus Spiske on Unsplash',
    'https://source.unsplash.com/Rrp8yf_LKrg/600x900',
     '12/9/2020',
     '4',
     1,
     2 
  ),
  (
    'orange sun set with butterfly',
    'Photo by Andrey Shpigunov on Unsplash',
    'https://source.unsplash.com/HkzqKFYOn3M/600x900',
     '12/9/2020',
     '4',
     1,
     4
  ),
  (
    'child makes playdough rainbow',
    'Photo by Julietta Watson on Unsplash',
    'https://source.unsplash.com/1VT2qoBtc-k/900x600',
    '12/9/2020',
    '4',
     2,
     3 
  ),
  (
    'fingpaint ghost',
    'Photo by Markus Spiske on Unsplash',
    'https://source.unsplash.com/Ia02X7WcPn0/900x600',
     '12/9/2020',
     '4',
     3,
     5 
  ),
  (
    'houses chaulk drawing',
    'Photo by Miki Fath on Unsplash',
    'https://source.unsplash.com/1v1zjqxldmc/900x600',
     '12/9/2020',
     '4',
     4,
     6 
  ),
  (
    'lego truck',
    'Photo by Markus Spiske on Unsplash',
    'https://source.unsplash.com/SYrlpGnICBY/900x600',
     '12/9/2020',
     '4',
     1,
     1 
  ),
  (
    'child coloring with markers',
    'Photo by Erika Fletcher on Unsplash',
    'https://source.unsplash.com/YfNWGrQI3a4/900x600',
     '12/9/2020',
     '4',
     1,
     2 
  ),
  (
    'abstract fingerpainting',
    'Photo by Andrey Shpigunov on Unsplash',
    'https://source.unsplash.com/1HHvdXH6rqY/600x900',
     '12/9/2020',
     '4',
     1,
     4
  );

COMMIT;