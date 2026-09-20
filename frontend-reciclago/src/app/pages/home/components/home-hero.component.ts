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
          
          <!-- Columna Izquierda: Titular, Subtítulo, Métrica y CTAs -->
          <div class="lg:col-span-8 xl:col-span-8 max-w-2xl xl:max-w-3xl">

            <!-- Elemento de Confianza: Chip pequeño con métrica de impacto -->
            <div class="anim-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-semibold text-white/95 mb-5 select-none font-heading shadow-xs">
              <span class="w-2 h-2 rounded-full bg-[#2E9E4F]"></span>
              <span>+12.000 vecinos ya reciclan en la comuna</span>
            </div>

            <!-- Titular Principal (Izquierda): Blanco puro, bold sans-serif grande con leve text-shadow -->
            <h1 class="anim-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold text-white tracking-tight uppercase leading-[1.08] mb-4 font-heading break-words hero-text-shadow">
              JUNTOS CUIDAMOS<br class="hidden sm:block" /> PUERTO VARAS
            </h1>

            <!-- Subtítulo: Una línea de apoyo clara y corta sobre el impacto en la comuna y la cuenca del lago -->
            <p class="anim-fade-up anim-delay-1 text-base sm:text-lg lg:text-[19px] text-white/95 font-medium leading-relaxed max-w-xl mb-8 break-words hero-subtext-shadow font-heading">
              El sistema municipal de reciclaje comunitario que protege nuestra comuna y preserva las aguas del Lago Llanquihue.
            </p>

            <!-- CTAs: Primario Verde Sólido + Secundario Outline con fondo blanco/10% -->
            <div class="anim-fade-up anim-delay-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <!-- CTA Primario: Botón verde sólido dominante con ícono -->
              <a
                routerLink="/dashboard"
                class="group btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] h-12 sm:h-[50px] px-7 rounded-xl bg-[#2E9E4F] hover:bg-[#258241] active:bg-[#1e6c36] text-white font-bold text-sm uppercase tracking-wider cursor-pointer text-center shadow-lg shadow-emerald-950/30 transition-all font-heading">
                <i class="fa-solid fa-arrow-right-to-bracket text-sm group-hover:translate-x-0.5 transition-transform duration-200"></i>
                <span>Ingresar al Portal Vecinal</span>
              </a>

              <!-- CTA Secundario: Botón outline con fondo blanco/10%, mismo tamaño pero menor jerarquía -->
              <a
                href="#cuadrantes"
                (click)="scrollToSection($event, 'cuadrantes')"
                class="group btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] h-12 sm:h-[50px] px-7 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-sm uppercase tracking-wider border border-white/30 hover:border-white/60 cursor-pointer text-center backdrop-blur-sm shadow-sm transition-all font-heading">
                <i class="fa-solid fa-map-location-dot text-sm text-[#4ade80] group-hover:-translate-y-0.5 transition-transform duration-200"></i>
                <span>Ver Cuadrantes de Reciclaje</span>
              </a>
            </div>

            <!-- Línea de Contacto Alternativo Pequeña debajo de los botones -->
            <p class="anim-fade-up anim-delay-3 mt-4 text-xs sm:text-[13px] text-slate-300 font-medium flex items-center gap-2 flex-wrap font-heading">
              <i class="fa-solid fa-phone text-[#4ade80] text-xs"></i>
              <span>¿Necesitas asistencia o agendamiento telefónico?</span>
              <a href="tel:+56652361200" class="text-white font-bold hover:text-[#4ade80] underline underline-offset-2 transition-colors">
                Llama al 65 236 1200
              </a>
            </p>
          </div>

          <!-- Lado Derecho: Sin frases que compitan con el titular; solo un tag pequeño tipo badge discreto -->
          <div class="hidden lg:flex flex-col items-end justify-center pointer-events-none lg:col-span-4 xl:col-span-4 anim-fade-up anim-delay-2">
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#041624]/65 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-bold tracking-wide shadow-xl select-none font-heading">
              <span class="text-sm">🌊</span>
              <span class="text-white font-bold">Cuenca Llanquihue</span>
              <span class="text-slate-400 font-normal">· Puerto Varas</span>
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
          <span class="text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Conoce el ciclo
          </span>
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
