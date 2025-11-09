import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),          // ✅ rotas
    provideHttpClient(withFetch()), // ✅ HttpClient moderno
    importProvidersFrom(FormsModule) // ✅ [(ngModel)]
  ]
}).catch(err => console.error(err));
