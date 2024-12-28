import { Application } from 'express';
import { authenticateToken } from './authMiddleware';
import dotenv from 'dotenv';
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    addParticipantToEvent,
    removeParticipantFromEvent,
    getParticipantsByEvent,
    getAllEventsByParticipant,
    getAllRelations,
    loginUser,
    registerUser
} from './controllers';

dotenv.config();

export const setupRoutes = (app: Application): void => {
    // Event Routes
    app.get('/api/events', authenticateToken, getAllEvents);
    app.get('/api/events/:id', authenticateToken, getEventById);
    app.get('/api/events/participants/:participantId', authenticateToken, getAllEventsByParticipant);
    app.post('/api/events', authenticateToken, createEvent);
    app.put('/api/events/:id', authenticateToken, updateEvent);
    app.delete('/api/events/:id', authenticateToken, deleteEvent);

    // Participant Routes
    app.get('/api/participants', authenticateToken, getAllParticipants);
    app.get('/api/participants/:id', getParticipantById);
    app.get('/api/events/:eventId/participants', authenticateToken, getParticipantsByEvent);
    app.post('/api/participants', authenticateToken, createParticipant);
    app.put('/api/participants/:id', authenticateToken, updateParticipant);
    app.delete('/api/participants/:id', authenticateToken, deleteParticipant);

    // Relations Routes
    app.get('/api/relations', authenticateToken, getAllRelations);
    app.post('/api/events/:eventId/participants/:participantId', authenticateToken, addParticipantToEvent);
    app.delete('/api/events/:eventId/participants/:participantId', authenticateToken, removeParticipantFromEvent);

    app.post('/api/auth/login', loginUser);
    app.post('/api/auth/register', registerUser);
};