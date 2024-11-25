
# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

This project is a web application built using the Angular framework. It includes functionalities such as user authentication, data visualization, and dynamic content updates. The application follows a modular structure to promote scalability and maintainability.

## Setup Instructions

Follow these steps to set up the project:

1. **Prerequisites**: Ensure you have Node.js and npm installed. 
   - Install Node.js from [nodejs.org](https://nodejs.org/)
   - Verify the installations using `node -v` and `npm -v`

2. **Clone the repository**:
   ```bash
   git clone git@github.com:Harjas-Sidhu/SMBhav.git
    cd SMBhav/SailTrail/Frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the project**:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser to view the application.

## Key Files and Their Purposes

1. `src/app/app.module.ts`:
   - The root module that initializes and bundles different components.

2. `src/app/app.component.ts`:
   - The root component that acts as the entry point of the application.

3. `src/app/app-routing.module.ts`:
   - Manages the application's route configurations.

4. `src/environments/`:
   - Contains environment-specific configuration files.

5. `angular.json`:
   - CLI configuration file for defining project-wide settings.

6. `package.json`:
   - Lists the project's dependencies and scripts.

7. `src/styles.css`:
   - Global stylesheet for the application.

### Commit Changes (Optional)
If you make any changes and want to push them to the repository, follow these steps:
bash
```bash 
git add .
git commit -m "Your commit message"
git push origin main
```