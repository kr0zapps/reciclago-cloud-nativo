import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-special-pickup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-gradient-to-r from-[#eaf4ec] via-[#edf7ee] to-[#f4f9f4] py-10 sm:py-12 border-t border-[#e2efe4] relative overflow-hidden anim-fade-up anim-delay-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Retiro especial -->
          <div class="lg:col-span-4 space-y-3.5 text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h2 class="font-script text-3xl sm:text-4xl text-[#0c3e5e] font-bold tracking-tight">
                ¿Necesitas un retiro especial?
              </h2>
              <span class="text-xl anim-leaf text-[#437d32]"><i class="fa-solid fa-leaf"></i></span>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Si tienes residuos fuera de lo común (electrónicos, muebles, escombros, etc.) puedes agendar un <strong class="text-[#093554] font-bold">retiro especial</strong> desde aquí.
            </p>
            <div class="pt-1">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center gap-2 bg-[#437d32] hover:bg-[#366827] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow w-full sm:w-auto cursor-pointer">
                <i class="fa-regular fa-calendar-plus text-base"></i>
                <span>Agendar retiro especial</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: Tarjeta Blanca Flotante con 4 Acciones -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-5 divide-x-0 sm:divide-x divide-slate-100">

              <!-- 1. Ver mi día de retiro -->
              <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div class="w-12 h-12 rounded-2xl bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-mobile-screen"></i>
                </div>
                <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Ver mi día de retiro</h3>
                <p class="text-[11px] text-slate-500 leading-snug">Consulta tu calendario por dirección.</p>
              </a>

              <!-- 2. Mapa de recorridos -->
              <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div class="w-12 h-12 rounded-2xl bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-map-location-dot"></i>
                </div>
                <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Mapa de recorridos</h3>
                <p class="text-[11px] text-slate-500 leading-snug">Revisa las calles y sectores de la comuna.</p>
              </a>

              <!-- 3. Qué se puede reciclar -->
              <button (click)="openMaterialsModal.emit()" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                <div class="w-12 h-12 rounded-2xl bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-leaf"></i>
                </div>
                <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Qué se puede reciclar</h3>
                <p class="text-[11px] text-slate-500 leading-snug">Conoce los materiales y sus condiciones.</p>
              </button>

              <!-- 4. Preguntas frecuentes -->
              <button (click)="openFaqModal.emit()" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                <div class="w-12 h-12 rounded-2xl bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                  ?
                </div>
                <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Preguntas frecuentes</h3>
                <p class="text-[11px] text-slate-500 leading-snug">Resuelve tus dudas rápidamente.</p>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HomeSpecialPickupComponent {
  @Output() openMaterialsModal = new EventEmitter<void>();
  @Output() openFaqModal = new EventEmitter<void>();
}
