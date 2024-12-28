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
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';


export const routes: Routes = [
  { path: 'events', component: EventListComponent, canActivate: [AuthGuard] },
  { path: 'create-event', component: EventFormComponent },
  { path: 'create-participant', component: ParticipantFormComponent, canActivate: [AuthGuard] },
  { path: 'participant', component: ParticipantListComponent, canActivate: [AuthGuard] },
  { path: 'relations', component: RelationFormComponent, canActivate: [AuthGuard] },
  { path: 'relations/event/:eventId', component: RelationFormComponent, canActivate: [AuthGuard] },
  { path: 'relations/participant/:participantId', component: RelationFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-event/:id', component: EditEventComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: '**', redirectTo: '/events' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class AppRoutingModule{}