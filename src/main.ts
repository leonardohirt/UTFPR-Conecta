import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom, LOCALE_ID } from '@angular/core'; // <--- IMPORTANTE!
import { FormsModule } from '@angular/forms';
import { routes } from './app/app.routes';

// Locale PT-BR
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

bootstrapApplication(App, {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },  // <--- DEFINE PT-BR AQUI
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(FormsModule)
  ]
}).catch(err => console.error(err));
