import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { ParticipantFormComponent } from './components/participant-form/participant-form.component';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { RelationFormComponent } from './components/relation-form/relation-form.component';

export const routes: Routes = [
  { path: 'events', component: EventListComponent },
  { path: 'create-event', component: EventFormComponent },
  { path: 'create-participant', component: ParticipantFormComponent },
  { path: 'participant', component: ParticipantListComponent },
  { path: 'relations', component: RelationFormComponent },
  { path: 'relations/event/:eventId', component: RelationFormComponent },
  { path: 'relations/participant/:participantId', component: RelationFormComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: '**', redirectTo: '/events' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AppRoutingModule{}