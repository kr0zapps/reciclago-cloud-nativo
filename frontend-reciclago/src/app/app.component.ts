import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <!-- Barra Superior Institucional -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm border-b border-border transition-colors duration-300">
      
      <!-- Sub-barra azul lago institucional (Información útil, no jerga) -->
      <div class="bg-brand-primary text-surface text-[12px] font-medium hidden sm:block">
        <div class="max-w-[1040px] mx-auto px-4 h-8 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px]">domain</span>
            <span>Dirección de Medio Ambiente, Aseo y Ornato (DIMAO)</span>
          </div>
          <div class="flex items-center gap-4 text-surface/90">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">call</span>
              <span>Mesa vecinal: +56 65 236 1200</span>
            </div>
            <div class="w-px h-3 bg-surface/30"></div>
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              <span>Atención: Lun - Vie, 08:30 a 14:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cabecera Principal con Logo y Navegación -->
      <div class="max-w-[1040px] mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
        
        <!-- Brand Logo Original de RecicLaGo (Local, Siempre visible y optimizado para Dark Mode) -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <img 
            src="/assets/logo.png" 
            alt="RecicLaGo - Municipalidad de Puerto Varas" 
            class="h-[42px] w-auto object-contain transition-all group-hover:scale-105"
            [class.brightness-0]="isDarkMode"
            [class.invert]="isDarkMode"
          />
        </a>

        <!-- Menú de Navegación -->
        <nav class="hidden md:flex items-center gap-2">
          <a routerLink="/" routerLinkActive="bg-bg text-brand-primary" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 text-[13px] font-bold text-text-secondary hover:bg-bg hover:text-brand-primary rounded-btn transition-colors">
            Inicio
          </a>
          <a routerLink="/dashboard" routerLinkActive="bg-bg text-brand-primary" class="px-4 py-2 text-[13px] font-bold text-text-secondary hover:bg-bg hover:text-brand-primary rounded-btn transition-colors">
            Mi panel cívico
          </a>
        </nav>

        <!-- Controles Secundarios: Dark Mode & Login -->
        <div class="flex items-center gap-4">
          
          <!-- Tema Claro / Oscuro -->
          <button (click)="toggleDarkMode()" class="p-2 text-text-secondary hover:bg-bg hover:text-brand-primary rounded-full transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px]">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <!-- Separador -->
          <div class="w-px h-6 bg-border hidden sm:block"></div>

          <!-- Login Vecinal -->
          <button *ngIf="!loginDisplay" (click)="login()" class="hidden sm:flex btn-primary !py-2 !px-4 !text-[13px]">
            <span class="material-symbols-outlined text-[16px]">fingerprint</span>
            <span>Acceso vecinos</span>
          </button>

          <!-- Usuario Autenticado -->
          <div *ngIf="loginDisplay" class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-2 bg-bg px-3 py-1.5 rounded-btn border border-brand-primary/20">
              <span class="material-symbols-outlined text-[16px] text-brand-primary">person</span>
              <span class="text-[12px] font-bold text-brand-primary max-w-[120px] truncate">
                {{ currentUser }}
              </span>
            </div>
            <button (click)="logout()" class="text-[12px] font-bold text-red-600 hover:underline">
              Salir
            </button>
          </div>

        </div>

      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="min-h-screen pt-[100px] bg-transparent">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  currentUser = '';
  isDarkMode = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    // Check system preference or localStorage for Dark Mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      this.renderer.addClass(document.documentElement, 'dark'); // Mantener soporte para tailwind dark: por si acaso
    } else {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
    }

    this.authService.instance.handleRedirectPromise().then(() => {
      this.setLoginDisplay();
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }

  setLoginDisplay(): void {
    const accounts = this.authService.instance.getAllAccounts();
    this.loginDisplay = accounts.length > 0;
    if (this.loginDisplay) {
      const active = this.authService.instance.getActiveAccount() || accounts[0];
      if (!this.authService.instance.getActiveAccount()) {
        this.authService.instance.setActiveAccount(active);
      }
      this.currentUser = active.name || active.username || '';
    } else {
      this.currentUser = '';
    }
  }

  login(): void {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.loginPopup(this.msalGuardConfig.authRequest as PopupRequest)
        .subscribe((response) => {
          this.authService.instance.setActiveAccount(response.account);
          this.setLoginDisplay();
        });
    } else {
      this.authService.loginRedirect(this.msalGuardConfig.authRequest as RedirectRequest);
    }
  }

  logout(): void {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}