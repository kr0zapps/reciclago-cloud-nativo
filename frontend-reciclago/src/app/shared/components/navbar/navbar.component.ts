import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  host: { class: 'contents' },
  template: `
    <header [ngClass]="headerClass">
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
              <span class="font-heading font-extrabold text-2xl text-[#4ade80] transition-colors">LaGo</span>
            </div>
            <p class="text-[11px] font-bold tracking-wide uppercase -mt-0.5 hidden sm:block transition-colors" [ngClass]="logoSloganClass">Puerto Varas recicla</p>
          </div>
        </a>

        <!-- NAVEGACIÓN DESKTOP -->
        <nav class="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-[14px] lg:text-[15px] font-semibold transition-colors" [ngClass]="navTextClass">
          <a routerLink="/" routerLinkActive="font-bold" [routerLinkActiveOptions]="{exact: true}" class="relative py-2 hover:text-[#4ade80] transition-colors flex flex-col items-center">
            <span>Inicio</span>
            <div class="w-6 h-0.5 sm:h-1 bg-[#4ade80] rounded-full mt-1"></div>
          </a>
          <button (click)="openHowItWorks.emit()" type="button" class="hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">¿Cómo funciona?</button>
          <button (click)="openMaterials.emit()" type="button" class="hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">Materiales</button>
          <a routerLink="/dashboard" class="hover:text-[#4ade80] transition-colors py-2">Retiro especial</a>
          <button (click)="openContact.emit()" type="button" class="hover:text-[#4ade80] transition-colors py-2 font-semibold cursor-pointer">Contacto</button>
        </nav>

        <!-- ACCIONES DERECHA -->
        <div class="flex items-center gap-4 sm:gap-5 lg:gap-6 flex-shrink-0">
          <div class="hidden lg:flex items-center gap-2.5 pr-4 sm:pr-5 lg:pr-6 border-r transition-colors" [ngClass]="sealBorderClass">
            <img src="assets/escudo-puerto-varas.svg" alt="Ilustre Municipalidad de Puerto Varas" class="h-9 w-auto object-contain">
            <div class="text-left leading-tight">
              <div class="text-[9.5px] font-bold uppercase tracking-wider transition-colors" [ngClass]="sealSubtextClass">Ilustre Municipalidad</div>
              <div class="text-[12.5px] font-extrabold tracking-tight transition-colors" [ngClass]="sealTitleClass">Puerto Varas</div>
            </div>
          </div>

          <!-- Botón Mi cuenta / Pill Vecinal -->
          <a *ngIf="!loginDisplay" routerLink="/login"
             class="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-xs cursor-pointer"
             [ngClass]="accountBtnClass">
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
            <button (click)="logoutClicked.emit()" class="ml-1 sm:ml-2 text-[11.5px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors border-l border-[#DFE8E1] pl-2.5 sm:pl-3 cursor-pointer">
              Salir
            </button>
          </div>

          <!-- Botón Hamburger Móvil -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen"
                  type="button"
                  class="md:hidden relative w-10 h-10 inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none cursor-pointer shadow-xs active:scale-95"
                  [ngClass]="hamburgerBtnClass"
                  aria-label="Abrir menú de navegación">
            <i class="fa-solid fa-bars text-lg transition-transform duration-300" [class.rotate-90]="mobileMenuOpen" [class.hidden]="mobileMenuOpen"></i>
            <i class="fa-solid fa-xmark text-lg transition-transform duration-300" [class.rotate-90]="!mobileMenuOpen" [class.hidden]="!mobileMenuOpen"></i>
          </button>
        </div>
      </div>

      <!-- Menú Móvil Desplegable -->
      <div *ngIf="mobileMenuOpen"
           class="md:hidden border-t border-[#E2E9E4] bg-white px-4 pt-3 pb-5 space-y-3.5 shadow-xl border-b border-[#E2E9E4] relative z-50 animate-drawer-slide">
        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
          <img src="assets/escudo-puerto-varas.svg" alt="Escudo Puerto Varas" class="h-8 w-auto object-contain flex-shrink-0">
          <div class="text-xs text-[#546571] leading-tight">
            Ilustre Municipalidad de <strong class="text-[#123F5B] block font-bold">Puerto Varas</strong>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3E6] text-[#3D742F] border border-[#CCE4C8]">Portal 2026</span>
        </div>

        <nav class="flex flex-col space-y-1 text-[15px] font-semibold text-[#183247]">
          <a routerLink="/" (click)="mobileMenuOpen = false" routerLinkActive="bg-[#EEF5EB] text-[#4F8A3D] font-bold" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all cursor-pointer">
            <i class="fa-solid fa-house w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Inicio</span>
          </a>
          <button type="button" (click)="openHowItWorks.emit(); mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-circle-question w-5 text-center text-sm text-[#0ea5e9]"></i>
            <span>¿Cómo funciona?</span>
          </button>
          <button type="button" (click)="openMaterials.emit(); mobileMenuOpen = false"
                  class="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all font-semibold text-[15px] text-[#183247] cursor-pointer">
            <i class="fa-solid fa-recycle w-5 text-center text-sm text-[#4F8A3D]"></i>
            <span>Materiales</span>
          </button>
          <a routerLink="/dashboard" (click)="mobileMenuOpen = false" routerLinkActive="bg-[#EEF5EB] text-[#4F8A3D] font-bold"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAF7] transition-all cursor-pointer">
            <i class="fa-solid fa-truck-pickup w-5 text-center text-sm text-[#123F5B]"></i>
            <span>Retiro especial</span>
          </a>
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

  get headerClass(): string {
    if (this.isHomePage) {
      if (this.isScrolled) {
        return 'sticky top-0 z-50 transition-all duration-300 -mb-20 bg-[#041624]/95 backdrop-blur-md border-b border-white/10 shadow-md text-white';
      }
      return 'sticky top-0 z-50 transition-all duration-300 -mb-20 bg-transparent border-b border-transparent shadow-none text-white';
    }
    return 'sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#E2E9E4] shadow-sm text-[#183247]';
  }

  get logoTextClass(): string { return this.isHomePage ? 'text-white' : 'text-[#123F5B]'; }
  get logoSloganClass(): string { return this.isHomePage ? 'text-slate-300' : 'text-[#546571]'; }
  get navTextClass(): string { return this.isHomePage ? 'text-white' : 'text-[#183247]'; }
  get sealBorderClass(): string { return this.isHomePage ? 'border-white/20' : 'border-[#E2E9E4]'; }
  get sealSubtextClass(): string { return this.isHomePage ? 'text-slate-300' : 'text-[#546571]'; }
  get sealTitleClass(): string { return this.isHomePage ? 'text-white' : 'text-[#123F5B]'; }
  get accountBtnClass(): string { return this.isHomePage ? 'bg-[#22a652] hover:bg-[#1b8e45] text-white' : 'bg-[#0e5584] hover:bg-[#0b476f] text-white'; }
  get hamburgerBtnClass(): string {
    if (this.isHomePage && !this.isScrolled) {
      return 'bg-white/15 text-white hover:bg-white/25';
    }
    return 'bg-[#F0F5F2] text-[#123F5B] hover:bg-[#E2EBE5]';
  }
}
