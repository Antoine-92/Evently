import { Application } from 'express';
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
    getAllRelations
} from './controllers';

export const setupRoutes = (app: Application): void => {
    // Event Routes
    app.get('/api/events', getAllEvents);
    app.get('/api/events/:id', getEventById);
    app.get('/api/events/participants/:participantId', getAllEventsByParticipant);
    app.post('/api/events', createEvent);
    app.put('/api/events/:id', updateEvent);
    app.delete('/api/events/:id', deleteEvent);

    // Participant Routes
    app.get('/api/participants', getAllParticipants);
    app.get('/api/participants/:id', getParticipantById);
    app.get('/api/events/:eventId/participants', getParticipantsByEvent);
    app.post('/api/participants', createParticipant);
    app.put('/api/participants/:id', updateParticipant);
    app.delete('/api/participants/:id', deleteParticipant);

    // Relations Routes
    app.get('/api/relations', getAllRelations);
    app.post('/api/events/:eventId/participants/:participantId', addParticipantToEvent);
    app.delete('/api/events/:eventId/participants/:participantId', removeParticipantFromEvent);
};
