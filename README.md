# Enhanced Authentication API

API for user authentication with public and private profile functionality.

## Endpoints

### Register a New User

Registers a new user.


curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Your Name",
    "email": "your_email@example.com",
    "password": "your_password"
}'


### Login a User
Logs in a user with the provided email and password, returning a JWT token for authentication.


curl --location 'http://localhost:3000/api/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "your_email@example.com",
    "password": "your_password"
}'


### Get User Profile
Retrieves the profile of the authenticated user.


curl --location 'http://localhost:3000/api/users/profile' \
--header 'Content-Type: application/json' \
--header 'x-auth-token: YOUR_AUTH_TOKEN_HERE'


### Update User Profile
Updates the profile of the authenticated user.


curl --location 'http://localhost:3000/api/users/profile' \
--header 'Content-Type: application/json' \
--header 'x-auth-token: YOUR_AUTH_TOKEN_HERE' \
--data-raw '{
    "name": "Your Name",
    "photo": "http://example.com/photo.jpg",
    "bio": "Updated bio",
    "phone": "1234567890",
    "email": "your_email@example.com",
    "isPublic": false,
    "password": "newpassword123"
}'

### List Public Profiles
Retrieves a list of public profiles.


curl --location 'http://localhost:3000/api/users/profiles' \
--header 'Content-Type: application/json' \
--header 'x-auth-token: YOUR_AUTH_TOKEN_HERE'

### List All Profiles (Admin Only)
Retrieves a list of all profiles, accessible only to admin users.



curl --location 'http://localhost:3000/api/users/admin/profiles' \
--header 'Content-Type: application/json' \
--header 'x-auth-token: YOUR_AUTH_TOKEN_HERE'
