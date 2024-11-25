
# SailTrail Backend

This is the backend for the SailTrail project.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Files](#files)
- [Utils](#utils)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Project Structure
```
home/rakshit/repos/SMBhav/SailTrail/Backend/
├── index.mjs
├── package.json
├── package-lock.json
└── utils/
    ├── contract.mjs
    └── qr.mjs
```

## Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Harjas-Sidhu/SMBhav.git
   cd SMBhav/SailTrail/Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

## Usage

To start the server, run:
```bash
npm start
```
The server will be running on `http://localhost:3000`. You can access the endpoints defined below.

## Files

### index.mjs
This is the entry point of the application. It sets up the Express server and defines the main routes.

### package.json
This file contains the metadata for the project, including dependencies and scripts.

### package-lock.json
This file ensures that the exact versions of dependencies are locked in, providing a consistent environment for all installations.

## Utils

### utils/contract.mjs
This module handles the interaction with blockchain smart contracts.

### utils/qr.mjs
This module manages QR code generation and processing.

### Commit Changes (Optional)
If you make any changes and want to push them to the repository, follow these steps:
bash
```bash 
git add .
git commit -m "Your commit message"
git push origin main
```

