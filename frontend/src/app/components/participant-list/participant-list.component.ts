import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ColDef, AllCommunityModule, ModuleRegistry, PaginationModule, PaginationNumberFormatterParams, } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule, PaginationModule]);

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css'],
})

export class ParticipantListComponent implements OnInit {
  rowData: any[] = [];
  colDefs: ColDef[] = [];
  isBrowser: boolean;
  loading = false;
  error: string | null = null;
  errorMessage = '';
  successMessage = '';
  pagination = true;

  public paginationPageSize = 12;
  public paginationPageSizeSelector: number[] | boolean = [12, 24, 36];
  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams,
  ) => string = (params: PaginationNumberFormatterParams) => {
    return "[" + params.value.toLocaleString() + "]";
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(PLATFORM_ID);
  }

  ngOnInit(): void {
    this.initializeGrid();
    this.fetchParticipants();
  }

  private initializeGrid(): void {
    this.colDefs = [
      { headerName: 'ID', field: 'id', sortable: true, filter: true },
      { headerName: 'Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Email', field: 'email', sortable: true, filter: true },
      {
        headerName: 'Events',
        field: 'events',
        valueFormatter: (params: any) => {
          return params.value ? params.value.join(', ') : '';
        },
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Add to Event',
        field: 'addToEvent',
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerText = 'Add to Event';
          button.classList.add('btn', 'btn-primary', 'btn-sm');
          button.onclick = () => this.router.navigate(['/relations/participant', params.data.id]);
          return button;
        },
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerText = 'Delete';
          button.classList.add('btn', 'btn-danger', 'btn-sm');
          button.onclick = () => this.deleteRow(params.data);
          return button;
        },
        sortable: false,
        filter: false,
      },
    ];
  }

  private fetchParticipants(): void {
    this.loading = true;
    const apiUrl = 'http://localhost:3000/api/participants';
    const eventApiUrl = 'http://localhost:3000/api/events/participants';
    this.http.get<any[]>(apiUrl).subscribe({
      next: async (participants: any[]) => {
        const participantPromises = participants.map(async (participant) => {
          const eventsUrl = `${eventApiUrl}/${participant.id}`;
          const events = await this.http.get<any[]>(eventsUrl).toPromise();
          return { 
            ...participant, 
            events: (events ?? []).map((event) => event.event_name) 
          };
        });
        this.rowData = await Promise.all(participantPromises);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching participants:', err);
        this.loading = false;
      },
    });
  }
  
  deleteRow(rowData: any): void {
    const deleteID = rowData.id;
    this.rowData = this.rowData.filter((row) => row.id !== deleteID);
    const apiUrl = `http://localhost:3000/api/participants/${rowData.id}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.successMessage = 'Participant deleted successfully!';
        console.log('Participant deleted successfully!');
      },
      error: (err) => console.error('Error deleting participant:', err),
    });
  }

  navigateToCreateParticipant(): void {
    this.router.navigate(['/create-participant']);
  }

  exportToCSV(): void {
    const headers = ['ID', 'Name', 'Email', 'Events'];
    const rows = this.rowData.map(participant => [
        participant.id,
        participant.name,
        participant.email,
        participant.events.join(', ') // Joining event names
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
