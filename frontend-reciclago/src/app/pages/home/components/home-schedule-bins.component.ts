import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SectorInfo } from '../data/home-sectors.data';

@Component({
  selector: 'app-home-schedule-bins',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="tu-dia-de-retiro" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 scroll-mt-6 anim-fade-up anim-delay-2">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        <!-- 1. Tarjeta Izquierda: Tu día de retiro esta semana (lg:col-span-3) -->
        <div class="lg:col-span-3 bg-[#f6faf6] rounded-2xl p-5 sm:p-6 border border-[#dceade] flex flex-col justify-between shadow-xs transition-all duration-300"
             [class.ring-2]="justUpdated"
             [class.ring-[#437d32]]="justUpdated">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2.5 text-[#093554]">
                <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#437d32] shadow-2xs border border-emerald-100">
                  <i class="fa-regular fa-calendar-check text-lg"></i>
                </div>
                <span class="text-xs font-bold text-[#093554] tracking-tight">Tu día de retiro</span>
              </div>
              <span *ngIf="justUpdated" class="text-[10px] font-black uppercase tracking-wider text-[#437d32] bg-[#edf8ed] border border-[#d2ead0] px-2 py-0.5 rounded-md">
                Actualizado
              </span>
            </div>

            <div class="my-2">
              <span class="block text-3xl sm:text-4xl font-black text-[#093554] tracking-tight font-heading">
                {{ sector?.day }}
              </span>
              <p class="text-xs font-bold text-[#437d32] mt-1 flex items-center gap-1">
                <i class="fa-solid fa-location-dot text-[10px]"></i>
                {{ sector?.name }}
              </p>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            <div class="bg-[#edf8ed] rounded-xl p-3 flex items-center gap-2.5 border border-[#d2ead0]">
              <div class="w-5 h-5 rounded-full bg-[#437d32] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                <i class="fa-solid fa-check"></i>
              </div>
              <p class="text-[11px] text-[#1c4d26] font-medium leading-snug">
                El camión pasará entre las <strong class="font-bold text-[#0e3517]">{{ sector?.hours }}</strong>
              </p>
            </div>

            <div>
              <a routerLink="/dashboard" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1479b8] hover:underline">
                <span>Ver mapa de recorridos</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- 2. Tarjetas Centrales: Esta semana te toca (4 Bins Pastel) (lg:col-span-6) -->
        <div class="lg:col-span-6 flex flex-col justify-between">
          <h2 class="text-base sm:text-lg font-extrabold text-[#093554] tracking-tight font-heading mb-3">
            Esta semana te toca:
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch flex-1">

            <!-- Bin 1: Vidrio -->
            <div class="bg-[#edf8ed] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#d6ebd0] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="h-24 flex items-center justify-center mb-2">
                <img src="assets/bin_vidrio_clean.png" alt="Vidrio" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
              </div>
              <h3 class="font-bold text-sm text-[#238038] mb-0.5">Vidrio</h3>
              <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Botellas, frascos, vasos (sin tapas).</p>
              <div class="w-5 h-5 rounded-full bg-[#238038] text-white flex items-center justify-center text-[10px] shadow-2xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 2: Cartón -->
            <div class="bg-[#edf4fb] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#d0e5f5] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="h-24 flex items-center justify-center mb-2">
                <img src="assets/bin_carton_clean.png" alt="Cartón" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
              </div>
              <h3 class="font-bold text-sm text-[#176fa9] mb-0.5">Cartón</h3>
              <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Cajas, papeles, revistas, diarios.</p>
              <div class="w-5 h-5 rounded-full bg-[#176fa9] text-white flex items-center justify-center text-[10px] shadow-2xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 3: Plásticos -->
            <div class="bg-[#fef8ed] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#fbe9c8] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="h-24 flex items-center justify-center mb-2">
                <img src="assets/bin_plasticos_clean.png" alt="Plásticos" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
              </div>
              <h3 class="font-bold text-sm text-[#c4871d] mb-0.5">Plásticos</h3>
              <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Envases, botellas, bolsas limpias.</p>
              <div class="w-5 h-5 rounded-full bg-[#c4871d] text-white flex items-center justify-center text-[10px] shadow-2xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 4: Latas -->
            <div class="bg-[#fdf0ef] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#fad5d3] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="h-24 flex items-center justify-center mb-2">
                <img src="assets/bin_latas_clean.png" alt="Latas" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
              </div>
              <h3 class="font-bold text-sm text-[#c94b43] mb-0.5">Latas</h3>
              <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Latas de bebidas y conservas.</p>
              <div class="w-5 h-5 rounded-full bg-[#c94b43] text-white flex items-center justify-center text-[10px] shadow-2xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

          </div>
        </div>

        <!-- 3. Tarjeta Derecha: Camión Municipal en el Lago (lg:col-span-3) -->
        <div class="lg:col-span-3 rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-[#f0f7f9] relative group h-full min-h-[220px]">
          <img
            src="assets/card_truck.png"
            alt="Tu reciclaje también llega al lago - Camión RecicLaGo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  `
})
export class HomeScheduleBinsComponent {
  @Input() sector: SectorInfo | null = null;
  @Input() justUpdated: boolean = false;
}
