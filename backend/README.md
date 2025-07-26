# Backend for Arabic Sciences Website

This is the backend for the Arabic Sciences Website project. It is built using Node.js and Express, and it connects to a MongoDB database using Mongoose.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd arabic-sciences-website/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   Update the database connection settings in `src/config/db.js` to match your MongoDB setup.

4. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Scientists

- **GET /api/scientists**: Retrieve a list of all scientists.
- **GET /api/scientists/:id**: Retrieve a scientist by ID.
- **POST /api/scientists**: Create a new scientist.
- **PUT /api/scientists/:id**: Update a scientist by ID.
- **DELETE /api/scientists/:id**: Delete a scientist by ID.

## Folder Structure

- **src/**: Contains the source code for the backend.
  - **controllers/**: Contains the controller files for handling requests.
  - **models/**: Contains the Mongoose models.
  - **routes/**: Contains the route definitions.
  - **config/**: Contains configuration files, including database connection.
  - **app.js**: The main entry point for the backend application.

## License

This project is licensed under the MIT License.