# **Evently**

Evently is a platform designed to manage events and participants. This project is divided into two main components:
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

## Step 2: Set Up the PostgreSQL Database

### With a sql script

#### Create the SQL Script
1. Create a file named `setup_event_management.sql` and include the following content:

   ```sql
   -- Create the `events` table
   CREATE SEQUENCE events_id_seq;

   CREATE TABLE events (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       date DATE NOT NULL,
       location VARCHAR(150),
       description TEXT,
       type VARCHAR(50) NOT NULL DEFAULT 'general'
   );

   -- Create the `participants` table
   CREATE SEQUENCE participants_id_seq;

   CREATE TABLE participants (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(150) NOT NULL UNIQUE
   );

   -- Create the `event_participants` table
   CREATE TABLE event_participants (
       event_id INTEGER NOT NULL,
       participant_id INTEGER NOT NULL,
       PRIMARY KEY (event_id, participant_id),
       CONSTRAINT event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
       CONSTRAINT event_participants_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
   );

   -- Create the `users` table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,               
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   Save this file in a directory accessible to your PostgreSQL client.


#### Run the Script in `psql`

1. Open a terminal or command prompt and navigate to the directory where the script file is located.
2. Log in to your PostgreSQL server using `psql`:

3. Create the database:
   ```sql
   CREATE DATABASE event_management;
   ```

4. Switch to the `event_management` database:
   ```bash
   \c event_management
   ```

5. Execute the script:
   ```bash
   \i setup_event_management.sql
   ```

### OR Manual Setup


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

#### **Create the `users` Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,               
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

```

### Verify the Tables
 Verify the tables have been created:
   ```sql
   \dt
   ```
   You should see the following tables:
   - `events`
   - `participants`
   - `event_participants`
   - `users`

---

## **Step 3: Configure the Backend**

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. replace placeholders with your database credentials into `config.ts` and into `.env` file:
   ```plaintext
    user: process.env.DB_USER || 'your_database_user',
    host: process.env.DB_HOST || 'your_database_host',
    database: process.env.DB_NAME || 'event_management',
    password: process.env.DB_PASSWORD || 'your_database_password',
    port: parseInt(process.env.DB_PORT || '5432'),
   ```
3. Install backend dependencies:
   ```bash
   npm install pg dotenv express cors swagger-jsdoc swagger-ui-express bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken
   ```
4. Start the backend server:
   ```bash
   npm run start
   ```
5. Verify the backend is running:
   Open your browser and navigate to [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

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

## **Video Demonstration**

To better understand the features and functionality of Evently, watch the video demonstration below:

[![Watch the video](https://img.youtube.com/vi/fWRE8H6IOT0/0.jpg)](https://www.youtube.com/watch?v=fWRE8H6IOT0)

---

## **Application Pages**

Below is a detailed description of the main pages in the Evently application, outlining their features and functionalities:


### **1. Events Page**
This page displays a comprehensive list of all events with the following details for each event:
- **Name**: The name of the event.
- **Type**: The category or type of the event.
- **Date**: The scheduled date of the event.
- **Location**: The venue or place where the event will occur.
- **Description**: A brief description of the event.
- **Participants**: A list of all participants associated with the event.

**Key Features**:
- **Edit Event**: Modify all attributes of an event directly from this page.
- **Delete Event**: Remove an event and its associated data.
- **Export to CSV**: Download the list of events, including their details and participants, in a CSV file format.


### **2. Create Event Page**
This page allows users to create a new event. Users can:
- Add all event properties, including name, type, date, location, and description.
- Assign participants to the event during creation.


### **3. Edit Event Page**
On this page, users can:
- Modify any attribute of an existing event, such as its name, type, date, location, or description.
- Add new participants to the event.
- Remove participants from the event.

### **4. Participants Page**
The participants page displays all participants in an **AG Grid** with the following attributes:
- **Name**: The full name of the participant.
- **Email**: The participant’s email address.
- **Event**: The list of event attended by participant

**Key Features**:
- **Add to Events**: Assign participants to one or more events.
- **Remove Participants**: Delete participants from the database.
- **Export to CSV**: Download the list of participants with their details in a CSV file.

### **5. Create Participant Page**
This page allows users to create a new participant by:
- Adding the participant's name.
- Adding the participant's email address.

### **6. Relations Page**
The relations page is designed to facilitate creating relationships between events and participants.

**Features**:
- **Endpoint Relations**:
  - `relations/event/:eventId`: Pre-fills the form with the details of the specified event.
  - `relations/participant/:participantId`: Pre-fills the form with the details of the specified participant.

Users can easily establish connections between participants and events using these endpoints.

### **7. Statistics Page**
This page provides a dashboard showcasing key statistics and visualizations for events and participants.

**Graphs and Visualizations**:
- **Event Statistics by Type**:  
  A **pie chart** representing the distribution of events across different types.

- **Event by Location**:  
  A **column chart** displaying the number of events per location:
  - **Green Bars**: Locations with the highest number of participants.
  - **Red Bars**: Locations with the least number of participants.

- **Participant by Location**:  
  A **column chart** showing the distribution of participants across different locations:
  - **Green Bars**: Locations with the most participants.
  - **Red Bars**: Locations with the fewest participants.

- **Participant by Event Type**:  
  A **column chart** illustrating the number of participants for each type of event.

- **Event by Month**:  
  A **line chart** plotting the number of events organized each month throughout the year.

---

## **Project Structure**

```
Evently/
|
|-- backend/                 # Backend code (Node.js)
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
|   |-- .vscode/             # VSCode settings
|   |-- evently-frontend/    # Angular project root
|   |-- public/              # Public assets
|   |-- src/                 # Angular source code
|       |-- app/             # Main app folder
|           |-- components/  # Angular components
|           |-- guards/      # Authentification guard to protect app
|           |-- services/    # Angular services
|           |-- app.component.*  # Root app files
|           |-- app.routes.ts   # App routing
|       |-- environments/    # Environment configurations
|       |-- index.html       # Main HTML file
|       |-- main.ts          # Angular bootstrap file
|       |-- styles.css       # Global styles
|   |-- .editorconfig        # Editor settings
|   |-- .gitignore           # Git ignore file
|   |-- README.md            # Frontend documentation
|   |-- angular.json         # Angular project configuration
|   |-- package.json         # NPM configuration
|   |-- package-lock.json    # NPM lock file
|   |-- tsconfig.*.json      # TypeScript configurations
|   |-- server.ts            # server-side rendering
|
|-- README.md                # Project documentation
|-- openapitools.json        # Config for OpenAPI Swagger documentation
```

---

## Mock Data for Initializing the App

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
('AI and Society Roundtable', '2024-10-20', 'Marseille', 'Roundtable discussion on AI impact on society.', 'roundtable'),
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
With this mock data, the application is pre-populated with AI-related events and participants, providing a realistic starting point for testing.

---

## **Troubleshooting**

### Common Issues
1. **Database Connection Error**:
   - Ensure PostgreSQL is running.
   - Verify `config.ts` & `.env` variables are correctly configured.
   - Test the connection to the database manually using `psql` or a database client.

2. **Port Conflicts**:
   - If `3000` or `4200` is in use, update the `PORT` variable in `config.ts` & `.env` or Angular CLI configuration.

3. **Dependency Issues**:
   - Run `npm install` again in the respective folder.

---

## Advanced Features

### CSV Export for Events and Participants

The application includes a CSV export feature, enabling users to easily retrieve and share event data or participant information in a structured format compatible with spreadsheet software.

**Key Features:**
- **Export Event Data:**  
  The exported CSV file for events includes the following columns:
  - Event ID  
  - Event Name  
  - Type  
  - Date  
  - Location  
  - Description  
  - Participants (names listed as a comma-separated string)  

- **Export All Participants:**  
  The exported CSV file for participants includes the following columns:
  - Participant ID  
  - Name  
  - Email  
  - Events (names listed as a comma-separated string)

**How It Works:**  
- The file is generated dynamically based on the current data in the application.  
- Users can download the CSV file with a single click.


### Authentication with JWT

The application features a robust authentication system using JSON Web Tokens (JWT).

**Key Features:**
- **User Login:**  
  - Users can log in with their email and password to receive a JWT token for authenticated access.  
  - The token is valid for 1 hour and is used to authorize subsequent requests.

- **User Registration:**  
  - New users can register by providing an email and password.  
  - Passwords are securely hashed before storage in the database to ensure user data safety.

- **Authentication Guard:**  
  - An `AuthGuard` is implemented to protect routes in the application.  
  - If a valid JWT token is not present in `localStorage`, the user is redirected to the login page.

**How it works:**
1. **Login Workflow:**  
   - Users send their credentials (`email` and `password`) to the `/api/auth/login` endpoint.  
   - The server validates the credentials and generates a JWT token upon successful authentication.  
   - The token is stored in the client's `localStorage` and used for subsequent requests.

2. **Registration Workflow:**  
   - New users send their email and password to the `/api/auth/register` endpoint.  
   - The server hashes the password, checks for duplicate emails, and creates a new user in the database.

3. **Route Protection:**  
   - The `AuthGuard` checks for the presence of a valid token in `localStorage`.  
   - If no token is found, the user is redirected to the login page.

#### Endpoints
- `POST /api/auth/login`: Authenticates users and returns a JWT token.
- `POST /api/auth/register`: Registers new users and stores their credentials securely.

#### Example Workflow
1. **Register**:  
   A user creates an account through the registration form.
   
2. **Login**:  
   The user logs in and receives a JWT token, which is automatically stored.

3. **Access Protected Routes**:  
   The token is included in the `Authorization` header for requests to protected endpoints, granting the user access.

#### Protecting Backend Routes

To secure backend routes, the application uses an authentication middleware that verifies the presence and validity of a JWT token in the `Authorization` header of incoming requests. If the token is missing, invalid, or expired, the middleware denies access with appropriate status codes (`401 Unauthorized` or `403 Forbidden`). For valid tokens, the middleware decodes the token, attaches the user information to the request object, and allows access to the protected routes. This ensures only authenticated users can access sensitive resources, with any unauthorized requests being gracefully handled through descriptive error responses.

---

## **API Documentation**

The API documentation is available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs). It provides detailed information about the available endpoints, request formats, and responses.

---


With these detailed instructions, you’re ready to set up and run the Evently platform. Happy coding!