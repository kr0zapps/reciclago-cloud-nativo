import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MsalService, MSAL_INSTANCE, MsalGuard, MsalInterceptor, MSAL_INTERCEPTOR_CONFIG, MSAL_GUARD_CONFIG, MsalBroadcastService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    }
  });
}

export function MSALInitializerFactory(msalInstance: IPublicClientApplication) {
  return () => msalInstance.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: MSALInitializerFactory,
      deps: [MSAL_INSTANCE],
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: [
            'user.read',
            'api://' + environment.msalConfig.auth.clientId + '/access_as_user'
          ]
        }
      }
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['http://localhost:8080/api/*', ['api://' + environment.msalConfig.auth.clientId + '/access_as_user']]
        ])
      }
    }
  ]
};