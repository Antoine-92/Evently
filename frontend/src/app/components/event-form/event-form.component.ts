import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent implements OnInit {
  event = {
    name: '',
    date: '',
    location: '',
    description: '',
    type: '',
    participants: [] as number[],
  };

  showSuccessMessage = false;
  lastEventName = '';
  errorMessage = '';
  participantList: any[] = [];
  eventTypes = ['conference', 'workshop', 'competition'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchParticipants();
  }

  fetchParticipants() {
    const apiUrl = 'http://localhost:3000/api/participants';
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.participantList = response;
      },
      error: (err) => {
        console.error('Error fetching participants:', err);
        this.errorMessage = 'Failed to fetch participants. Please try again.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }

  onSubmit() {
    const apiUrl = 'http://localhost:3000/api/events';
    console.log('Event data:', this.event);
    this.http.post(apiUrl, this.event).subscribe({
      next: async (response: any) => {
        console.log('Event created successfully:', response);

        // Add participants to the event
        for (const participantId of this.event.participants) {
          const addParticipantUrl = `http://localhost:3000/api/events/${response.id}/participants/${participantId}`;
          await this.http.post(addParticipantUrl, {}).toPromise();
        }

        // Show success message
        this.lastEventName = this.event.name;
        this.showSuccessMessage = true;

        // Reset the form after success
        this.event = {
          name: '',
          date: '',
          location: '',
          description: '',
          type: '',
          participants: [],
        };

        setTimeout(() => {
          this.showSuccessMessage = false;
          this.router.navigate(['/events']);
        }, 3000);

      },
      error: (err) => {
        console.error('Error creating event:', err);
        this.errorMessage = 'Failed to create the event. Please try again.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }

  toggleParticipant(participantId: number, isChecked: boolean): void {
    if (isChecked) {
        // Add participant ID to the array
        if (!this.event.participants.includes(participantId)) {
            this.event.participants.push(participantId);
        }
    } else {
        // Remove participant ID from the array
        this.event.participants = this.event.participants.filter(
            id => id !== participantId
        );
    }
  }
  
  onParticipantChange(participantId: number, event: Event): void {
    const input = event.target as HTMLInputElement | null; // Add nullability here
    if (input && 'checked' in input) {
      const isChecked = input.checked;
      this.toggleParticipant(participantId, isChecked);
    } else {
      console.error('Event target is null or does not have the "checked" property.');
    }
  }
  

}
