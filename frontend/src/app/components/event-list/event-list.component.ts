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
          id: event.event_id,
          participants: event.participants || []
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
    const typeLower = type.toLowerCase();

    const typeStyles: { [key: string]: string } = {
        'conference': 'success',   
        'workshop': 'warning',           
        'competition': 'danger',     
        'seminar': 'info',               
        'webinar': 'primary',      
        'meetup': 'secondary',         
        'conference keynote': 'dark',   
        'hackathon': 'purple',        
        'training session': 'lime',      
        'roundtable': 'teal',          
    };

    return typeStyles[typeLower] || 'primary';
  }

  getTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'conference':
        return 'bi-people-fill'; 
      case 'workshop':
        return 'bi-tools'; 
      case 'competition':
        return 'bi-trophy-fill';
      case 'seminar':
        return 'bi-microphone'; 
      case 'webinar':
        return 'bi-tv'; 
      case 'meetup':
        return 'bi-person-lines-fill'; 
      case 'conference keynote':
        return 'bi-flag-fill'; 
      case 'hackathon':
        return 'bi-brain'; 
      case 'training session':
        return 'bi-person-check'; 
      case 'roundtable':
        return 'bi-table';
      default:
        return 'bi-journal-code';
    }
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  exportToCSV(): void {
    const headers = ['ID', 'Event Name', 'Type', 'Date', 'Location', 'Description', 'Participants'];
    const rows = this.events.map(event => [
      event.id,
      event.event_name,
      this.capitalize(event.type),
      this.formatDate(event.date),
      event.location,
      event.description,
      event.participants.map((p: { name: any; }) => p.name).join(', ')
    ]);
  
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
