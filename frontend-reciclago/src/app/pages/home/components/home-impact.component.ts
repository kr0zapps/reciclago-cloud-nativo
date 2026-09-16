import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: ImpactSection -->
    <section class="relative py-16 sm:py-20 bg-gradient-to-b from-sky-50/70 via-emerald-50/30 to-white overflow-hidden border-t border-slate-100" id="impacto">
      <!-- Watermarked volcano silhouette background -->
      <div class="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
        <svg class="w-full h-auto text-sky-700 max-h-96" fill="currentColor" viewBox="0 0 1200 350">
          <path d="M0,350 L350,140 L450,220 L650,40 L850,230 L1000,160 L1200,350 Z"></path>
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Heading -->
        <div class="mb-12">
          <span class="inline-block px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold text-xs mb-3 shadow-2xs">
            Nuestra huella
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
            Impacto en la comuna
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 max-w-xl">
            Cada kilo reciclado cuenta. Así avanzamos juntos hacia una Puerto Varas más limpia y sustentable.
          </p>
        </div>

        <!-- 3 Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          <!-- Métrica 1: Kilos certificados -->
          <div class="bg-white rounded-2xl p-7 sm:p-8 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all duration-300">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 3v2.05c-3.95.49-7 3.85-7 7.95 0 3.1 1.77 5.79 4.38 7.12L10.5 19H12v2H6v-2h2.5l.88-.72C6.18 17.02 4 13.8 4 10c0-4.08 3.05-7.44 7-7.95V0h2v2.05c3.95.49 7 3.85 7 7.95 0 3.8-2.18 7.02-5.38 8.28l.88.72H18v2h-6v-2h1.5l1.12-1.12C17.23 15.79 19 13.1 19 10c0-4.1-3.05-7.46-7-7.95V0h-2v3zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
              </svg>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              248.650 kg
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Kilos de reciclaje certificados
            </h3>
            <p class="text-[11px] text-slate-400 font-medium">
              Desde el inicio del programa
            </p>
          </div>

          <!-- Métrica 2: Disminución en vertederos -->
          <div class="bg-white rounded-2xl p-7 sm:p-8 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all duration-300">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"></path>
              </svg>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              32%
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Disminución de carga en vertederos provinciales
            </h3>
            <p class="text-[11px] text-slate-400 font-medium">
              vs. año anterior
            </p>
          </div>

          <!-- Métrica 3: Capacidad activa -->
          <div class="bg-white rounded-2xl p-7 sm:p-8 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all duration-300">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-5-2v2H4V6h11zm-9 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4h-2.5l-2-2.5H15V14h3v-2z"></path>
              </svg>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              4
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Capacidad activa de camiones
            </h3>
            <p class="text-[11px] text-slate-400 font-medium">
              En operación diaria
            </p>
          </div>

        </div>

        <!-- Panoramic Scenic Banner: Tu compromiso hace la diferencia -->
        <div class="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 min-h-[200px] sm:min-h-[220px] flex items-center">
          <!-- Scenic background photo: Lake, flowers, and volcano -->
          <img
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute inset-0 w-full h-full object-cover object-center"
            src="assets/stitch/cta_lake_flowers.png"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:to-white/20"></div>

          <!-- Content Box -->
          <div class="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-start gap-4 max-w-xl">
              <div class="shrink-0 w-12 h-12 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] mt-1 shadow-xs">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#0a233b] tracking-tight mb-1 font-heading">
                  Tu compromiso hace la diferencia
                </h2>
                <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Reciclar no es solo separar, es cuidar nuestra comuna y el Lago Llanquihue.
                </p>
              </div>
            </div>

            <div class="shrink-0">
              <button
                type="button"
                (click)="openInfoModal.emit()"
                class="inline-flex items-center gap-2 bg-[#286f34] hover:bg-[#205b2a] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow group cursor-pointer">
                <span>Más información sobre el programa</span>
                <span class="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
    <!-- END: ImpactSection -->
  `
})
export class HomeImpactComponent {
  @Output() openInfoModal = new EventEmitter<void>();
}
