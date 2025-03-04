# Globetrotter
 ### Overview
Globetrotter is a full-stack web app designed as a travel guessing game where users guess destinations based on cryptic clues. The app includes AI-generated datasets, backend storage, scoring, animations, and a 'Challenge a Friend' feature. The system allows extensibility for future improvements and integrates Redis caching for optimized performance.

 ### Tech Stack
Frontend: vite React.js
Backend: Node.js with Express.js
Database: MongoDB
Caching: Redis
 ### Why React for Frontend?
React is chosen for the frontend because:
I have previous experience of building application on it and its easier to use reusable components resulting in better maintability and scalability.

### Why Node.js and MongoDB for Backend?

#### Node.js:
it provides a scalable and low-latency backend. Additionally, using JavaScript (or TypeScript) for both the frontend and backend streamlines the development process and makes it easier to manage the entire application.

### Features
Destinations: Users can guess travel destinations based on cryptic clues.
Leaderboard: Tracks the users' scores and displays the top performers.
User Authentication: Users can register and log in using their username.
Admin Interface: Admins can manage destinations, users, and the leaderboard.
 ## Routes and Endpoints
 ### 1. Destinations:- generate random destination, used Redis to make every destination unique to each user.
 ```
Route: /api/destinations/random
```
Description: Manages all destination-related actions, including fetching random destinations, adding new destinations, and updating existing ones.
 ### 2. User
  ```
Route:
/user
/:userId
/:userId/score
/:userId/new-game
 ```
Description: Manages user-related actions such as registration and score updates.
Endpoints:
 ```
POST /user: Create or fetch a user by username. Resets the score if the user already exists.
GET /user/:username: Fetch the user data by username.
 ```
### 3. Leaderboard
  ```
Route: /leaderboard
 ```
Description: Manages the leaderboard, displaying the top players based on their scores.
Endpoints:
 ```
GET /leaderboard: Fetch the top players from the leaderboard.
 ```
### 4. Admin
## Use Username :- admin
## Password:- admin
 ```
Route: /admin
'/login', adminLogin
signup', adminSignup
'/users', getAllUsers
'/stats', getAdminStats
Description: Manages administrative functions such as adding/editing destinations and managing users.
 ```
Redis Caching
The project uses Redis caching to enhance performance by storing frequently accessed data (like destinations) in memory, reducing the load on the database and speeding up the response times.

 ### Running the Project
Prerequisites
Node.js
MongoDB
Redis (optional for caching)
Installation
Clone the repository:

  ```bash

git clone https://github.com/incruder1/Globetrotter.git
```
Install dependencies:
```
npm install
```
Start the server:

```
npm start
```
The backend will be running on http://localhost:5000, and the frontend will be available at http://localhost:3000.

