
# HashHarbour Backend

## Description
HashHarbour Backend is a server-side application responsible for managing the backend operations of the HashHarbour platform. It provides APIs for user management, data handling, and other business logic.

## Installation
To set up the HashHarbour Backend, follow these steps:

1. Clone the repository:
   ```bash
   git clone git@github.com:Harjas-Sidhu/SMBhav.git
   cd SMBhav/HashHarbour/Backend
   ```

2. Install the necessary dependencies using npm:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`.

## Usage
To start the development server, run:
```bash
npm start
```
The server will start on `http://localhost:3000`.

### Available Scripts
- `npm start`: Starts the development server.
- `npm test`: Runs the tests.
- `npm run build`: Compiles the application.
- `npm run lint`: Runs the linter.

### Project Structure
This is the basic structure of the project:
```plaintext
src/
  controllers/
  models/
  routes/
  services/
  utils/
```
### Commit Changes (Optional)
If you make any changes and want to push them to the repository, follow these steps:
bash
```bash 
git add .
git commit -m "Your commit message"
git push origin main
```
