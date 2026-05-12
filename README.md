# CTIris
Capstone Project for North Seattle College CS BS Program


## Database migrations (Alembic + PostgreSQL)

The migration workspace lives in `backend/`.

### Automated setup with Docker

Simply run:

```bash
docker compose up
```

This automatically:
- Starts PostgreSQL
- Builds the backend container
- Waits for PostgreSQL to be ready
- Runs `alembic upgrade head` to apply all migrations

The containers will be running in the foreground. Press `Ctrl+C` to stop.

To run in the background:

```bash
docker compose up -d
```

To stop:

```bash
docker compose down
```

### Notes
- `DATABASE_URL` is passed via environment in Docker or loaded from `.env` for local development.
- Baseline schema creates `feeds`, `stix_objects`, and `ingestion_log`.
- `feeds.id` and `ingestion_log.id` use PostgreSQL built-in UUIDv7 defaults via `uuidv7()`.

## Frontend SetUp
Tech stack: React, TypeScript, Vite, Material UI

### Project Structure
```
CTIris/
├── docker-compose.yml
├── backend/
└── frontend/
    ├── node_modules/
    ├── src/
    │   ├── assets/
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
└── README.md/
```

### Prerequisites
Make sure you have the following installed:
- **Visual Studio Code (VS Code)**
    - You can use any editor, VSC is recommended for this project. You can download from [VS Code official website](https://code.visualstudio.com/).
    
- **Node.js**
    - This project uses **Node.js 20 (LTS line)** to run the local development server and manage dependencies. You can download from [Node.js official website](https://nodejs.org/en/).

- **Node Package Manager (npm)**: Version 11.6.2 or higher (comes bundled with Node.js)
    - This project use npm to manage the libraries for the project, this comes pre-bundled with Node.js.

To check if Node.js is installed:
```bash
node -v
npm -v
```
*Both command should return version numbers, if not download Node.js*

### Installation & Environment Setup
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

```
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

6. Run the dev server
```bash
npm run dev
```

*This will open http://localhost:5173*

7. Go to your web browser and open http://localhost:5173 to view the app


## Run hello-docker using Docker Compose

In the base directory:

### Start
```bash
docker compose up -d
```

Notes:
- Runs all services in `docker-compose.yml` file
- `-d` runs the services in the background

### Stop
```bash
docker compose down
```

Notes:
- Automatically stops and removes all containers.

