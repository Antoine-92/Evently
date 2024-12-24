# **Evently**

Evently is a comprehensive platform designed to manage events and participants efficiently. This project is divided into two main components:
- **Frontend**: Built with Angular for an interactive user experience.
- **Backend**: Developed using Node.js and PostgreSQL for robust and scalable data management.

All the files are in TypeScript.

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
   npm install @angular/core @angular/router @angular/common @angular/forms ag-grid-community ag-grid-angular highcharts
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

# Mock Data for Initializing the App

### SQL Script to Insert Data


1. Insert 15 AI-Related Events

```sql
INSERT INTO events (name, date, location, description, type)
VALUES 
('AI Revolution Conference', '2024-01-15', 'Paris', 'A gathering to discuss the future of AI across industries.', 'conference'),
('Deep Learning Workshop', '2024-02-10', 'Lyon', 'Hands-on workshop on advanced deep learning techniques.', 'workshop'),
('AI Coding Competition', '2024-03-05', 'Marseille', 'A competitive coding event focusing on AI challenges.', 'competition'),
('AI Ethics Seminar', '2024-04-20', 'Nantes', 'Exploring the ethical implications of AI technologies.', 'seminar'),
('AI in Healthcare Webinar', '2024-05-15', 'Online (France)', 'Discussing AI applications in the healthcare sector.', 'webinar'),
('AI Enthusiasts Meetup', '2024-06-18', 'Lille', 'Networking meetup for AI professionals and enthusiasts.', 'meetup'),
('AI Trends Keynote Conference', '2024-07-25', 'Paris', 'Keynote speeches from leading AI experts.', 'conference keynote'),
('AI Hackathon 2024', '2024-08-30', 'Lyon', '24-hour hackathon focused on innovative AI solutions.', 'hackathon'),
('Machine Learning Training', '2024-09-12', 'Nantes', 'Intensive training session on machine learning models.', 'training session'),
('AI and Society Roundtable', '2024-10-20', 'Marseille', 'Roundtable discussion on AI\'s impact on society.', 'roundtable'),
('Generative AI Workshop', '2024-11-10', 'Paris', 'Workshop on building generative AI models.', 'workshop'),
('Natural Language Processing Seminar', '2024-11-25', 'Lille', 'Exploring NLP applications in various fields.', 'seminar'),
('AI Startups Pitch Competition', '2024-12-05', 'Nantes', 'Pitch competition for AI-focused startups.', 'competition'),
('Autonomous Systems Conference', '2024-12-15', 'Marseille', 'Conference on AI in autonomous systems.', 'conference'),
('AI Leadership Roundtable', '2024-12-20', 'Lyon', 'Discussion with AI leaders on industry challenges.', 'roundtable');
```
2. Insert 15 Participants

```sql
INSERT INTO participants (name, email)
VALUES 
('Alice Martin', 'alice.martin@example.com'),
('Bob Dupont', 'bob.dupont@example.com'),
('Charlie Durand', 'charlie.durand@example.com'),
('Diana Lefevre', 'diana.lefevre@example.com'),
('Edward Girard', 'edward.girard@example.com'),
('Fiona Roche', 'fiona.roche@example.com'),
('George Blanchard', 'george.blanchard@example.com'),
('Hannah Fontaine', 'hannah.fontaine@example.com'),
('Ian Lambert', 'ian.lambert@example.com'),
('Julia Noel', 'julia.noel@example.com'),
('Kevin Petit', 'kevin.petit@example.com'),
('Laura Bernard', 'laura.bernard@example.com'),
('Maxime Vidal', 'maxime.vidal@example.com'),
('Nina Moreau', 'nina.moreau@example.com'),
('Olivier Fabre', 'olivier.fabre@example.com');
```
3. Relate 2 Participants to Each Event
```sql
INSERT INTO event_participants (event_id, participant_id)
VALUES 
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 6),
(4, 7), (4, 8),
(5, 9), (5, 10),
(6, 11), (6, 12),
(7, 13), (7, 14),
(8, 15), (8, 1),
(9, 2), (9, 3),
(10, 4), (10, 5),
(11, 6), (11, 7),
(12, 8), (12, 9),
(13, 10), (13, 11),
(14, 12), (14, 13),
(15, 14), (15, 15);
```
With this mock data, your application is pre-populated with AI-related events and participants, providing a realistic starting point for testing. These SQL scripts can be executed sequentially to initialize the database and establish relationships between events and participants.

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