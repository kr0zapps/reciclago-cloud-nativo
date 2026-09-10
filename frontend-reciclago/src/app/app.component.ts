import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <!-- ==================== TOP LOADER SUTIL ==================== -->
    <div *ngIf="isPageLoading" class="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none overflow-hidden bg-transparent">
      <div class="h-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B] anim-top-loader shadow-[0_0_12px_rgba(56,189,248,0.7)]"></div>
    </div>

    <!-- ==================== LOADER CON IDENTIDAD VISUAL RECICLAGO ==================== -->
    <div *ngIf="isPageLoading"
         class="fixed inset-0 z-[100] flex items-center justify-center bg-[#041D2D]/20 backdrop-blur-[4px] transition-all duration-300 pointer-events-none">
      
      <div class="bg-white/95 backdrop-blur-md rounded-3xl p-7 shadow-2xl border border-white/90 flex flex-col items-center text-center max-w-xs mx-4 anim-page-deploy pointer-events-auto">
        
        <!-- Logo RecicLaGo con Pulso Orgánico y Halo -->
        <div class="relative w-16 h-16 mb-2.5 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-[#4F8A3D]/25 animate-ping opacity-75"></div>
          <svg class="w-16 h-16 relative z-10 anim-float-soft drop-shadow-sm" fill="none" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 56L34 24L52 50L60 38L78 56H12Z" fill="#123F5B"></path>
            <path d="M34 24L41 34L34 38L27 34L34 24Z" fill="#FFFFFF"></path>
            <path d="M60 38L66 46L60 50L55 45L60 38Z" fill="#FFFFFF"></path>
            <path d="M48 56C48 40 64 26 84 26C84 42 68 56 48 56Z" fill="#4F8A3D" class="anim-pulse-gentle"></path>
            <path d="M52 56C58 48 68 40 84 26" stroke="#FFFFFF" stroke-linecap="round" stroke-width="2.2"></path>
            <path d="M8 64C16 61 24 67 32 64C40 61 48 67 56 64C64 61 72 67 80 64C88 61 92 64 96 64" stroke="#1F6685" stroke-linecap="round" stroke-width="2.5"></path>
            <path d="M14 71C20 69 26 73 32 71C38 69 44 73 50 71C56 69 62 73 68 71C74 69 80 73 86 71" stroke="#8EAD73" stroke-linecap="round" stroke-width="2"></path>
          </svg>
        </div>

        <!-- Tipografía Oficial RecicLaGo -->
        <div class="flex items-baseline tracking-tight mb-1">
          <span class="font-heading font-black text-2xl text-[#123F5B]">Recic</span>
          <span class="font-heading font-black text-2xl text-[#4F8A3D]">LaGo</span>
        </div>

        <!-- Barra de progreso miniatura -->
        <div class="w-32 h-1.5 bg-[#E2E9E4] rounded-full overflow-hidden mt-1.5 mb-2">
          <div class="h-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B] anim-top-loader rounded-full"></div>
        </div>

        <!-- Lema Comunal -->
        <p class="text-[11px] font-bold text-[#546571] uppercase tracking-wider">
          Puerto Varas recicla
        </p>
      </div>
    </div>

    <!-- ==================== CONTENEDOR RAÍZ CON FLEX COLUMN (STICKY FOOTER SIN HUECOS) ==================== -->
    <div class="min-h-screen flex flex-col bg-[#F8FAF7]">

      <!-- ==================== HEADER UNIVERSAL STITCH ==================== -->
      <header class="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#E2E9E4]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        <!-- LOGO RECICLAGO OFICIAL -->
        <a routerLink="/" class="flex items-center gap-3 group flex-shrink-0">
          <div class="w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
            <svg class="w-12 h-12" fill="none" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 56L34 24L52 50L60 38L78 56H12Z" fill="#123F5B"></path>
              <path d="M34 24L41 34L34 38L27 34L34 24Z" fill="#FFFFFF"></path>
              <path d="M60 38L66 46L60 50L55 45L60 38Z" fill="#FFFFFF"></path>
              <path d="M48 56C48 40 64 26 84 26C84 42 68 56 48 56Z" fill="#4F8A3D"></path>
              <path d="M52 56C58 48 68 40 84 26" stroke="#FFFFFF" stroke-linecap="round" stroke-width="2.2"></path>
              <path d="M8 64C16 61 24 67 32 64C40 61 48 67 56 64C64 61 72 67 80 64C88 61 92 64 96 64" stroke="#1F6685" stroke-linecap="round" stroke-width="2.5"></path>
              <path d="M14 71C20 69 26 73 32 71C38 69 44 73 50 71C56 69 62 73 68 71C74 69 80 73 86 71" stroke="#8EAD73" stroke-linecap="round" stroke-width="2"></path>
            </svg>
          </div>
          <div>
            <div class="flex items-baseline tracking-tight">
              <span class="font-heading font-extrabold text-2xl text-[#123F5B]">Recic</span>
              <span class="font-heading font-extrabold text-2xl text-[#4F8A3D]">LaGo</span>
            </div>
            <p class="text-[11px] font-bold text-[#546571] tracking-wide uppercase -mt-0.5 hidden sm:block">Puerto Varas recicla</p>
          </div>
        </a>

        <!-- NAVEGACIÓN -->
        <nav class="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-[14px] lg:text-[15px] font-semibold text-[#183247]">
          <a routerLink="/" routerLinkActive="text-[#093554] font-bold" [routerLinkActiveOptions]="{exact: true}" class="relative py-2 hover:text-[#4F8A3D] transition-colors flex flex-col items-center">
            <span>Inicio</span>
            <div class="w-6 h-0.5 sm:h-1 bg-[#4F8A3D] rounded-full mt-1"></div>
          </a>
          <button (click)="showHowItWorks = true" type="button" class="hover:text-[#4F8A3D] transition-colors py-2 font-semibold text-[14px] lg:text-[15px] text-[#183247] cursor-pointer">¿Cómo funciona?</button>
          <button (click)="showMaterials = true" type="button" class="hover:text-[#4F8A3D] transition-colors py-2 font-semibold text-[14px] lg:text-[15px] text-[#183247] cursor-pointer">Materiales</button>
          <a routerLink="/dashboard" class="hover:text-[#4F8A3D] transition-colors py-2">Retiro especial</a>
          <button (click)="showContact = true" type="button" class="hover:text-[#4F8A3D] transition-colors py-2 font-semibold text-[14px] lg:text-[15px] text-[#183247] cursor-pointer">Contacto</button>
        </nav>

        <!-- ACCIONES DERECHA -->
        <div class="flex items-center gap-4 sm:gap-5 lg:gap-6 flex-shrink-0">
          <!-- Sello Municipal Oficial Puerto Varas (Desktop) -->
          <div class="hidden lg:flex items-center gap-2.5 pr-4 sm:pr-5 lg:pr-6 border-r border-[#E2E9E4]">
            <img src="assets/escudo-puerto-varas.svg" alt="Ilustre Municipalidad de Puerto Varas" class="h-9 w-auto object-contain">
            <div class="text-left leading-tight">
              <div class="text-[9.5px] font-bold text-[#546571] uppercase tracking-wider">Ilustre Municipalidad</div>
              <div class="text-[12.5px] font-extrabold text-[#123F5B] tracking-tight">Puerto Varas</div>
            </div>
          </div>

          <!-- Botón Mi cuenta / Pill Vecinal (Desktop & Tablet) -->
          <a *ngIf="!loginDisplay" routerLink="/login" class="hidden sm:flex items-center gap-2 bg-[#0e5584] hover:bg-[#0b476f] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-xs cursor-pointer">
            <i class="fa-solid fa-circle-user text-sm"></i>
            <span>Mi cuenta</span>
          </a>

          <div *ngIf="loginDisplay" class="hidden sm:flex items-center gap-3 bg-white border border-[#DFE8E1] hover:border-[#4F8A3D]/40 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm transition-all">
            <a routerLink="/dashboard" class="flex items-center gap-2.5 sm:gap-3 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-[#123F5B] text-white text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                {{ currentUser ? currentUser.charAt(0).toUpperCase() : 'V' }}
              </div>
              <div class="text-left hidden sm:block">
                <span class="text-[13px] sm:text-[14px] font-bold text-[#123F5B] block max-w-[150px] lg:max-w-[200px] truncate">{{ currentUser }}</span>
              </div>
            </a>
            <button (click)="logout()" class="ml-1 sm:ml-2 text-[11.5px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors border-l border-[#DFE8E1] pl-2.5 sm:pl-3 cursor-pointer">
              Salir
            </button>
          </div>

          <!-- Botón Hamburger para Móviles (md:hidden) con micro-animación -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen"
                  type="button"
                  class="md:hidden relative w-10 h-10 inline-flex items-center justify-center rounded-xl bg-[#F0F5F2] hover:bg-[#E2EBE5] text-[#123F5B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4F8A3D]/40 cursor-pointer shadow-xs active:scale-95"
                  aria-label="Abrir menú de navegación"
                  [attr.aria-expanded]="mobileMenuOpen">
            <i class="fa-solid fa-bars text-lg transition-transform duration-300" [class.rotate-90]="mobileMenuOpen" [class.hidden]="mobileMenuOpen"></i>
            <i class="fa-solid fa-xmark text-lg transition-transform duration-300" [class.rotate-90]="!mobileMenuOpen" [class.hidden]="!mobileMenuOpen"></i>
          </button>
        </div>

      </div>

      <!-- Menú Móvil Desplegable Luminoso en Blanco Puro -->
      <div *ngIf="mobileMenuOpen"
           class="md:hidden border-t border-[#E2E9E4] bg-white px-4 pt-3 pb-5 space-y-3.5 shadow-xl border-b border-[#E2E9E4] relative z-50 animate-drawer-slide">
        <!-- Sello Municipal Oficial en Móvil -->
        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
          <img src="assets/escudo-puerto-varas.svg" alt="Escudo Ilustre Municipalidad de Puerto Varas" class="h-8 w-auto object-contain flex-shrink-0">
          <div class="text-xs text-[#546571] leading-tight">
            Ilustre Municipalidad de <strong class="text-[#123F5B] block font-bold">Puerto Varas</strong>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3E6] text-[#3D742F] border border-[#CCE4C8]">
            Portal 2026
          </span>
        </div>

        <!-- Links de Navegación Móvil -->
        <nav class="flex flex-col space-y-1 text-[15px] font-semibold text-[#183247]">
          <!-- Inicio -->
          <a routerLink="/"
             (click)="mobileMenuOpen = false"
             routerLinkActive="bg-[#EEF5EB] text-[#4F8A3D] font-bold"
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all cursor-pointer">
            <i class="fa-solid fa-house w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Inicio</span>
          </a>

          <!-- ¿Cómo funciona? -->
          <button type="button"
                  (click)="showHowItWorks = true; mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-circle-question w-5 text-center text-sm text-[#0ea5e9]"></i>
            <span>¿Cómo funciona?</span>
          </button>

          <!-- Materiales -->
          <button type="button"
                  (click)="showMaterials = true; mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-recycle w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Materiales</span>
          </button>

          <!-- Retiro especial -->
          <a routerLink="/dashboard"
             (click)="mobileMenuOpen = false"
             routerLinkActive="bg-[#EEF5EB] text-[#4F8A3D] font-bold"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all cursor-pointer">
            <i class="fa-solid fa-truck-pickup w-5 text-center text-sm text-[#123F5B]"></i>
            <span>Retiro especial</span>
          </a>

          <!-- Contacto DIMAO -->
          <button type="button"
                  (click)="showContact = true; mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-envelope w-5 text-center text-sm text-emerald-600"></i>
            <span>Contacto DIMAO</span>
          </button>
        </nav>

        <!-- Sección de Usuario / Mi cuenta en Móvil -->
        <div class="pt-3 border-t border-[#E2E9E4]">
          <div *ngIf="!loginDisplay">
            <a routerLink="/login"
               (click)="mobileMenuOpen = false"
               class="flex items-center justify-center gap-2.5 w-full bg-[#123F5B] hover:bg-[#0E354D] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-sm cursor-pointer">
              <i class="fa-regular fa-circle-user text-base"></i>
              <span>Mi cuenta (Iniciar sesión)</span>
            </a>
          </div>

          <!-- PERFIL CIUDADANO SOBRIO Y PROFESIONAL (ESTILO STRIPE / TAILWIND UI ENTERPRISE) -->
          <div *ngIf="loginDisplay" class="bg-[#F8FAF7] border border-[#E2EAE0] rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-[#123F5B]/20 transition-all">
            <!-- Área clickeable de identidad: Avatar + Nombre + Link al Dashboard -->
            <a routerLink="/dashboard"
               (click)="mobileMenuOpen = false"
               class="flex items-center gap-3 min-w-0 flex-1 group cursor-pointer">
              <!-- Avatar minimalista con inicial -->
              <div class="w-10 h-10 rounded-xl bg-[#123F5B] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-102 transition-transform">
                {{ currentUser ? currentUser.charAt(0).toUpperCase() : 'V' }}
              </div>

              <!-- Tipografía ejecutiva limpia -->
              <div class="min-w-0 flex-1">
                <div class="text-[13.5px] font-bold text-[#123F5B] truncate group-hover:text-[#4F8A3D] transition-colors leading-tight">
                  {{ currentUser }}
                </div>
                <div class="text-[11.5px] text-[#61717A] flex items-center gap-1.5 mt-0.5">
                  <span class="font-semibold text-[#3D742F]">Mi Panel</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-slate-500">Puerto Varas</span>
                </div>
              </div>

              <!-- Indicador sutil de navegación -->
              <i class="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-[#123F5B] group-hover:translate-x-0.5 transition-all mr-1"></i>
            </a>

            <!-- Separador vertical sutil y botón de salida sobrio -->
            <div class="flex items-center pl-2 border-l border-[#E2EAE0]">
              <button (click)="logout(); mobileMenuOpen = false"
                      type="button"
                      title="Cerrar sesión"
                      class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer">
                <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenedor Principal de la App (Fills remaining height without gaps) -->
    <main class="flex-1 flex flex-col relative bg-[#F8FAF7]">
      <router-outlet></router-outlet>
    </main>

    <!-- ==================== FOOTER UNIVERSAL STITCH ==================== -->
    <footer class="bg-[#041D2D] text-white pt-8 pb-8 relative overflow-hidden border-t-2 border-[#0E5177]">

      <!-- SILUETAS VECTORIALES VIVAS Y NOTORIAS: VOLCÁN OSORNO Y OLAS DEL LAGO LLANQUIHUE -->
      <div class="w-full h-24 sm:h-28 overflow-hidden relative pointer-events-none mb-4 opacity-100 z-0">
        <svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Silueta del Volcán y Cordillera con Nieve Iluminada -->
          <path d="M0 90 L120 70 L240 78 L380 50 L520 68 L680 15 L760 45 L900 65 L1040 38 L1180 62 L1320 48 L1440 75 L1440 100 L0 100 Z"
                fill="url(#mountainGradVibrant)" opacity="0.95"></path>
          <!-- Cumbres nevadas blancas nítidas -->
          <polygon points="680,15 640,45 660,50 680,42 700,50 720,45" fill="#FFFFFF" opacity="0.95"></polygon>
          <polygon points="1040,38 1010,58 1025,62 1040,56 1055,62 1070,58" fill="#FFFFFF" opacity="0.9"></polygon>

          <!-- Ondas Naturales Azul Lago Llanquihue -->
          <path d="M0 78 C 300 58, 400 98, 720 78 C 1040 58, 1140 98, 1440 78"
                fill="transparent" stroke="#38bdf8" stroke-width="2.5" opacity="0.8"></path>
          <path d="M0 86 C 250 100, 550 70, 800 86 C 1050 100, 1250 70, 1440 86"
                fill="transparent" stroke="#0ea5e9" stroke-width="2" opacity="0.7"></path>
          <path d="M0 70 C 400 52, 600 88, 900 70 C 1200 52, 1300 88, 1440 70"
                fill="transparent" stroke="#7dd3fc" stroke-width="1.5" opacity="0.4"></path>

          <defs>
            <linearGradient id="mountainGradVibrant" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.9"></stop>
              <stop offset="60%" stop-color="#0c4a6e" stop-opacity="0.6"></stop>
              <stop offset="100%" stop-color="#041D2D" stop-opacity="0.1"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Contenido Principal del Footer -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div class="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/15">

          <!-- Logo RecicLaGo Ampliado, Brillante y Destacado -->
          <a class="flex items-center gap-4 group" routerLink="/">
            <div class="w-14 h-14 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg class="w-full h-full" fill="none" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 56L34 24L52 50L60 38L78 56H12Z" fill="#0ea5e9"></path>
                <path d="M34 24L41 34L34 38L27 34L34 24Z" fill="#FFFFFF"></path>
                <path d="M60 38L66 46L60 50L55 45L60 38Z" fill="#FFFFFF"></path>
                <path d="M48 56C48 40 64 26 84 26C84 42 68 56 48 56Z" fill="#72be36"></path>
                <path d="M52 56C58 48 68 40 84 26" stroke="#041D2D" stroke-linecap="round" stroke-width="2.2"></path>
              </svg>
            </div>
            <div class="flex flex-col text-left">
              <div class="flex items-baseline text-2xl sm:text-3xl font-black tracking-tight font-heading">
                <span class="text-white">Recic</span>
                <span class="text-[#72be36]">LaGo</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Puerto Varas recicla • Cuenca Protegida
              </span>
            </div>
          </a>

          <!-- Enlaces de Navegación del Footer -->
          <nav class="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200 font-medium">
            <a class="hover:text-emerald-300 transition-colors" routerLink="/">Inicio</a>
            <span class="text-white/40">|</span>
            <button (click)="showHowItWorks = true" type="button" class="hover:text-emerald-300 transition-colors cursor-pointer">¿Cómo funciona?</button>
            <span class="text-white/40">|</span>
            <button (click)="showMaterials = true" type="button" class="hover:text-emerald-300 transition-colors cursor-pointer">Materiales</button>
            <span class="text-white/40">|</span>
            <a class="hover:text-emerald-300 transition-colors" routerLink="/dashboard">Retiro especial</a>
            <span class="text-white/40">|</span>
            <button (click)="showContact = true" type="button" class="hover:text-emerald-300 transition-colors cursor-pointer">Contacto</button>
          </nav>

          <!-- Sello Municipal y Redes Sociales Oficiales -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2.5 text-white text-sm">
              <a aria-label="Facebook Municipalidad de Puerto Varas" class="w-8 h-8 rounded-full bg-white/10 hover:bg-[#4F8A3D] flex items-center justify-center transition-all" href="https://www.facebook.com/munipuertovaras" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-facebook-f text-xs"></i>
              </a>
              <a aria-label="Instagram Municipalidad de Puerto Varas" class="w-8 h-8 rounded-full bg-white/10 hover:bg-[#4F8A3D] flex items-center justify-center transition-all" href="https://www.instagram.com/munipuertovaras" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-instagram text-xs"></i>
              </a>
              <a aria-label="YouTube Municipalidad de Puerto Varas" class="w-8 h-8 rounded-full bg-white/10 hover:bg-[#4F8A3D] flex items-center justify-center transition-all" href="https://www.youtube.com/@MunicipalidadPuertoVaras" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-youtube text-xs"></i>
              </a>
            </div>

            <div class="flex items-center gap-2.5 border-l border-white/20 pl-3">
              <img src="assets/escudo-puerto-varas.svg" alt="Ilustre Municipalidad de Puerto Varas" class="h-9 w-auto object-contain drop-shadow">
              <div class="text-left leading-tight hidden sm:block">
                <div class="text-[9.5px] font-medium text-slate-300 uppercase tracking-wider">Ilustre Municipalidad</div>
                <div class="text-[12.5px] font-bold text-white tracking-tight">Puerto Varas</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Fila Inferior con Lema Manuscrito Destacado -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p class="text-xs text-slate-400">
            © 2025 Municipalidad de Puerto Varas. Todos los derechos reservados.
          </p>

          <!-- Lema natural con Caveat destacado -->
          <div class="flex items-center gap-2">
            <span class="font-script text-white text-2xl sm:text-3xl font-bold tracking-wide">
              Puerto Varas, más limpia, es posible
            </span>
            <span class="text-emerald-400 text-xl">♡</span>
          </div>
        </div>

      </div>
    </footer>
    </div>

    <!-- ==================== MODAL GLOBAL 1: ¿CÓMO FUNCIONA? ==================== -->
    <div *ngIf="showHowItWorks"
         (click)="showHowItWorks = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <!-- Franja de acento superior con colores comunales -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Guía Ciudadana • Puerto Varas
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                ¿Cómo funciona el reciclaje en tu hogar?
              </h3>
            </div>
          </div>
          <button (click)="showHowItWorks = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <p class="text-slate-600 text-sm">
            RecicLaGo es el servicio municipal puerta a puerta de Puerto Varas diseñado para proteger la cuenca del Lago Llanquihue mediante un proceso trazable en 4 pasos:
          </p>

          <!-- Stepper Conectado Natural -->
          <div class="relative pl-6 border-l-2 border-[#D5E6D2] space-y-6 ml-3 my-3">
            
            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#4F8A3D] text-[#4F8A3D] font-black text-xs flex items-center justify-center shadow-xs">1</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Separación limpia en origen</h4>
              <p class="text-xs text-slate-600 mt-1">Limpia, seca y enjuaga envases de vidrio, cartón, latas y botellas plásticas. Retira restos de alimentos y aplasta los envases para optimizar volumen.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#123F5B] text-[#123F5B] font-black text-xs flex items-center justify-center shadow-xs">2</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Conoce tu día de cuadrante</h4>
              <p class="text-xs text-slate-600 mt-1">El camión municipal recorre tu sector una vez por semana entre las 08:00 y 17:00 hrs. Deja tus materiales en cajas o bolsas identificadas antes de las 08:30 hrs.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#0284C7] text-[#0284C7] font-black text-xs flex items-center justify-center shadow-xs">3</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Retiro y pesaje certificado en ruta</h4>
              <p class="text-xs text-slate-600 mt-1">La cuadrilla pesa tus aportes en la balanza digital municipal. Los kilos quedan ingresados y asociados a tu cuenta vecinal.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#72be36] text-[#4F8A3D] font-black text-xs flex items-center justify-center shadow-xs">4</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Valorización y protección de la cuenca</h4>
              <p class="text-xs text-slate-600 mt-1">Tus reciclables se derivan a plantas de valorización certificadas, evitando que terminen en vertederos o en la ribera del lago.</p>
            </div>

          </div>

          <!-- Tip Vecinal Amable -->
          <div class="p-4 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-start gap-3 text-xs text-[#123F5B]">
            <i class="fa-solid fa-lightbulb text-base text-[#4F8A3D] mt-0.5 flex-shrink-0"></i>
            <div>
              <strong class="font-bold block mb-0.5">¿Vives en condominio o pasaje estrecho?</strong>
              <span>Los camiones coordinan puntos de acopio comunitarios con las juntas de vecinos para facilitar la recolección sin entorpecer el tránsito.</span>
            </div>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="showHowItWorks = false"
                  type="button"
                  class="bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Entendido, gracias
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL GLOBAL 2: GUÍA DE MATERIALES ==================== -->
    <div *ngIf="showMaterials"
         (click)="showMaterials = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <!-- Franja de acento superior -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Ordenanza Comunal • Clasificación Oficial
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Materiales y Fracciones de Reciclaje
              </h3>
            </div>
          </div>
          <button (click)="showMaterials = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed">
          
          <!-- Sección de Fracciones Aceptadas (4 oficiales) -->
          <div>
            <div class="mb-3">
              <h4 class="font-bold text-xs uppercase tracking-wider text-[#123F5B]">4 Fracciones Recibidas en Ruta Puerta a Puerta</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <!-- Vidrio -->
              <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#4F8A3D]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-wine-bottle"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Vidrio Transparente y Color</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Botellas de vino, cerveza, jugos y frascos de conserva o mermelada. <em>Enjuagar y retirar tapas metálicas.</em></p>
              </div>

              <!-- Cartón y Papel -->
              <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#4F8A3D]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-box-archive"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Cartón y Papel Limpio</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Cajas de cartón corrugado, diarios, revistas, carpetas y papel kraft. <em>Desarmar cajas y mantener secas.</em></p>
              </div>

              <!-- Plásticos PET y PEAD -->
              <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#4F8A3D]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-bottle-water"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Plásticos (PET 1 y PEAD 2)</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Botellas de agua, gaseosas, envases de champú y bidones de detergente. <em>Lavar, aplastar y tapar.</em></p>
              </div>

              <!-- Latas y Metales -->
              <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#4F8A3D]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-can-food"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Latas y Metales de Consumo</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Latas de aluminio de bebidas y tarros de conserva de hojalata. <em>Enjuagadas y desinfectadas.</em></p>
              </div>

            </div>
          </div>

          <!-- Banner No Recibidos -->
          <div class="p-4 rounded-2xl bg-[#FDF4E7] border border-[#F6DCBA] flex items-start gap-3.5">
            <i class="fa-solid fa-triangle-exclamation text-amber-700 text-lg mt-0.5 flex-shrink-0"></i>
            <div class="text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold block mb-1">No se reciben en la ruta habitual:</strong>
              <span>Espejos, lozas o cerámicas, plumavit, envoltorios grasientos o con restos orgánicos. Para muebles en desuso, colchones o restos de poda, debes solicitar un <strong>"Retiro Especial"</strong> desde tu panel vecinal.</span>
            </div>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="showMaterials = false"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL GLOBAL 3: CONTACTO DIMAO ==================== -->
    <div *ngIf="showContact"
         (click)="showContact = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <!-- Franja de acento superior -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Atención Vecinal y Emergencias
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Dirección de Medio Ambiente (DIMAO)
              </h3>
            </div>
          </div>
          <button (click)="showContact = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs text-slate-500">
            Canales oficiales de la Ilustre Municipalidad de Puerto Varas para consultas de recolección y denuncias ambientales:
          </p>

          <div class="space-y-3">
            
            <!-- Mesa Central -->
            <a href="tel:+56652361200"
               class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:bg-[#EEF5EB] hover:border-[#4F8A3D]/40 transition-all group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#4F8A3D] flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="flex-grow min-w-0">
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mesa Telefónica Central</span>
                <strong class="text-sm sm:text-base text-[#123F5B] font-extrabold block truncate">+56 65 236 1200</strong>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-[#4F8A3D] transition-colors"></i>
            </a>

            <!-- Correo Oficial -->
            <a href="mailto:medioambiente@ptovaras.cl"
               class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:bg-[#EEF5EB] hover:border-[#4F8A3D]/40 transition-all group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#4F8A3D] flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="flex-grow min-w-0">
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Correo Institucional</span>
                <strong class="text-sm sm:text-base text-[#123F5B] font-extrabold block truncate">medioambiente&#64;ptovaras.cl</strong>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-[#4F8A3D] transition-colors"></i>
            </a>

            <!-- Oficina Presencial -->
            <div class="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#123F5B] flex items-center justify-center text-base shadow-xs flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atención Presencial DIMAO</span>
                <strong class="text-sm text-[#123F5B] font-bold block">San Francisco 413, Puerto Varas</strong>
                <span class="text-xs text-slate-500 block mt-0.5">Horario de atención: Lunes a Viernes de 08:30 a 14:00 hrs</span>
              </div>
            </div>

          </div>

          <!-- Alerta de Emergencias -->
          <div class="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-[#123F5B]">
            <i class="fa-solid fa-shield-halved text-[#0284C7] text-base mt-0.5 flex-shrink-0"></i>
            <span>Para denuncias de microbasurales o emergencias ambientales en la cuenca, contactar a Seguridad Pública Municipal: <strong>Fono 1408</strong> (atención 24/7).</span>
          </div>

        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Puerto Varas</span>
          </div>
          <button (click)="showContact = false"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  currentUser = '';

  mobileMenuOpen = false;
  isPageLoading = false;

  showHowItWorks = false;
  showMaterials = false;
  showContact = false;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    // Escuchar eventos de navegación para activar la barra de carga no intrusiva
    this.router.events
      .pipe(takeUntil(this._destroying$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isPageLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.isPageLoading = false;
          }, 350);
        }
      });

    try {
      this.authService.instance?.handleRedirectPromise?.().then((result) => {
        this.setLoginDisplay();
        if (result) {
          const returnUrl = sessionStorage.getItem('reciclago_return_url') || '/dashboard';
          sessionStorage.removeItem('reciclago_return_url');
          this.router.navigateByUrl(returnUrl);
        }
      }).catch(err => {
        console.warn('MSAL redirect check warning:', err);
        this.setLoginDisplay();
      });
    } catch (e) {
      console.warn('MSAL handleRedirectPromise call error:', e);
      this.setLoginDisplay();
    }

    if (this.msalBroadcastService?.msalSubject$) {
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
          const returnUrl = sessionStorage.getItem('reciclago_return_url') || '/dashboard';
          sessionStorage.removeItem('reciclago_return_url');
          this.router.navigateByUrl(returnUrl);
        });
    }
  }

  setLoginDisplay(): void {
    let accounts: any[] = [];
    try {
      accounts = this.authService.instance?.getAllAccounts?.() || [];
    } catch (e) {}

    if (accounts.length > 0) {
      this.loginDisplay = true;
      const active = this.authService.instance?.getActiveAccount?.() || accounts[0];
      if (!this.authService.instance?.getActiveAccount?.()) {
        try { this.authService.instance?.setActiveAccount?.(active); } catch (e) {}
      }
      this.currentUser = active.name || active.username || 'Vecino Activo';
    } else {
      this.loginDisplay = false;
      this.currentUser = '';
    }
  }

  login(): void {
    const redirectUri = environment.msalConfig.auth.redirectUri;

    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.loginPopup({
        ...(this.msalGuardConfig.authRequest as PopupRequest),
        redirectUri: redirectUri
      }).subscribe((response) => {
        this.authService.instance?.setActiveAccount?.(response.account);
        this.setLoginDisplay();
      });
    } else {
      this.authService.loginRedirect({
        ...(this.msalGuardConfig.authRequest as RedirectRequest),
        redirectUri: redirectUri
      });
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('reciclago_return_url');
    }
    this.authService.logoutRedirect();
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeAllModals();
  }

  closeAllModals(): void {
    this.showHowItWorks = false;
    this.showMaterials = false;
    this.showContact = false;
    this.mobileMenuOpen = false;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
