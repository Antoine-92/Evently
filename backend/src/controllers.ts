import { Request, Response } from 'express';
import { Pool } from 'pg';

// Configuration of PostgreSQL database
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'event_management',
    password: process.env.DB_PASSWORD || 'Antoine92',
    port: parseInt(process.env.DB_PORT || '5432'),
});

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: API for managing events
 *   - name: Participants
 *     description: API for managing participants
 *   - name: Relations
 *     description: API for managing relations between events and participants
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get all events
 *     description: Retrieve a list of all events along with their participants.
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: integer
 *                     example: 1
 *                   event_name:
 *                     type: string
 *                     example: "Tech Meetup"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-23"
 *                   location:
 *                     type: string
 *                     example: "San Francisco"
 *                   description:
 *                     type: string
 *                     example: "A meetup for tech enthusiasts."
 *                   type:
 *                     type: string
 *                     example: "Workshop"
 *                   participants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 */
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id AS event_id,
                e.name AS event_name,
                e.date,
                e.location,
                e.description,
                e.type,
                json_agg(json_build_object('id', p.id, 'name', p.name, 'email', p.email)) AS participants
            FROM events e
            LEFT JOIN event_participants ep ON e.id = ep.event_id
            LEFT JOIN participants p ON ep.participant_id = p.id
            GROUP BY e.id
            ORDER BY e.date;
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Failed to retrieve events with participants:', error);
        res.status(500).json({ error: 'Failed to retrieve events with participants' });
    }
};


/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get event by ID
 *     description: Retrieve details of a specific event.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Event details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 location:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *       404:
 *         description: Event not found.
 */
export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params; 

    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve event' });
    }
};


/**
 * @swagger
 * /api/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Add a new event to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully.
 *       500:
 *         description: Failed to create event.
 */
export const createEvent = async (req: Request, res: Response) => {
    const { name, type, date, location, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO events (name, date, location, description, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, date, location, description, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
};

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an event
 *     description: Modify details of an existing event.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Failed to update event.
 */
export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, date, location, description, type } = req.body;

    try {
        const result = await pool.query(
            'UPDATE events SET name = $1, date = $2, location = $3, description = $4, type = $5 WHERE id = $6 RETURNING *',
            [name, date, location, description, type, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event
 *     description: Remove an event from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Failed to delete event.
 */
export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};

//------------------------------------------------------- Participants --------------------------------------------------------------//

/**
 * @swagger
 * /api/participants:
 *   get:
 *     tags:
 *       - Participants
 *     summary: Get all participants
 *     description: Retrieve a list of all participants.
 *     responses:
 *       200:
 *         description: A list of participants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
export const getAllParticipants = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM participants');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve participants' });
    }
};

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     tags:
 *       - Participants
 *     summary: Get participant by ID
 *     description: Retrieve details of a specific participant.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the participant
 *     responses:
 *       200:
 *         description: Participant details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Participant not found.
 */
export const getParticipantById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM participants WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve participant' });
    }
};

/**
 * @swagger
 * /api/participants:
 *   post:
 *     tags:
 *       - Participants
 *     summary: Create a new participant
 *     description: Add a new participant to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: Participant created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       500:
 *         description: Failed to create participant.
 */
export const createParticipant = async (req: Request, res: Response) => {
    const { name, email, event_id } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO participants (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create participant' });
    }
};


/**
 * @swagger
 * /api/participants/{id}:
 *   put:
 *     tags:
 *       - Participants
 *     summary: Update a participant
 *     description: Update the details of an existing participant.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to update.
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *     responses:
 *       200:
 *         description: Participant updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   example: "jane.doe@example.com"
 *       404:
 *         description: Participant not found.
 *       500:
 *         description: Failed to update participant.
 */
export const updateParticipant = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, event_id } = req.body;

    try {
        const result = await pool.query(
            'UPDATE participants SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update participant' });
    }
};


/**
 * @swagger
 * /api/participants/{id}:
 *   delete:
 *     tags:
 *       - Participants
 *     summary: Delete a participant
 *     description: Remove a participant from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to delete.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Participant deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Participant deleted successfully"
 *       404:
 *         description: Participant not found.
 *       500:
 *         description: Failed to delete participant.
 */
export const deleteParticipant = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM participants WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        res.status(200).json({ message: 'Participant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete participant' });
    }
};

//------------------------------------------------------- Relations --------------------------------------------------------------//

/**
 * @swagger
 * /api/relations:
 *   get:
 *     tags:
 *       - Relations
 *     summary: Get all event-participant relations
 *     description: Retrieve a list of all relations between events and participants.
 *     responses:
 *       200:
 *         description: List of event-participant relations retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   event_id:
 *                     type: integer
 *                     example: 10
 *                   participant_id:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: Failed to retrieve relations due to server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve relations"
 */
export const getAllRelations = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM event_participants');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Failed to retrieve relations:', error);
        res.status(500).json({ error: 'Failed to retrieve relations' });
    }
};


/**
 * @swagger
 * /api/participants/{participantId}/events:
 *   get:
 *     tags:
 *       - Relations
 *     summary: Get all events by participant
 *     description: Retrieve all events that a specific participant is associated with.
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         description: ID of the participant.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: integer
 *                     example: 1
 *                   event_name:
 *                     type: string
 *                     example: "Tech Meetup"
 *       500:
 *         description: Failed to retrieve events for the participant.
 */
export const getAllEventsByParticipant = async (req: Request, res: Response) => {
    const { participantId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT 
                e.id AS event_id,
                e.name AS event_name
            FROM events e
            INNER JOIN event_participants ep ON e.id = ep.event_id
            WHERE ep.participant_id = $1
            ORDER BY e.name;
            `,
            [participantId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Failed to retrieve events for participant:', error);
        res.status(500).json({ error: 'Failed to retrieve events for participant' });
    }
};


/**
 * @swagger
 * /api/events/{eventId}/participants:
 *   get:
 *     tags:
 *       - Relations
 *     summary: Get participants of an event
 *     description: Retrieve participants associated with a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: List of participants for the event.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
export const getParticipantsByEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                p.id AS participant_id,
                p.name AS participant_name,
                p.email
            FROM participants p
            INNER JOIN event_participants ep ON p.id = ep.participant_id
            WHERE ep.event_id = $1
            ORDER BY p.name;
        `, [eventId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Failed to retrieve participants for event:', error);
        res.status(500).json({ error: 'Failed to retrieve participants' });
    }
};


/**
 * @swagger
 * /api/events/{eventId}/participants/{participantId}:
 *   post:
 *     tags:
 *       - Relations
 *     summary: Add participant to an event
 *     description: Associate a participant with a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *       - in: path
 *         name: participantId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the participant
 *     responses:
 *       201:
 *         description: Participant added to event successfully.
 *       500:
 *         description: Failed to add participant to event.
 */
export const addParticipantToEvent = async (req: Request, res: Response) => {
    const { eventId, participantId } = req.params;

    try {
        const result = await pool.query(
            'INSERT INTO event_participants (event_id, participant_id) VALUES ($1, $2) RETURNING *',
            [eventId, participantId]
        );
        res.status(201).json({ message: 'Participant added to event successfully', association: result.rows[0] });
    } catch (error) {
        console.error('Failed to add participant to event:', error);
        res.status(500).json({ error: 'Failed to add participant to event' });
    }
};


/**
 * @swagger
 * /api/events/{eventId}/participants/{participantId}:
 *   delete:
 *     tags:
 *       - Relations
 *     summary: Remove participant from an event
 *     description: Disassociate a participant from a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *       - in: path
 *         name: participantId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the participant
 *     responses:
 *       200:
 *         description: Participant removed from event successfully.
 *       404:
 *         description: Association not found.
 *       500:
 *         description: Failed to remove participant from event.
 */
export const removeParticipantFromEvent = async (req: Request, res: Response) => {
    const { eventId, participantId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM event_participants WHERE event_id = $1 AND participant_id = $2 RETURNING *',
            [eventId, participantId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Association not found' });
        }
        res.status(200).json({ message: 'Participant removed from event successfully' });
    } catch (error) {
        console.error('Failed to remove participant from event:', error);
        res.status(500).json({ error: 'Failed to remove participant from event' });
    }
};