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
            <!-- Header de estado y aviso -->
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-green text-white text-xs sm:text-sm font-bold shadow-xs">
                <i class="fa-solid fa-calendar-check"></i> Próximo Retiro
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2E9E4] text-[#123F5B] text-xs sm:text-sm font-semibold shadow-2xs">
                <i class="fa-solid fa-check text-emerald-600 text-xs"></i> Confirmado en tu sector
              </span>
            </div>

            <!-- DÍA ASIGNADO GIGANTE Y CÁLIDO -->
            <div class="mt-4">
              <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-muted block">Día asignado para tu hogar</span>
              <div class="flex flex-wrap items-baseline gap-3 sm:gap-4 mt-1">
                <h2 class="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-brand-navy tracking-tight">
                  {{ (sector?.dia || '').toUpperCase() }}
                </h2>
                <span class="font-heading font-semibold text-2xl sm:text-3xl text-brand-lake">
                  {{ sector?.fechaTexto }}
                </span>
              </div>
            </div>

            <!-- DETALLES AMPLIOS (Horario y Dirección) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              <div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-lake/40">
                <div class="w-12 h-12 rounded-xl bg-[#E8F3F7] text-brand-lake flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
                  <i class="fa-regular fa-clock"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase text-brand-muted tracking-wider block">Horario municipal</span>
                  <span class="text-base sm:text-[17px] font-bold text-brand-navy">{{ sector?.horario }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-green/40">
                <div class="w-12 h-12 rounded-xl bg-[#EEF7EC] text-brand-green flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <span class="text-xs font-bold uppercase text-brand-muted tracking-wider block">Tu dirección activa</span>
                  <span class="text-base sm:text-[17px] font-bold text-brand-navy leading-tight">{{ userAddress || sector?.direccionEjemplo }}</span>
                  <span class="text-xs text-brand-muted block">{{ sector?.nombre }}, Puerto Varas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- INDICACIÓN VECINAL CLARA Y HUMANA -->
          <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-4 text-amber-950 transition-colors hover:bg-amber-50">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg flex-shrink-0 mt-0.5 interactive-icon">
              <i class="fa-solid fa-lightbulb"></i>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800 block">Indicación para los vecinos</span>
              <p class="text-[15px] sm:text-[16px] text-amber-900 mt-1 leading-snug">
                Recuerda dejar tus botellas y frascos de vidrio limpios y secos en el frontis de tu domicilio antes de las <strong class="font-extrabold text-amber-950 underline decoration-amber-300">08:00 hrs</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: MATERIAL DE LA SEMANA ILUSTRADO Y RECONOCIBLE (5 Cols) -->
        <div class="lg:col-span-5 flex flex-col">
          <div class="h-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#F2F8F0] via-[#EBF4E9] to-[#E2F0DE] border-2 border-brand-green/30 p-6 sm:p-8 flex flex-col justify-between text-center relative shadow-xs transition-all duration-300 group-hover:border-brand-green/50">
            <!-- Badge superior de Material -->
            <div class="inline-flex items-center justify-center gap-2 self-center bg-brand-green text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-xs -mt-2">
              <i class="fa-solid fa-recycle anim-recycle-spin"></i> Material de la semana
            </div>

            <!-- ILUSTRACIÓN VECTORIAL CLARA: Contenedor y Botellas de Vidrio -->
            <div class="my-4 relative">
              <div class="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-white shadow-md border-4 border-[#C8E4C3] flex items-center justify-center relative p-3 anim-float-soft transition-transform duration-300 group-hover:scale-105">
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
                  <!-- Pequeños destellos -->
                  <path d="M68 28L70 32L74 34L70 36L68 40L66 36L62 34L66 32L68 28Z" fill="#EAB308"></path>
                  <path d="M26 26L27.5 29L30.5 30.5L27.5 32L26 35L24.5 32L21.5 30.5L24.5 29L26 26Z" fill="#4F8A3D"></path>
                </svg>
                <div class="absolute -bottom-2 -right-2 bg-brand-navy text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md text-sm border-2 border-white anim-recycle-spin">
                  <i class="fa-solid fa-recycle"></i>
                </div>
              </div>
              <p class="text-xs uppercase font-bold text-brand-muted tracking-widest mt-3">Esta semana reciclamos exclusivamente</p>
              <h3 class="font-heading font-black text-3xl sm:text-4xl text-brand-green tracking-wide mt-0.5">{{ sector?.materialPrincipal }}</h3>
            </div>

            <!-- INSTRUCCIONES ESENCIALES Y DIRECTAS -->
            <div class="space-y-2 bg-white/90 rounded-2xl p-4 border border-[#DFE8E1] text-left">
              <div class="flex items-center gap-2.5 text-[15px] font-bold text-emerald-900">
                <i class="fa-solid fa-circle-check text-brand-green text-base"></i>
                <span>Botellas y frascos limpios y secos</span>
              </div>
              <div class="flex items-center gap-2.5 text-[14px] font-semibold text-slate-600">
                <i class="fa-solid fa-circle-xmark text-rose-500 text-base"></i>
                <span>Sin tapas metálicas, plásticas ni corchos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroPickupComponent {
  @Input() sector!: Sector | any;
  @Input() userAddress: string = '';
}
