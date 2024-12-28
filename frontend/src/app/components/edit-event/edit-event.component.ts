import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColDef, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [FormsModule, CommonModule, AgGridModule],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent {
  event = {
    name: '',
    date: '',
    location: '',
    description: '',
    type: '',
    participants: [] as number[],
  };

  eventTypes = [
    'conference',
    'workshop',
    'competition',
    'seminar',
    'webinar',
    'meetup',
    'conference keynote',
    'hackathon',
    'training session',
    'roundtable',
  ];

  participantList: any[] = [];
  showSuccessMessage = false;
  colDefs: ColDef[] = [];
  eventId!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.params['id'];
    this.fetchEvent(this.eventId);
    this.fetchParticipants();
    this.fetchEventParticipants(this.eventId);
    this.initializeGrid();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Ensure the user is logged in.');
      return new HttpHeaders();
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchParticipants() {
    const apiUrl = 'http://localhost:3000/api/participants';
    this.http.get(apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (response: any) => {
        this.participantList = response;
      },
      error: (err) => {
        console.error('Error fetching participants:', err);
      },
    });
  }

  fetchEvent(eventId: number) {
    const apiUrl = `http://localhost:3000/api/events/${eventId}`;
    this.http.get<any>(apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.event = {
          ...data,
          date: this.formatDate(data.date), 
        };
      },
      error: (err) => {
        console.error('Failed to fetch event:', err);
      },
    });
  }

  fetchEventParticipants(eventId: number) {
    const participantsApiUrl = `http://localhost:3000/api/events/${eventId}/participants`;
    this.http.get<any[]>(participantsApiUrl, { headers: this.getHeaders() }).subscribe({
      next: (participants) => {
        this.event.participants = participants;
      },
      error: (err) => {
        console.error('Failed to fetch event participants:', err);
      },
    });
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Extract only the "yyyy-MM-dd" part
  }

  onSubmit() {
    const eventId = this.route.snapshot.params['id'];
    const apiUrl = `http://localhost:3000/api/events/${eventId}`;

    const adjustedDate = this.event.date;

    const updatedEvent = {
      ...this.event,
      date: `${adjustedDate}T00:00:00.000Z`,
    };

    this.http.put(apiUrl, updatedEvent, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.showSuccessMessage = false;
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Failed to update event:', err);
      },
    });
  }

  addOneDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  private initializeGrid(): void {
    this.colDefs = [
      { headerName: 'ID', field: 'participant_id', sortable: true, filter: true },
      { headerName: 'Name', field: 'participant_name', sortable: true, filter: true },
      { headerName: 'Email', field: 'email', sortable: true, filter: true },
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.textContent = 'Remove';
          button.classList.add('btn', 'btn-danger', 'btn-sm');
          button.addEventListener('click', () => this.removeParticipant(params.data.participant_id));
          return button;
        },
        width: 100,
      },
    ];
  }

  removeParticipant(participantId: number): void {
    const apiUrl = `http://localhost:3000/api/events/${this.eventId}/participants/${participantId}`;
    this.http.delete(apiUrl, { headers: this.getHeaders() }).subscribe({
      next: () => {
        console.log(`Participant ${participantId} removed successfully.`);
        if (Array.isArray(this.event.participants)) {
          this.event.participants = this.event.participants.filter(
            (participant: any) => participant.participant_id !== participantId
          );
        }
      },
      error: (err) => {
        console.error('Failed to remove participant:', err);
      },
    });
  }

  openAddParticipantModal() {
    this.router.navigate(['/relations/event/', this.eventId]);
  }
}
