import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../data/sectors.data';

@Component({
  selector: 'app-hero-pickup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-3xl sm:rounded-[2.2rem] border-2 border-[#CCE2C9] shadow-sm p-6 sm:p-10 lg:p-12 relative overflow-hidden card-hover anim-fade-up anim-delay-2 group">
      <!-- Acento suave de silueta del lago en el fondo del hero con micro-resplandor en hover -->
      <div class="absolute -bottom-16 -right-16 w-96 h-96 bg-[#F4F9F2] group-hover:bg-[#EAF6E8] rounded-full blur-2xl pointer-events-none -z-0 transition-colors duration-500"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <!-- COLUMNA IZQUIERDA: INFORMACIÓN PROTAGONISTA DEL RETIRO (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <!-- Estado sobrio y claro -->
            <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <i class="fa-regular fa-calendar-check text-[#4F8A3D]"></i>
              <span>Próximo retiro programado en tu sector</span>
            </div>

            <!-- DÍA ASIGNADO PROTAGONISTA -->
            <div class="mt-2.5">
              <div class="flex flex-wrap items-baseline gap-3 sm:gap-4">
                <h2 class="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-brand-navy tracking-tight">
                  {{ sector?.dia }}
                </h2>
                <span class="font-heading font-semibold text-2xl sm:text-3xl text-brand-lake">
                  {{ sector?.fechaTexto }}
                </span>
              </div>
            </div>

            <!-- DETALLES (Horario y Dirección) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              <div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-lake/40">
                <div class="w-12 h-12 rounded-xl bg-[#E8F3F7] text-brand-lake flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
                  <i class="fa-regular fa-clock"></i>
                </div>
                <div>
                  <span class="text-xs text-slate-500 font-medium block">Horario estimado</span>
                  <span class="text-base sm:text-[17px] font-bold text-brand-navy">{{ sector?.horario }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-green/40">
                <div class="w-12 h-12 rounded-xl bg-[#EEF7EC] text-brand-green flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <span class="text-xs text-slate-500 font-medium block">Dirección de retiro</span>
                  <span class="text-base sm:text-[17px] font-bold text-brand-navy leading-tight">{{ userAddress || sector?.direccionEjemplo }}</span>
                  <span class="text-xs text-slate-500 block">{{ sector?.nombre }}, Puerto Varas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- INDICACIÓN VECINAL CLARA Y DIRECTA -->
          <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3.5 text-amber-950">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-amber-900 block">Indicación municipal</span>
              <p class="text-sm sm:text-[15px] text-amber-900/90 mt-0.5 leading-snug">
                Deja tus residuos de <strong>{{ sector?.materialPrincipal || 'Vidrio' }}</strong> limpios y secos en el frontis de tu domicilio antes de las <strong class="font-extrabold text-amber-950">08:00 hrs</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: MATERIAL DE LA SEMANA -->
        <div class="lg:col-span-5 flex flex-col">
          <div class="h-full rounded-2xl sm:rounded-3xl bg-[#F4F8F4] border border-[#DFE8E1] p-6 sm:p-8 flex flex-col justify-between text-center relative shadow-xs">
            <!-- Título de sección limpio -->
            <div class="flex items-center justify-center gap-2 text-slate-700 font-bold text-sm">
              <i class="fa-solid fa-recycle text-[#4F8A3D]"></i>
              <span>Material de la semana</span>
            </div>

            <!-- ILUSTRACIÓN VECTORIAL CLARA -->
            <div class="my-4 relative">
              <div class="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-white shadow-sm border border-[#CCE4C8] flex items-center justify-center relative p-3">
                <svg class="w-20 h-20 sm:w-24 sm:h-24" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <!-- Botella verde principal -->
                  <path d="M44 14H52V24L58 32V68C58 72 55 76 50 76H46C41 76 38 72 38 68V32L44 24V14Z" fill="#4F8A3D" opacity="0.9"></path>
                  <path d="M44 12H52V14H44V12Z" fill="#123F5B"></path>
                  <rect fill="#EEF7EC" height="18" rx="2" width="12" x="42" y="42"></rect>
                  <circle cx="48" cy="51" fill="#4F8A3D" r="3"></circle>
                  <!-- Frasco de vidrio lateral -->
                  <rect fill="#1F6685" height="26" opacity="0.28" rx="4" stroke="#1F6685" stroke-width="2" width="16" x="56" y="44"></rect>
                  <rect fill="#123F5B" height="6" rx="1" width="12" x="58" y="38"></rect>
                  <!-- Botellita pequeña lateral izquierda -->
                  <path d="M30 40H34V46L38 52V70C38 72 36 74 33 74H31C28 74 26 72 26 70V52L30 46V40Z" fill="#8EAD73" opacity="0.8"></path>
                </svg>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-3">Esta semana corresponde</p>
              <h3 class="font-heading font-black text-3xl sm:text-4xl text-[#4F8A3D] tracking-wide mt-0.5">{{ sector?.materialPrincipal }}</h3>
            </div>

            <!-- INSTRUCCIONES ESENCIALES Y DIRECTAS -->
            <div class="space-y-2 bg-white rounded-xl p-3.5 border border-[#DFE8E1] text-left">
              <div class="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <i class="fa-solid fa-check text-[#4F8A3D] text-sm"></i>
                <span>Materiales clasificados, limpios y secos</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-slate-500">
                <i class="fa-solid fa-xmark text-slate-400 text-sm"></i>
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
