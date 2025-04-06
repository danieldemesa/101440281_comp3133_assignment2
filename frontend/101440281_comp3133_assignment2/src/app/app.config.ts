import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

import { createUploadLink } from 'apollo-upload-client'; // ✅ Clean import after downgrade

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => ({
      link: createUploadLink({
        uri: 'http://localhost:5000/graphql'
      }) as any,
      cache: new InMemoryCache(),
    })),
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule)
  ]
};
