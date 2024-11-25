# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

### Steps to Set Up and Run DockuDeck:

1. Clone the Repository
Open your terminal or command prompt.
Clone the repository from your version control system (GitHub, GitLab, etc.) using the git clone command. Make sure to replace REPO_URL with your actual repository URL.

```bash
git clone git@github.com:Harjas-Sidhu/SMBhav.git
 ```
2. Navigate to the Project Directory
After cloning the repository, navigate into the project folder:

```bash 
cd SMBhav/docku-deck/frontend
```
3. Install Dependencies
Install all the necessary dependencies listed in the package.json file using npm (Node Package Manager). This will fetch all the libraries and packages required for the Angular app.


```bash 
npm install 
```

4. Start the Development Server
Run the following command to start the Angular development server:
```bash
ng serve --open 
```
This command will:
Compile the Angular application.
Launch the development server at http://localhost:4200/ in your default web browser.
The --open flag automatically opens the browser window.

5. Verify the Application is Running
After running the development server, go to ``` http://localhost:4200/ ``` in your browser to verify that DockuDeck is up and running. You should see the application’s homepage or the default page set up in Angular.

6. Optional: Build for Production
If you're ready to build the application for production, use the ng build --prod command:

```bash 
ng build --prod
 ```
This will create a dist/ folder with all the production-ready files that can be deployed to a web server.

7. Commit Changes (Optional)
If you make any changes and want to push them to the repository, follow these steps:
bash
```bash 
git add .
git commit -m "Your commit message"
git push origin main
```
   