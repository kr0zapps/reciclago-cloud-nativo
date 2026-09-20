import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../data/sectors.data';

@Component({
  selector: 'app-hero-pickup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 lg:p-10 relative z-10 card-hover anim-fade-up anim-delay-2">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <!-- COLUMNA IZQUIERDA: INFORMACIÓN PROTAGONISTA DEL RETIRO (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <!-- Estado cívico y claro -->
            <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <i class="fa-regular fa-calendar-check text-[#22a652]"></i>
              <span>Próximo retiro domiciliario en tu sector</span>
            </div>

            <!-- DÍA ASIGNADO PROTAGONISTA -->
            <div class="mt-2.5">
              <div class="flex flex-wrap items-baseline gap-3 sm:gap-4">
                <h2 class="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#123F5B] tracking-tight">
                  {{ sector?.dia }}
                </h2>
                <span class="font-heading font-semibold text-xl sm:text-2xl text-[#1F6685]">
                  {{ sector?.fechaTexto }}
                </span>
              </div>
            </div>

            <!-- DETALLES (Horario y Dirección) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              <div class="flex items-center gap-3.5 p-4 rounded-xl bg-[#F9F8F5] border border-[#E2E8F0] transition-colors hover:bg-white hover:border-[#1F6685]/40">
                <div class="w-11 h-11 rounded-lg bg-[#E8F3F7] text-[#1F6685] flex items-center justify-center text-lg flex-shrink-0">
                  <i class="fa-regular fa-clock"></i>
                </div>
                <div>
                  <span class="text-xs text-slate-500 font-medium block">Horario estimado</span>
                  <span class="text-base font-bold text-[#123F5B]">{{ sector?.horario }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 rounded-xl bg-[#F9F8F5] border border-[#E2E8F0] transition-colors hover:bg-white hover:border-[#22a652]/40">
                <div class="w-11 h-11 rounded-lg bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-lg flex-shrink-0">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <span class="text-xs text-slate-500 font-medium block">Dirección de retiro</span>
                  <span class="text-base font-bold text-[#123F5B] leading-tight">{{ userAddress || sector?.direccionEjemplo }}</span>
                  <span class="text-xs text-slate-500 block">{{ sector?.nombre }}, Puerto Varas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- INDICACIÓN VECINAL CLARA Y DIRECTA -->
          <div class="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5 text-amber-950">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-amber-900 block">Indicación municipal</span>
              <p class="text-xs sm:text-sm text-amber-900/90 mt-0.5 leading-relaxed">
                Deja tus residuos de <strong>{{ sector?.materialPrincipal || 'Vidrio' }}</strong> limpios y secos en el frontis de tu domicilio antes de las <strong class="font-extrabold text-amber-950">08:00 hrs</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: MATERIAL DE LA SEMANA -->
        <div class="lg:col-span-5 flex flex-col">
          <div class="h-full rounded-xl bg-[#F9F8F5] border border-[#E7E4DC] p-6 sm:p-7 flex flex-col justify-between text-center relative shadow-xs">
            <!-- Título de sección limpio -->
            <div class="flex items-center justify-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <i class="fa-solid fa-recycle text-[#22a652]"></i>
              <span>Material de la semana</span>
            </div>

            <!-- ILUSTRACIÓN VECTORIAL CLARA -->
            <div class="my-4 relative">
              <div class="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-2xl bg-white shadow-xs border border-[#E2E8F0] flex items-center justify-center relative p-3">
                <svg class="w-16 h-16 sm:w-20 sm:h-20" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <!-- Botella verde principal -->
                  <path d="M44 14H52V24L58 32V68C58 72 55 76 50 76H46C41 76 38 72 38 68V32L44 24V14Z" fill="#22a652" opacity="0.9"></path>
                  <path d="M44 12H52V14H44V12Z" fill="#123F5B"></path>
                  <rect fill="#ecf7e6" height="18" rx="2" width="12" x="42" y="42"></rect>
                  <circle cx="48" cy="51" fill="#22a652" r="3"></circle>
                  <!-- Frasco de vidrio lateral -->
                  <rect fill="#1F6685" height="26" opacity="0.28" rx="4" stroke="#1F6685" stroke-width="2" width="16" x="56" y="44"></rect>
                  <rect fill="#123F5B" height="6" rx="1" width="12" x="58" y="38"></rect>
                  <!-- Botellita pequeña lateral izquierda -->
                  <path d="M30 40H34V46L38 52V70C38 72 36 74 33 74H31C28 74 26 72 26 70V52L30 46V40Z" fill="#8EAD73" opacity="0.8"></path>
                </svg>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-3">Esta semana corresponde</p>
              <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-[#22a652] tracking-tight mt-0.5">{{ sector?.materialPrincipal }}</h3>
            </div>

            <!-- INSTRUCCIONES ESENCIALES Y DIRECTAS -->
            <div class="space-y-2 bg-white rounded-lg p-3 border border-[#E2E8F0] text-left">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <i class="fa-solid fa-check text-[#22a652] text-xs"></i>
                <span>Materiales clasificados, limpios y secos</span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-slate-500">
                <i class="fa-solid fa-xmark text-slate-400 text-xs"></i>
                <span>Sin residuos orgánicos ni desechos comunes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroPickupComponent {
  @Input() sector!: Sector | null;
  @Input() userAddress: string = '';
}
