import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  // Chart options
  pieChartOptions: Highcharts.Options = {
    title: { text: 'Event Statistics by Type' },
    accessibility: { enabled: false },
    series: [{ type: 'pie', data: [] }],
  };

  barChartOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: 'Event Statistics by Location' },
    accessibility: { enabled: false },
    xAxis: { categories: [], title: { text: 'Locations' } },
    yAxis: { title: { text: 'Event Count' } },
    series: [{ type: 'bar', name: 'Events', data: [] }],
  };
  
  lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: 'Monthly Event Trends' },
    accessibility: { enabled: false },
    xAxis: { categories: [], title: { text: 'Months' } },
    yAxis: { title: { text: 'Event Count' } },
    series: [{ type: 'line', name: 'Events', data: [] }],
  };
  

  loading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.loading = true;

    const apiUrl = 'http://localhost:3000/api/events';
    this.http.get<any[]>(apiUrl).subscribe({
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
  }

  updateCharts(events: any[]): void {
    this.updatePieChart(events);
    this.updateBarChart(events);
    this.updateLineChart(events);
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
  
    // Update options with a new reference
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
  
    const categories = Object.keys(locationCounts);
    const data = Object.values(locationCounts);
  
    // Update options with a new reference
    this.barChartOptions = {
      ...this.barChartOptions, // Preserve other properties
      xAxis: { ...this.barChartOptions.xAxis, categories },
      series: [{ type: 'bar', name: 'Events', data }],
    };
  }
  

  updateLineChart(events: any[]): void {
    const monthlyCounts: Record<string, number> = {};
  
    events.forEach((event) => {
      const date = new Date(event.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
  
    const categories = Object.keys(monthlyCounts).sort(); // Sort months chronologically
    const data = categories.map((month) => monthlyCounts[month]);
  
    // Update options with a new reference
    this.lineChartOptions = {
      ...this.lineChartOptions,
      xAxis: { ...this.lineChartOptions.xAxis, categories },
      series: [{ type: 'line', name: 'Events', data }],
    };
  }
  
}
