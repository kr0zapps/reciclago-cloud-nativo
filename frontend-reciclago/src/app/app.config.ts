import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withViewTransitions, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MsalService, MSAL_INSTANCE, MsalGuard, MsalInterceptor, MSAL_INTERCEPTOR_CONFIG, MSAL_GUARD_CONFIG, MsalBroadcastService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export function MSALInstanceFactory(): IPublicClientApplication {
  try {
    const redirectUri = environment.msalConfig.auth.redirectUri;

    return new PublicClientApplication({
      auth: {
        clientId: environment.msalConfig.auth.clientId,
        authority: environment.msalConfig.auth.authority,
        redirectUri: redirectUri,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage
      }
    });
  } catch (err) {
    console.warn('MSAL initialization warning, fallback activated:', err);
    return {
      initialize: () => Promise.resolve(),
      getAllAccounts: () => [],
      getActiveAccount: () => null,
      setActiveAccount: () => {},
      handleRedirectPromise: () => Promise.resolve(null),
      loginRedirect: () => Promise.resolve(),
      loginPopup: () => Promise.reject('MSAL not active in this environment'),
      logoutRedirect: () => Promise.resolve(),
      acquireTokenSilent: () => Promise.reject('MSAL not active in this environment')
    } as unknown as IPublicClientApplication;
  }
}

export function MSALInitializerFactory(msalInstance: IPublicClientApplication) {
  return () => {
    try {
      const initResult = msalInstance.initialize();
      return (initResult && typeof initResult.catch === 'function')
        ? initResult.catch(err => console.warn('MSAL init caught:', err))
        : Promise.resolve();
    } catch (e) {
      console.warn('MSAL initializer error:', e);
      return Promise.resolve();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({ skipInitialTransition: false }), withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
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
      useFactory: () => {
        return {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: [
              'user.read',
              ...environment.apiConfig.scopes
            ],
            redirectUri: environment.msalConfig.auth.redirectUri,
            redirectStartPage: environment.msalConfig.auth.redirectUri
          }
        };
      }
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['http://localhost:8080/api/*', environment.apiConfig.scopes],
          ['https://*/api/*', environment.apiConfig.scopes]
        ])
      }
    }
  ]
};