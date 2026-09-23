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
          class="w-full h-full object-cover object-[62%_34%] sm:object-[66%_35%] lg:object-[center_38%] scale-105 select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform"
          [ngStyle]="{ transform: 'translate3d(0, ' + parallaxOffset + 'px, 0)' }"
          src="assets/ultrawide.jpg"
        />

        <!-- Viñeta Superior para Contraste Impecable del Header Transparente -->
        <div class="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#041624]/90 via-[#041624]/50 to-transparent"></div>

        <!-- Overlay Direccional Desktop: de izquierda a derecha, más oscuro a la izquierda para contraste AA garantizado -->
        <div class="hidden lg:block absolute inset-0 hero-overlay-desktop"></div>
        <div class="hidden lg:block absolute inset-0 hero-overlay-spotlight"></div>

        <!-- Overlay Direccional Móvil / Tablet: Contraste vertical robusto con legibilidad AA garantizada -->
        <div class="lg:hidden absolute inset-0 hero-overlay-mobile"></div>

        <!-- Sombra de anclaje inferior hacia el fondo de la página -->
        <div class="absolute -bottom-2 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#041624] via-[#041624]/80 to-transparent"></div>
      </div>

      <!-- 2. Espaciador Superior para Compensar el Header Sticky con Padding Generoso (min. 24px vertical = 96px) -->
      <div class="h-24 flex-shrink-0 pointer-events-none"></div>

      <!-- 3. Contenido Editorial Principal -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full my-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <!-- Columna Izquierda: Titular Limpio, Subtítulo y Botones Directos -->
          <div class="lg:col-span-7 xl:col-span-8 max-w-2xl xl:max-w-3xl">

            <!-- Titular Principal -->
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5 font-heading">
              Reciclaje Comunal<br />
              <span class="text-[#22a652]">Puerto Varas</span>
            </h1>

            <!-- Subtítulo -->
            <p class="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-xl mb-8">
              Sistema de trazabilidad, retiro domiciliario y pesaje digital para proteger la cuenca del Lago Llanquihue bajo la Ley REP.
            </p>

            <!-- CTAs Modernos y Equilibrados -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white font-bold text-sm uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-950/40 transition-all font-heading">
                <span>Ingresar al Portal Vecinal</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>

              <a
                href="#cuadrantes"
                (click)="scrollToSection($event, 'cuadrantes')"
                class="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/25 cursor-pointer backdrop-blur-sm shadow-sm transition-all font-heading">
                <i class="fa-solid fa-calendar-days text-[#22a652]"></i>
                <span>Ver Cuadrantes y Días</span>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: Lema en Cursiva Cálido / Humano que Rellena y Da Identidad Local Única en Desktop -->
          <div class="lg:col-span-5 xl:col-span-4 hidden lg:flex justify-end items-center pointer-events-none pr-2 xl:pr-6">
            <div class="text-right rotate-[-4deg] select-none anim-float-subtle">
              <p class="font-script text-white text-4xl xl:text-[48px] font-bold leading-[1.25] tracking-wide drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]">
                Reciclar también es<br />
                cuidar nuestro<br />
                <span class="text-[#22a652]">lago</span>
              </p>
              <div class="mt-3.5 flex items-center justify-end gap-2 text-emerald-300 drop-shadow-md">
                <i class="fa-solid fa-water text-xs"></i>
                <p class="font-script text-slate-200 text-xl font-bold tracking-wide m-0">Cuenca Llanquihue</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 4. Scroll Indicator Abajo al Centro: "Conoce el ciclo" + chevron animado sutil -->
      <div class="relative z-10 pb-6 sm:pb-8 flex justify-center pointer-events-auto anim-fade-up anim-delay-3">
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

