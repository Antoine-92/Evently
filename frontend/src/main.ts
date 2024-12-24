import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideHttpClient(), 
  ],
}).catch((err) => console.error(err));