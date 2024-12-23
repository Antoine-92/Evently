import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    const apiUrl = 'http://localhost:3000/api/events';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.events = data.map(event => ({
          ...event,
          participants: event.participants || [] // Assurez-vous que la liste des participants est toujours initialisée
        }));
      },
      error: (err) => {
        console.error('Failed to fetch events:', err);
        this.errorMessage = 'Could not fetch events. Please try again later.';
      }
    });
  }


  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  onDeleteEvent(eventId: number) {
    const apiUrl = `http://localhost:3000/api/events/${eventId}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.successMessage = 'Event deleted successfully!';
        this.events = this.events.filter(event => event.id !== eventId);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to delete event:', err);
        this.errorMessage = 'Could not delete the event. Please try again later.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  onEditEvent(eventId: number) {
    this.router.navigate(['/edit-event', eventId]);
  }  

  navigateToCreateEvent(): void {
    this.router.navigate(['/create-event']);
  }

  getTypeStyle(type: string): string {
    switch (type.toLowerCase()) {
      case 'conference':
        return 'success'; // Green
      case 'workshop':
        return 'warning'; // Orange
      case 'competition':
        return 'danger'; // Red
      default:
        return 'primary'; // Blue
    }
  }
  
  getTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'conference':
        return 'bi-people-fill'; // Icon for conference
      case 'workshop':
        return 'bi-tools'; // Icon for workshop
      case 'competition':
        return 'bi-trophy-fill'; // Icon for competition
      default:
        return 'bi-journal-code'; // Icon for general
    }
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  
  
}
