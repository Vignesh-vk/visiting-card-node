Welcome to vesiting card reader node

step 1 - Open terminal

step 2 - Run below command to install dependency
    npm install

step 3 - Create .env variables and add below keys
    MONGO_URI= "Your database URL"
    PORT= "Your port number"

step 4 - Run the below command to run the project
    npm start


Apis used in the project

    1. '/api/upload' - To upload image for scanning details.
    2. '/api/cardscards?page=1&limit=10' - To fetch already stored card details.