import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-relation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relation-form.component.html',
  styleUrls: ['./relation-form.component.css'],
})

export class RelationFormComponent implements OnInit {
  participants: any[] = [];
  events: any[] = [];
  relations: { event_id: number; participant_id: number }[] = [];
  selectedParticipantId: number | null = null;
  selectedEventId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.fetchParticipants();
    this.fetchEvents();
    this.fetchRelations();
    this.route.params.subscribe((params) => {
      const eventId = params['eventId'];
      const participantId = params['participantId'];
      if (eventId) {
        this.selectedEventId = Number(eventId);
      }
      if (participantId) {
        this.selectedParticipantId = Number(participantId);
      }
    });
  }

  fetchParticipants() {
    const apiUrlParticipants = 'http://localhost:3000/api/participants';
    this.http.get(apiUrlParticipants).subscribe(
      (data: any) => {
        this.participants = data;
      },
      (error) => console.error('Failed to fetch participants:', error)
    );
  }
  
  fetchEvents() {
    const apiUrlEvents = 'http://localhost:3000/api/events';
    this.http.get(apiUrlEvents).subscribe(
      (data: any) => {
        this.events = data;
      },
      (error) => console.error('Failed to fetch events:', error)
    );
  }
  
  fetchRelations() {
    const apiUrlRelations = 'http://localhost:3000/api/relations';
    this.http.get(apiUrlRelations).subscribe(
      (data: any) => {
        this.relations = data;
      },
      (error) => console.error('Failed to fetch relations:', error)
    );
  }
  
  isParticipantInEvent(): boolean {
    const isInEvent = this.relations.some(
      (relation) =>
        Number(relation.event_id) === Number(this.selectedEventId) &&
        Number(relation.participant_id) === Number(this.selectedParticipantId)
    );
    return isInEvent;
  }

  addParticipantToEvent() {
    if (!this.selectedEventId || !this.selectedParticipantId) {
      this.errorMessage = 'Please select both an event and a participant.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }
    if (this.isParticipantInEvent()) {
      this.errorMessage = 'Participant is already in the event.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }
    const apiUrlPost = `http://localhost:3000/api/events/${this.selectedEventId}/participants/${this.selectedParticipantId}`;
    this.http.post(apiUrlPost, {}).subscribe(
      () => {
        this.successMessage = 'Participant added to the event successfully!';
        this.errorMessage = '';
        this.cdr.detectChanges(); // Trigger change detection
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges(); // Trigger change detection again
        }, 3000);
        this.fetchRelations();
        this.selectedEventId = null;
        this.selectedParticipantId = null;
      },
      (error) => {
        console.error('Failed to add participant to event', error);
        this.errorMessage = 'Failed to add participant to the event.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
  
}
