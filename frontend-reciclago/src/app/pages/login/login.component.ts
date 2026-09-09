import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionType, RedirectRequest } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Login Hero Background 4K -->
    <div class="relative flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] overflow-hidden anim-page-deploy">
      <!-- Fondo Fotográfico 4K con Overlay Suave -->
      <div class="absolute inset-0 z-0">
        <img
          alt="Puerto Varas Paisaje Lago y Volcán Osorno"
          class="w-full h-full object-cover object-center"
          src="assets/puerto-varas-hero-clean.jpg"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#041D2D] via-[#041D2D]/60 to-[#041D2D]/40"></div>
      </div>

      <!-- Login Card Flotante -->
      <section class="w-full max-w-[460px] bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-white p-8 sm:p-11 relative z-20 flex flex-col items-center text-center overflow-hidden transition-all duration-300 shadow-2xl anim-deploy-delay-1">

        <!-- Handwriting Greeting -->
        <div class="mb-1 text-center">
          <span class="font-script text-[#0e3b62] text-3xl sm:text-4xl font-bold tracking-tight transform -rotate-2 inline-block">
            Bienvenido/a a
          </span>
        </div>

        <!-- Brand Title -->
        <div class="flex items-center justify-center space-x-1.5 mb-4">
          <h1 class="text-4xl sm:text-5xl font-black text-[#093554] tracking-tight font-heading">
            Recic<span class="text-[#72be36]">LaGo</span>
          </h1>
          <span class="inline-block transform rotate-12 -translate-y-1">
            <svg class="w-8 h-8 text-[#72be36] drop-shadow-xs" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path>
            </svg>
          </span>
        </div>

        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#093554]/70 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-6">
          Puerto Varas • Portal Comunal
        </span>

        <!-- Description -->
        <p class="text-slate-600 text-sm leading-relaxed max-w-xs font-normal mb-8">
          Ingresa con tu cuenta institucional de Microsoft para consultar tus días de retiro y gestionar solicitudes en tu domicilio.
        </p>

        <!-- Microsoft Login Button -->
        <div class="w-full">
          <button (click)="loginWithMicrosoft()"
                  class="w-full group bg-[#0067b8] hover:bg-[#005a9e] active:bg-[#004e8a] text-white py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center space-x-3 transition-all duration-200 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-200 cursor-pointer"
                  type="button">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 21 21">
              <rect fill="#f25022" height="9" width="9" x="1" y="1"></rect>
              <rect fill="#7fba00" height="9" width="9" x="11" y="1"></rect>
              <rect fill="#00a4ef" height="9" width="9" x="11" y="1"></rect>
              <rect fill="#ffb900" height="9" width="9" x="11" y="11"></rect>
            </svg>
            <span class="tracking-wide">Continuar con Microsoft</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>

        <!-- Security Note -->
        <div class="flex items-start text-left space-x-3 px-1 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full mt-6">
          <div class="mt-0.5 text-[#0067b8] flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <p class="text-[11.5px] text-slate-500 leading-snug">
            Acceso seguro y protegido mediante autenticación única (SSO) de Microsoft Entra ID.
          </p>
        </div>

        <!-- Decorative Mountains & Motto -->
        <div class="w-full pt-4 relative mt-auto border-t border-slate-100">
          <div class="w-full h-10 overflow-hidden relative opacity-85 flex items-end justify-center mb-2">
            <svg class="w-full h-10" fill="none" preserveAspectRatio="none" viewBox="0 0 300 45" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 45L40 24L85 38L150 12L215 36L265 20L300 45Z" fill="#bae6fd" opacity="0.8"></path>
              <path d="M20 45L70 18L115 35L150 20L200 32L245 15L285 45Z" fill="#0284c7" opacity="0.6"></path>
              <path d="M66 18L70 18L74 23L70 24L66 18Z" fill="#ffffff"></path>
              <path d="M241 15L245 15L249 20L245 22L241 15Z" fill="#ffffff"></path>
            </svg>
          </div>
          <div class="flex items-center justify-center space-x-1.5 transform -rotate-1 text-center">
            <span class="font-script text-xl text-[#093554] font-bold">
              Juntos por una Puerto Varas más limpia
            </span>
            <span class="text-xs text-[#72be36]">🍃</span>
          </div>
        </div>

      </section>
    </div>
  `
})
export class LoginComponent implements OnInit {

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.checkSessionAndRedirect();
  }

  ngOnInit(): void {
    try {
      this.authService.instance?.handleRedirectPromise?.().then(() => {
        this.checkSessionAndRedirect();
      }).catch(err => {
        console.warn('MSAL handleRedirectPromise warning:', err);
      });
    } catch (e) {
      console.warn('MSAL handleRedirectPromise error:', e);
    }
  }

  private checkSessionAndRedirect(): void {
    try {
      const accounts = this.authService.instance?.getAllAccounts?.() || [];
      if (accounts.length > 0) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || sessionStorage.getItem('reciclago_return_url') || '/dashboard';
        sessionStorage.removeItem('reciclago_return_url');
        this.router.navigateByUrl(returnUrl);
      }
    } catch (e) {
      console.warn('checkSession error:', e);
    }
  }

  loginWithMicrosoft(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    sessionStorage.setItem('reciclago_return_url', returnUrl);
    const redirectUri = environment.msalConfig.auth.redirectUri;
    this.authService.loginRedirect({
      ...(this.msalGuardConfig.authRequest as RedirectRequest),
      redirectUri: redirectUri,
      redirectStartPage: redirectUri
    });
  }
}
