Technologies used - Nodejs, Mongodb, ExpressJS, MongoDB Compass Community(to view data in DB)

Steps to setup project - 
1. git clone https://github.com/anvitaaps/hope-research-assignment.
2. Go to server directory.
3. npm install
4. node app OR nodemon app

API endpoints - 
1. Login - http://localhost:3000/user/user-login (POST)
	Body params - email, password
2. Get user posts - http://localhost:3000/user/posts/1 - (GET)
3. Get user details - http://localhost:3000/user/getDetailsById/1 - (GET)
4. Get all posts - http://localhost:3000/user/getAllPosts - (GET) - Need to pass authorization token
5. Get all users - http://localhost:3000/user/getAllUsers - (GET) - Need to pass authorization token