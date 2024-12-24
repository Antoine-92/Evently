# **Evently**

Evently is a comprehensive platform designed to manage events and participants efficiently. This project is divided into two main components:
- **Frontend**: Built with Angular for an interactive user experience.
- **Backend**: Developed using Node.js and PostgreSQL for robust and scalable data management.

---

## **Authors**
This project was created by:
- **Antoine Richard**
- **Charles PERIER**
- **Thomas VALESI**
- **Chloe DE WILDE**

---

## **Getting Started**

This step-by-step guide will walk you through the process of setting up and running the Evently platform on your local machine.

---

### **Prerequisites**
Before you begin, ensure you have the following tools installed:
- [Node.js](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli) (v12+)
- [PostgreSQL](https://www.postgresql.org/) (v12+)
- [Git](https://git-scm.com/)

---

## **Step 1: Clone the Repository**

1. Open your terminal or command prompt.
2. Clone the repository:
   ```bash
   git clone https://github.com/Antoine-92/Evently.git
   ```
3. Navigate to the project directory:
   ```bash
   cd Evently
   ```

---

## **Step 2: Set Up the PostgreSQL Database**

1. Log in to your PostgreSQL server using your preferred tool (e.g., `psql`, pgAdmin).
2. Create the database:
   ```sql
   CREATE DATABASE event_management;
   ```
3. Connect to the newly created database:
   ```bash
   \c event_management
   ```
4. Set up the tables by executing the following SQL commands:

#### **Create the `events` Table**
```sql
CREATE SEQUENCE events_id_seq;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(150),
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'general'
);
```

#### **Create the `participants` Table**
```sql
CREATE SEQUENCE participants_id_seq;

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);
```

#### **Create the `event_participants` Table**
```sql
CREATE TABLE event_participants (
    event_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    PRIMARY KEY (event_id, participant_id),
    CONSTRAINT event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT event_participants_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);
```

5. Verify the tables have been created:
   ```sql
   \dt
   ```
   You should see the following tables:
   - `events`
   - `participants`
   - `event_participants`

---

## **Step 3: Configure the Backend**

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. replace placeholders with your database credentials into `config.ts` file:
   ```plaintext
   DB_USER=your_database_user
   DB_HOST=your_database_host
   DB_NAME=event_management
   DB_PASSWORD=your_database_password
   DB_PORT=5432
   ```
3. Install backend dependencies:
   ```bash
   npm install pg dotenv express cors swagger-jsdoc swagger-ui-express
   ```
4. Start the backend server:
   ```bash
   npm run start
   ```
5. Verify the backend is running:
   Open your browser and navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---

## **Step 4: Configure the Frontend**

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install @angular/core @angular/router @angular/common @angular/forms @angular/common/http ag-grid-community ag-grid-angular
   ```
3. Start the frontend server:
   ```bash
   ng serve
   ```
4. Open the application in your browser at [http://localhost:4200](http://localhost:4200).

---

## **Step 5: Verify the Application**

1. Visit the frontend interface at [http://localhost:4200](http://localhost:4200).
2. Perform actions like creating events, adding participants, and associating participants with events to ensure everything is working.

---

## **Project Structure**

```
Evently/
|
|-- backend/                 # Backend code (Node.js + TypeScript)
|   |-- src/
|       |-- config.ts        # Configuration file
|       |-- controllers.ts   # API controllers
|       |-- routes.ts        # API routes
|       |-- index.ts         # Main entry point for backend
|   |-- .gitignore           # Git ignore file
|   |-- package.json         # NPM configuration
|   |-- package-lock.json    # NPM lock file
|   |-- tsconfig.json        # TypeScript configuration
|
|-- frontend/                # Frontend code (Angular)
|   |-- .vscode/             # VSCode settings (optional)
|   |-- evently-frontend/    # Angular project root
|       |-- public/          # Public assets
|       |-- src/             # Angular source code
|           |-- app/         # Main app folder
|               |-- components/  # Angular components
|               |-- services/    # Angular services
|               |-- app.component.*  # Root app files
|               |-- app.routes.ts   # App routing
|           |-- environments/ # Environment configurations
|           |-- index.html    # Main HTML file
|           |-- main.ts       # Angular bootstrap file
|           |-- styles.css    # Global styles
|       |-- .editorconfig     # Editor settings
|       |-- .gitignore        # Git ignore file
|       |-- README.md         # Frontend documentation
|       |-- angular.json      # Angular project configuration
|       |-- package.json      # NPM configuration
|       |-- package-lock.json # NPM lock file
|       |-- tsconfig.*.json   # TypeScript configurations
|       |-- server.ts         # Optional server-side rendering
|
|-- README.md                 # Project documentation
```

---

## **Troubleshooting**

### Common Issues
1. **Database Connection Error**:
   - Ensure PostgreSQL is running.
   - Verify `config.ts` variables are correctly configured.
   - Test the connection to the database manually using `psql` or a database client.

2. **Port Conflicts**:
   - If `3000` or `4200` is in use, update the `PORT` variable in `.env` or Angular CLI configuration.

3. **Dependency Issues**:
   - Run `npm install` again in the respective folder.

---

## **API Documentation**

The API documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs). It provides detailed information about the available endpoints, request formats, and responses.

---


With these detailed instructions, you’re ready to set up and run the Evently platform. Happy coding!

