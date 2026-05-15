# Frontend SetUp
**Tech stack:** React, TypeScript, Vite, Material UI, Docker, Node.js


## Table Of Contents
1. [Initial Frontend Project Structure](#initial-frontend-project-structure)
2. [Prerequisites](#prerequisites)
3. [Frontend Installation & Environment Setup](#frontend-installation--environment-setup)
4. [Docker Frontend Setup](#docker-frontend-setup)


## Initial Frontend Project Structure
```
CTIris/
├── frontend/
│    ├── node_modules/
│    ├── src/
│    │    ├── assets/
│    │    ├── App.css
│    │    ├── App.tsx
│    │    ├── index.css
│    │    └── main.tsx
│    ├── .dockerignore
│    ├── .gitignore
│    ├── Dockerfile
│    ├── eslint.config.js
│    ├── index.html
│    ├── package-lock.json
│    ├── package.json
│    ├── README.md
│    ├── tsconfig.app.json
│    ├── tsconfig.json
│    ├── tsconfig.node.json
│    └── vite.config.ts
├── .gitignore
├── docker-compose.yml
└── README.md/
```


## Prerequisites
Make sure you have the following installed:
- **Visual Studio Code (VS Code)**
    - You can use any editor, VSC is recommended for this project. You can download from [VS Code official website](https://code.visualstudio.com/).
    
- **Node.js**
    - This project uses **Node.js 22 (LTS line)** to run the local development server and manage dependencies. You can download from [Node.js official website](https://nodejs.org/en/).

- **Node Package Manager (npm)**: Version 11.6.2 or higher (comes bundled with Node.js)
    - This project use npm to manage the libraries for the project, this comes pre-bundled with Node.js.

- **Docker Desktop**: Latest stable version
    - This project uses Docker Desktop to build and run the frontedn application inside containers. You can download from [Docker Desktop official website](https://docs.docker.com/get-started/get-docker/).

### Verify Installation
To check if the required dependencies are installed, navigate to the frontend folder, and run the following commands:
```bash
node -v
npm -v
docker -v
npm list @mui/material
```
*Command should return version numbers or list, if not, then downnload the required dependencies*


## Frontend Installation & Environment Setup
1. Go to your terminal or bash, navigate to the folder you want to save the project in:

   ```bash
   cd <Folder_Name>
   ```

2. Clone the Repository
In the folder you want to save your project in, run:

   ```bash
   git clone git@github.com:auneemitchell/CTIris.git
   ```

3. Navigate to the app root folder:

   ```bash
   cd CTIris
   ```

4. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

    Install dependencies listed in frontend's package.json
    ```bash
    npm install
    ```

5. Open the project in your preferred code editor such as VS Code.

6. Run the dev server locally
   ```bash
   npm run dev
   ```

   *This will open http://localhost:5173*

7. Go to your web browser and open http://localhost:5173 to view the app


## Docker Frontend Setup
1. Build the docker container
   ```bash
   docker build -t frontend .
   docker run -d -p 5173:5173 --name my-frontend frontend
   ```

*This will open http://localhost:5173*

2. Go to your web browser and open http://localhost:5173 to view the app

### Common Docker Compose Command
| Command                     | Description                        |
|-----------------------------|----------------------------------- |
|docker compose up            | Start service                      |
|docker compose up -d         | Run in background                  |
|docker compose down          | Stop services                      |
|docker build -t frontend .   | Rebuild image                      |
|docker ps                    | Shows currently running containers |