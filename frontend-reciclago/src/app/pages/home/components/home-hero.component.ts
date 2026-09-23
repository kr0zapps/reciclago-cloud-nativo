import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection Puerto Varas Recicla -->
    <section class="relative min-h-[100svh] lg:min-h-screen flex flex-col justify-between bg-[#041624] text-white overflow-hidden" id="inicio">
      
      <!-- 1. Escenario Fotográfico: Volcán Osorno y Lago Llanquihue al atardecer -->
      <div class="absolute inset-0 -bottom-2 z-0 pointer-events-none overflow-hidden">
        <img
          alt="Lago Llanquihue y Volcán Osorno al atardecer - Puerto Varas"
          class="w-full h-full object-cover object-[center_35%] sm:object-[center_38%] lg:object-[center_42%] scale-105 select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform"
          [ngStyle]="{ transform: 'translate3d(0, ' + parallaxOffset + 'px, 0)' }"
          src="assets/ultrawide.jpg"
        />

        <!-- Viñeta Superior para Contraste Impecable del Header Transparente -->
        <div class="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#041624]/90 via-[#041624]/50 to-transparent"></div>

        <!-- Overlays Fotográficos Limpios (Cero neón, contraste natural y uniforme) -->
        <div class="hidden lg:block absolute inset-0 hero-overlay-desktop"></div>
        <div class="lg:hidden absolute inset-0 hero-overlay-mobile"></div>

        <!-- Sombra de anclaje inferior hacia el fondo de la página -->
        <div class="absolute -bottom-2 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#041624] via-[#041624]/80 to-transparent"></div>
      </div>

      <!-- 2. Espaciador Superior para Compensar el Header Sticky -->
      <div class="h-20 sm:h-24 flex-shrink-0 pointer-events-none"></div>

      <!-- 3. Contenido Editorial Principal: Monumental, Centrado e Imponente (Cero Slop, Cero Cuadritos) -->
      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 w-full my-auto text-center flex flex-col items-center justify-center">
        
        <!-- Titular Monumental, Grande e Imponente -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[90px] font-black tracking-tight leading-[0.98] sm:leading-[1.02] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] font-heading">
          Reciclaje Comunal<br />
          <span class="text-[#22a652] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">Puerto Varas</span>
        </h1>

        <!-- Subtítulo Corto, Directo y Conciso (Cero relleno burocrático) -->
        <p class="text-base sm:text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto mt-4 sm:mt-6 mb-7 sm:mb-9 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] leading-snug">
          Retiro domiciliario y pesaje digital para proteger nuestro lago.
        </p>

        <!-- Botones de Acción Centrados, Ergonómicos y con Colores Sólidos -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto">
          <a
            routerLink="/dashboard"
            class="inline-flex items-center justify-center gap-2.5 min-h-[52px] sm:min-h-[56px] px-8 sm:px-10 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-2xl shadow-emerald-950/70 border-none transition-all active:scale-[0.98] cursor-pointer">
            <span>Ingresar al Portal Vecinal</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>

          <a
            href="#cuadrantes"
            (click)="scrollToSection($event, 'cuadrantes')"
            class="inline-flex items-center justify-center gap-2.5 min-h-[52px] sm:min-h-[56px] px-7 sm:px-9 rounded-xl bg-[#092232]/85 hover:bg-[#123F5B] text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md shadow-xl transition-all active:scale-[0.98] cursor-pointer">
            <i class="fa-solid fa-calendar-days text-[#22a652]"></i>
            <span>Ver Cuadrantes y Días</span>
          </a>
        </div>

        <!-- Lema Cálido / Humano Centrado y Sobrio -->
        <div class="mt-7 sm:mt-9 flex items-center justify-center gap-2 text-white/80 drop-shadow-md">
          <i class="fa-solid fa-water text-xs text-[#22a652]"></i>
          <span class="font-script text-xl sm:text-2xl text-slate-200 tracking-wide font-bold">
            Reciclar también es cuidar nuestro lago 🍃
          </span>
        </div>

      </div>

      <!-- 4. Scroll Indicator Abajo al Centro -->
      <div class="relative z-10 pb-5 sm:pb-7 flex justify-center pointer-events-auto anim-fade-up">
        <a
          href="#como-funciona"
          (click)="scrollToSection($event, 'como-funciona')"
          class="inline-flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-300 group cursor-pointer font-heading"
          aria-label="Conoce el ciclo de reciclaje municipal">
          <p class="text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity m-0">
            Conoce el ciclo
          </p>
          <div class="anim-float-subtle">
            <i class="fa-solid fa-chevron-down text-xs text-white/80 group-hover:text-white transition-colors"></i>
          </div>
        </a>
      </div>

    </section>
    <!-- END: HeroSection -->
  `
})
export class HomeHeroComponent {
  parallaxOffset = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scroll = window.scrollY;
      if (scroll <= 850) {
        this.parallaxOffset = Math.round(scroll * 0.15);
      }
    }
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
