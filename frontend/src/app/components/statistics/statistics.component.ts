import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})

export class StatisticsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  totalParticipantions: number = 0;
  totalParticipants: number = 0;
  avgParticipantsPerEvent: number = 0;
  topLocations: { location: string; count: number }[] = [];
  peakSeason: string = '';
  loading = false;
  errorMessage: string | null = null;

  pieChartOptions: Highcharts.Options = {
    title: { text: 'Event Statistics by Type' },
    accessibility: { enabled: false },
    series: [{ type: 'pie', data: [] }],
  };

  barChartOptions1: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Event Statistics by Location' },
    accessibility: { enabled: false },
    xAxis: { categories: [], title: { text: 'Locations' } },
    yAxis: { title: { text: 'Event Count' } },
    legend: { enabled: false },
    series: [{ type: 'column', name: 'Events', data: [] }],
  };
  
  lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: 'Monthly Event Trends' },
    accessibility: { enabled: false },
    xAxis: { categories: [], title: { text: 'Months' } },
    yAxis: { title: { text: 'Event Count' } },
    series: [{ type: 'line', name: 'Events', data: [] }],
  };

  scatterChartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Event Type vs. Participants' },
    accessibility: { enabled: false },
    xAxis: { title: { text: 'Event Type' } },
    yAxis: { title: { text: 'Number of Participants' } },
    legend: { enabled: false },
    series: [{ type: 'column', data: [] }],
  };

  barChartOptions2: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Participants by Event Location' },
    accessibility: { enabled: false },
    xAxis: { categories: [], title: { text: 'Locations' } },
    yAxis: { title: { text: 'Number of Participants' } },
    legend: { enabled: false },
    series: [{ type: 'column', name: 'Participants', data: [] }],
  };
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Ensure the user is logged in.');
      return new HttpHeaders();
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchStatistics(): void {
    this.loading = true;

    const apiUrl = 'http://localhost:3000/api/events';
    this.http.get<any[]>(apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.updateCharts(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch statistics:', error);
        this.errorMessage = 'Failed to load statistics';
        this.loading = false;
      },
    });
    this.loading = true;
    const apiUrl2 = 'http://localhost:3000/api/events';
    this.http.get<any[]>(apiUrl2, { headers: this.getHeaders() }).subscribe({
      next: (events) => {
        this.calculateTotalParticipantions(events);
        this.calculateTotalParticipants(events);
        this.calculateAvgParticipants(events);
        this.findTopLocations(events);
        this.determinePeakSeason(events);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch statistics:', error);
        this.errorMessage = 'Failed to load statistics';
        this.loading = false;
      },
    });
  }

  updateCharts(events: any[]): void {
    this.updatePieChart(events);
    this.updateBarChart(events);
    this.updateLineChart(events);
    this.updateScatterChart(events);
    this.updateParticipantsByLocationChart(events);
  }

  updatePieChart(events: any[]): void {
    const typeCounts: Record<string, number> = {};
    events.forEach((event) => {
      const eventType = event.type;
      typeCounts[eventType] = (typeCounts[eventType] || 0) + 1;
    });
    const chartData = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      y: count,
    }));
    this.pieChartOptions = {
      ...this.pieChartOptions,
      series: [{ type: 'pie', data: chartData }],
    };
  }
  
  updateBarChart(events: any[]): void {
    const locationCounts: Record<string, number> = {};
    events.forEach((event) => {
        const location = event.location;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    const minCount = Math.min(...Object.values(locationCounts));
    const maxCount = Math.max(...Object.values(locationCounts));
    const categories = Object.keys(locationCounts);
    const data = Object.entries(locationCounts).map(([location, count]) => {
        let color = undefined;
        if (count === maxCount) {
            color = 'green';
        } else if (count === minCount) {
            color = 'red';
        }
        return {
            y: count,
            color: color,
        };
    });
    this.barChartOptions1 = {
        ...this.barChartOptions1,
        xAxis: { ...this.barChartOptions1.xAxis, categories },
        series: [{
            type: 'column',
            name: 'Events',
            data: data,
        }],
    };
  }

  updateParticipantsByLocationChart(events: any[]): void {
    const locationParticipantCounts: Record<string, number> = {};
    events.forEach((event) => {
        const location = event.location || 'Unknown';
        locationParticipantCounts[location] =
            (locationParticipantCounts[location] || 0) + (event.participants?.length || 0);
    });
    const categories = Object.keys(locationParticipantCounts);
    const data = Object.entries(locationParticipantCounts).map(([location, count]) => {
        let color = undefined;
        if (count === Math.max(...Object.values(locationParticipantCounts))) {
            color = 'green';
        } else if (count === Math.min(...Object.values(locationParticipantCounts))) {
            color = 'red';
        }
        return {
            y: count,
            color: color,
        };
    });
    this.barChartOptions2 = {
        ...this.barChartOptions2,
        xAxis: { ...this.barChartOptions2.xAxis, categories },
        series: [{ type: 'column', name: 'Participants', data }],
    };
  }

  updateLineChart(events: any[]): void {
    const monthlyCounts: Record<string, number> = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    const categories = Object.keys(monthlyCounts).sort();
    const data = categories.map((month) => monthlyCounts[month]);
    this.lineChartOptions = {
      ...this.lineChartOptions,
      xAxis: { ...this.lineChartOptions.xAxis, categories },
      series: [{ type: 'line', name: 'Events', data }],
    };
  }

  updateScatterChart(events: any[]): void {
    const eventTypeCounts: Record<string, number> = {};
    events.forEach((event) => {
        const eventType = event.type || 'Unknown';
        eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + (event.participants?.length || 0);
    });
    const maxCount = Math.max(...Object.values(eventTypeCounts));
    const minCount = Math.min(...Object.values(eventTypeCounts));
    const categories = Object.keys(eventTypeCounts);
    const data = categories.map((type) => {
        const count = eventTypeCounts[type];
        let color = undefined;
        if (count === maxCount) {
            color = 'green';
        } else if (count === minCount) {
            color = 'red';
        }
        return {
            y: count,
            color: color,
        };
    });
    this.scatterChartOptions = {
      ...this.scatterChartOptions,
      xAxis: {
          ...this.scatterChartOptions.xAxis,
          categories,
      },
      series: [{
          type: 'column',
          name: 'Participants by Event Type',
          data,
      }],
    };
  }

  calculateTotalParticipantions(events: any[]): void {
    this.totalParticipantions = events.reduce((sum, event) => sum + (event.participants?.length || 0), 0);
  }

  calculateTotalParticipants(events: any[]): void {
    const uniqueParticipants = new Set<string>();
    events.forEach((event) => {
      event.participants?.forEach((participant: any) => {
        uniqueParticipants.add(participant.id || participant.name);
      });
    });
    this.totalParticipants = uniqueParticipants.size;
  }

  calculateAvgParticipants(events: any[]): void {
    const totalEvents = events.length;
    this.avgParticipantsPerEvent = totalEvents
      ? this.totalParticipantions / totalEvents
      : 0;
  }

  findTopLocations(events: any[]): void {
    const locationCounts: Record<string, number> = {};
    events.forEach((event) => {
      const location = event.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    const sortedLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
    this.topLocations = sortedLocations.slice(0, 5);
  }

  determinePeakSeason(events: any[]): void {
    const monthCounts: Record<string, number> = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      const month = date.toLocaleString('default', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const peakMonth = Object.entries(monthCounts).reduce((max, current) =>
      current[1] > max[1] ? current : max
    );
    this.peakSeason = peakMonth ? peakMonth[0] : 'No data available';
  }
  
}
