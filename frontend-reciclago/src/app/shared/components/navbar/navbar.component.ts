import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  host: { class: 'contents' },
  template: `
    <header [ngClass]="headerClass" class="box-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        <!-- LOGO RECICLAGO OFICIAL -->
        <a routerLink="/" class="flex items-center gap-3 group flex-shrink-0 cursor-pointer">
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
              <span class="font-heading font-extrabold text-2xl transition-colors" [ngClass]="logoTextClass">Recic</span>
              <span class="font-heading font-extrabold text-2xl transition-colors" [ngClass]="logoAccentClass">LaGo</span>
            </div>
            <p class="text-[11px] font-bold tracking-wide uppercase -mt-0.5 hidden sm:block transition-colors" [ngClass]="logoSloganClass">Puerto Varas recicla</p>
          </div>
        </a>

        <!-- NAVEGACIÓN DESKTOP ESENCIAL (3 LINKS CLAVE) CON INDICADORES SUAVES -->
        <nav class="hidden lg:flex items-center gap-7 xl:gap-9 text-[14.5px] font-semibold transition-colors" [ngClass]="navTextClass">
          <button (click)="scrollToSection('como-funciona')" type="button" class="relative group hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">
            <span>¿Cómo funciona?</span>
            <span class="absolute bottom-0.5 left-0 w-0 h-0.5 bg-[#4ade80] rounded-full group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
          <button (click)="scrollToSection('cuadrantes')" type="button" class="relative group hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">
            <span>Cuadrantes</span>
            <span class="absolute bottom-0.5 left-0 w-0 h-0.5 bg-[#4ade80] rounded-full group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
          <button (click)="openMaterials.emit()" type="button" class="relative group hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">
            <span>Materiales</span>
            <span class="absolute bottom-0.5 left-0 w-0 h-0.5 bg-[#4ade80] rounded-full group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
        </nav>

        <!-- ACCIONES DERECHA -->
        <div class="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <!-- Sello Municipal con Espacio y Presencia -->
          <div class="hidden lg:flex items-center gap-3 pl-6 pr-6 border-l border-r transition-colors select-none" [ngClass]="sealBorderClass">
            <img src="assets/escudo-puerto-varas.svg" alt="Ilustre Municipalidad de Puerto Varas" class="h-10 sm:h-11 w-auto object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105">
            <div class="text-left leading-tight">
              <div class="text-[9.5px] font-bold uppercase tracking-wider transition-colors" [ngClass]="sealSubtextClass">Ilustre Municipalidad</div>
              <div class="text-[13px] font-extrabold tracking-tight transition-colors" [ngClass]="sealTitleClass">Puerto Varas</div>
            </div>
          </div>

          <!-- Botón Iniciar sesión con Físicas Interactivas -->
          <a *ngIf="!loginDisplay" routerLink="/login"
             class="btn-interactive hidden sm:inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border cursor-pointer text-center"
             [ngClass]="accountBtnClass">
            <i class="fa-regular fa-circle-user text-sm"></i>
            <span>Iniciar sesión</span>
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
            <button (click)="logoutClicked.emit()" class="ml-1 sm:ml-2 text-[11.5px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors border-l border-[#DFE8E1] pl-2.5 sm:pl-3 cursor-pointer">
              Salir
            </button>
          </div>

          <!-- Botón Hamburger Móvil / Tablet (< 1024px) -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen"
                  type="button"
                  class="lg:hidden relative w-10 h-10 inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none cursor-pointer shadow-xs active:scale-95"
                  [ngClass]="hamburgerBtnClass"
                  aria-label="Abrir menú de navegación">
            <i class="fa-solid fa-bars text-lg transition-transform duration-300" [class.rotate-90]="mobileMenuOpen" [class.hidden]="mobileMenuOpen"></i>
            <i class="fa-solid fa-xmark text-lg transition-transform duration-300" [class.rotate-90]="!mobileMenuOpen" [class.hidden]="!mobileMenuOpen"></i>
          </button>
        </div>
      </div>

      <!-- Menú Móvil / Tablet Desplegable -->
      <div *ngIf="mobileMenuOpen"
           class="lg:hidden border-t border-[#E2E9E4] bg-white px-4 pt-3 pb-5 space-y-3.5 shadow-xl border-b border-[#E2E9E4] relative z-50 animate-drawer-slide">
        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
          <img src="assets/escudo-puerto-varas.svg" alt="Escudo Puerto Varas" class="h-8 w-auto object-contain flex-shrink-0">
          <div class="text-xs text-[#546571] leading-tight">
            Ilustre Municipalidad de <strong class="text-[#123F5B] block font-bold">Puerto Varas</strong>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3E6] text-[#3D742F] border border-[#CCE4C8]">Portal 2026</span>
        </div>

        <nav class="flex flex-col space-y-1 text-[15px] font-semibold text-[#183247]">
          <button type="button" (click)="scrollToSection('como-funciona')"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-circle-question w-5 text-center text-sm text-[#0ea5e9]"></i>
            <span>¿Cómo funciona?</span>
          </button>
          <button type="button" (click)="scrollToSection('cuadrantes')"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-map-location-dot w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Cuadrantes comunales</span>
          </button>
          <button type="button" (click)="openMaterials.emit(); mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-recycle w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Materiales de reciclaje</span>
          </button>
          <button type="button" (click)="openContact.emit(); mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-envelope w-5 text-center text-sm text-emerald-600"></i>
            <span>Contacto DIMAO</span>
          </button>
        </nav>

        <div class="pt-3 border-t border-[#E2E9E4]">
          <div *ngIf="!loginDisplay">
            <a routerLink="/login" (click)="mobileMenuOpen = false"
               class="flex items-center justify-center gap-2.5 w-full bg-[#123F5B] hover:bg-[#0E354D] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-sm cursor-pointer">
              <i class="fa-regular fa-circle-user text-base"></i>
              <span>Mi cuenta (Iniciar sesión)</span>
            </a>
          </div>

          <div *ngIf="loginDisplay" class="bg-[#F8FAF7] border border-[#E2EAE0] rounded-2xl p-3 flex items-center justify-between gap-3">
            <a routerLink="/dashboard" (click)="mobileMenuOpen = false" class="flex items-center gap-3 min-w-0 flex-1 group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-[#123F5B] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                {{ currentUser ? currentUser.charAt(0).toUpperCase() : 'V' }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-[13.5px] font-bold text-[#123F5B] truncate leading-tight">{{ currentUser }}</div>
                <div class="text-[11.5px] text-[#61717A] flex items-center gap-1.5 mt-0.5">
                  <span class="font-semibold text-[#3D742F]">Mi Panel</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-slate-500">Puerto Varas</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-right text-xs text-slate-300 mr-1"></i>
            </a>
            <div class="flex items-center pl-2 border-l border-[#E2EAE0]">
              <button (click)="logoutClicked.emit(); mobileMenuOpen = false" type="button" title="Cerrar sesión"
                      class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer">
                <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() isHomePage = false;
  @Input() isScrolled = false;
  @Input() loginDisplay = false;
  @Input() currentUser = '';

  @Output() openHowItWorks = new EventEmitter<void>();
  @Output() openMaterials = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
  @Output() loginClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

  mobileMenuOpen = false;
  private router = inject(Router);

  scrollToSection(sectionId: string): void {
    this.mobileMenuOpen = false;
    if (this.isHomePage) {
      if (typeof document !== 'undefined') {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
    this.router.navigate(['/'], { fragment: sectionId });
  }

  get headerClass(): string {
    if (this.mobileMenuOpen) {
      return 'sticky top-0 z-50 transition-all duration-300 bg-white border-b border-[#E2E9E4] shadow-md text-[#183247]';
    }
    if (this.isHomePage) {
      if (this.isScrolled) {
        return 'sticky top-0 z-50 transition-all duration-300 -mb-20 bg-[#041624]/95 backdrop-blur-md border-b border-white/10 shadow-md text-white';
      }
      return 'sticky top-0 z-50 transition-all duration-300 -mb-20 bg-transparent border-b-0 border-transparent shadow-none text-white';
    }
    return 'sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#E2E9E4] shadow-sm text-[#183247]';
  }

  get logoTextClass(): string {
    if (this.mobileMenuOpen) {
      return 'text-[#123F5B]';
    }
    return (this.isHomePage && !this.isScrolled) ? 'text-white' : 'text-[#123F5B]';
  }

  get logoAccentClass(): string {
    if (this.mobileMenuOpen || (!this.isHomePage || this.isScrolled)) {
      return 'text-[#3D742F]';
    }
    return 'text-[#4ade80]';
  }

  get logoSloganClass(): string {
    if (this.mobileMenuOpen) {
      return 'text-[#546571]';
    }
    return (this.isHomePage && !this.isScrolled) ? 'text-slate-300' : 'text-[#546571]';
  }

  get navTextClass(): string { return this.isHomePage ? 'text-white' : 'text-[#183247]'; }
  get sealBorderClass(): string { return this.isHomePage ? 'border-white/20' : 'border-[#E2E9E4]'; }
  get sealSubtextClass(): string { return (this.isHomePage && !this.isScrolled) ? 'text-slate-300' : 'text-[#546571]'; }
  get sealTitleClass(): string { return (this.isHomePage && !this.isScrolled) ? 'text-white' : 'text-[#123F5B]'; }
  get accountBtnClass(): string {
    if (this.isHomePage && !this.isScrolled) {
      return 'border-white/35 hover:border-white text-white hover:bg-white/10 active:bg-white/15';
    }
    return 'border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 active:bg-slate-100';
  }

  get hamburgerBtnClass(): string {
    if (this.mobileMenuOpen) {
      return 'bg-[#F0F5F2] text-[#123F5B] hover:bg-[#E2EBE5]';
    }
    if (this.isHomePage && !this.isScrolled) {
      return 'bg-white/15 text-white hover:bg-white/25';
    }
    return 'bg-[#F0F5F2] text-[#123F5B] hover:bg-[#E2EBE5]';
  }
}
