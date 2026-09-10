import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Guard de autenticación personalizado para RecicLaGo:
 * Si el usuario NO está logueado, lo redirige a la página interna de Login (/login)
 * en lugar de enviarlo de forma abrupta a la pantalla externa de Microsoft Entra ID.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  try {
    const accounts = msalService.instance?.getAllAccounts?.() || [];
    const activeAccount = msalService.instance?.getActiveAccount?.();

    if (accounts.length > 0 || activeAccount) {
      return true;
    }
  } catch (e) {
    console.warn('Auth guard check error:', e);
  }

  // Guardar destino en sessionStorage para recuperarlo tras el flujo de Microsoft
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('reciclago_return_url', state.url);
  }

  // Redirigir a la pantalla de login interna de RecicLaGo preservando la ruta destino
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
