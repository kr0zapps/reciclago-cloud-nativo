import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-[#041D2D] text-white pt-8 pb-8 relative overflow-hidden border-t-2 border-[#0E5177]">
      <!-- SILUETAS VECTORIALES: VOLCÁN OSORNO Y OLAS DEL LAGO LLANQUIHUE -->
      <div class="w-full h-24 sm:h-28 overflow-hidden relative pointer-events-none mb-4 opacity-100 z-0">
        <svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 90 L120 70 L240 78 L380 50 L520 68 L680 15 L760 45 L900 65 L1040 38 L1180 62 L1320 48 L1440 75 L1440 100 L0 100 Z"
                fill="url(#mountainGradVibrant)" opacity="0.95"></path>
          <polygon points="680,15 640,45 660,50 680,42 700,50 720,45" fill="#FFFFFF" opacity="0.95"></polygon>
          <polygon points="1040,38 1010,58 1025,62 1040,56 1055,62 1070,58" fill="#FFFFFF" opacity="0.9"></polygon>

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
          <!-- Logo RecicLaGo Oficial -->
          <a class="flex items-center gap-4 group cursor-pointer" routerLink="/">
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
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">
                Puerto Varas recicla • Cuenca Protegida
              </span>
            </div>
          </a>

          <!-- Enlaces de Navegación del Footer -->
          <nav class="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200 font-medium">
            <a class="hover:text-[#72be36] transition-colors" routerLink="/">Inicio</a>
            <span class="text-white/40">|</span>
            <button (click)="openHowItWorks.emit()" type="button" class="hover:text-[#72be36] transition-colors cursor-pointer">¿Cómo funciona?</button>
            <span class="text-white/40">|</span>
            <button (click)="openMaterials.emit()" type="button" class="hover:text-[#72be36] transition-colors cursor-pointer">Materiales</button>
            <span class="text-white/40">|</span>
            <a class="hover:text-[#72be36] transition-colors" routerLink="/dashboard">Retiro especial</a>
            <span class="text-white/40">|</span>
            <button (click)="openContact.emit()" type="button" class="hover:text-[#72be36] transition-colors cursor-pointer">Contacto</button>
          </nav>

          <!-- Sello Municipal y Redes Sociales -->
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
            © 2026 Municipalidad de Puerto Varas. Todos los derechos reservados.
          </p>

          <div class="flex items-center gap-2">
            <span class="font-script text-white text-2xl sm:text-3xl font-bold tracking-wide">
              Puerto Varas, más limpia, es posible
            </span>
            <span class="text-[#72be36] text-sm"><i class="fa-solid fa-leaf"></i></span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Output() openHowItWorks = new EventEmitter<void>();
  @Output() openMaterials = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
}
