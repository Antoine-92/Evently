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
    app.get('/api/events/participants/:participantId', getAllEventsByParticipant); // New route to get all events for a participant
    app.post('/api/events', createEvent);
    app.put('/api/events/:id', updateEvent);
    app.delete('/api/events/:id', deleteEvent);

    // Participant Routes
    app.get('/api/participants', getAllParticipants); // Get all participants
    app.get('/api/participants/:id', getParticipantById); // Get one participant by ID
    app.get('/api/events/:eventId/participants', getParticipantsByEvent); // Route to get participants with their event association
    app.post('/api/participants', createParticipant); // Create a new participant
    app.put('/api/participants/:id', updateParticipant); // Update a participant by ID
    app.delete('/api/participants/:id', deleteParticipant); // Delete a participant by ID

    // Event-Participant Association Routes
    app.get('/api/relations', getAllRelations);
    app.post('/api/events/:eventId/participants/:participantId', addParticipantToEvent); // Add participant to event
    app.delete('/api/events/:eventId/participants/:participantId', removeParticipantFromEvent);// Add route to delete the participant association
};
