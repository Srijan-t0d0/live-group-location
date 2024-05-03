# Real-Time Location Sharing App

#### Video Demo: https://www.youtube.com/watch?v=N5zp5JL3WP0

#### Description:

This project is a real-time location sharing application that allows users to share their live locations with other users in the same room. Users can enter a room number (acting as a secret key) to join and see the live location updates of multiple users within the same room in real-time.

The application is built using Node.js for the backend, React for the frontend, and Leaflet for map integration. It enables users to create or join specific rooms by entering a unique room number, allowing them to visualize and track the real-time location updates of multiple users concurrently on an interactive map interface.

### Key Features:

- Users can enter a room number to join and share their live location.
- Real-time updates of multiple users' locations within the same room.
- Interactive map interface powered by Leaflet to display user locations.
- Seamless integration of React for a dynamic and responsive frontend.
- Secure room access with room numbers acting as unique keys.

### Code Overview:

The backend, developed with Node.js and Express, is responsible for handling connections, room joining, and real-time location updates using Socket.io. The frontend, built with React, integrates Leaflet for the map interface, displaying the live location updates of users within a room.

### Technologies Used:

- Node.js
- Express.js
- Socket.io
- React
- Leaflet
- CORS
- Material UI

### Usage:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Run the server using `node app.js` or `npm start`.
4. Access the application in a web browser using `http://localhost:3000`.
