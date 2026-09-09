import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../services/bff.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <main class="relative pb-16 pt-2 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 anim-page-deploy">
    
<!-- ==================== ILUSTRACIÓN MULTICAPA DE MONTAÑAS, VOLCÁN OSORNO Y LAGO ==================== -->
<div class="absolute -top-4 left-1/2 -translate-x-1/2 w-screen h-[460px] sm:h-[490px] pointer-events-none overflow-hidden -z-10 select-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]">

  <!-- VISTA RESPONSIVA MÓVIL: ENFOCA EL PICO DEL VOLCÁN OSORNO EN EL CENTRO (< md) -->
  <svg class="w-full h-full block md:hidden" preserveAspectRatio="xMidYMin slice" viewBox="820 30 580 370" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="osornoSnowGradMob" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"></stop>
        <stop offset="100%" stop-color="#E3F0F5" stop-opacity="0.8"></stop>
      </linearGradient>
      <linearGradient id="osornoBodyGradMob" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#8EB9C9" stop-opacity="0.58"></stop>
        <stop offset="60%" stop-color="#5E91A7" stop-opacity="0.4"></stop>
        <stop offset="100%" stop-color="#F8FAF7" stop-opacity="0"></stop>
      </linearGradient>
    </defs>

    <!-- Cordillera de fondo suave directamente sobre el fondo general #F8FAF7 -->
    <g class="anim-mtn-1" opacity="0.45">
      <path d="M 700 240 Q 920 180 1100 210 T 1500 200 L 1500 400 L 700 400 Z" fill="#DCEAF0"></path>
    </g>

    <!-- Volcán Osorno protagonista enfocado directamente en el pico nevado -->
    <g class="anim-mtn-3">
      <!-- Silueta del cono -->
      <path d="M 880 325 L 1090 95 Q 1105 82 1120 95 L 1330 325 Z" fill="url(#osornoBodyGradMob)"></path>
      <path d="M 940 325 L 1105 84 L 1270 325 Z" fill="#5E91A7" opacity="0.22"></path>
      <!-- Cumbre y glaciar nevado -->
      <path d="M 1070 120 L 1105 84 L 1140 120 Q 1130 134 1122 126 Q 1114 138 1105 125 Q 1096 138 1088 126 Q 1080 134 1070 120 Z" fill="url(#osornoSnowGradMob)"></path>
      <!-- Lenguas glaciares -->
      <path d="M 1105 84 L 1114 140 Q 1120 156 1132 170 L 1126 150 L 1105 84 Z" fill="#FFFFFF" opacity="0.75"></path>
      <path d="M 1105 84 L 1096 142 Q 1088 158 1076 172 L 1084 150 L 1105 84 Z" fill="#FFFFFF" opacity="0.55"></path>
    </g>

    <!-- Ondas lacustres orgánicas y suaves -->
    <g class="anim-lake-wave">
      <path d="M 700 325 C 900 310, 1100 340, 1300 318 C 1400 312, 1500 325, 1500 325 L 1500 400 L 700 400 Z" fill="#DDE9D8" opacity="0.35"></path>
      <path d="M 750 345 C 950 330, 1150 360, 1350 342 C 1450 338, 1500 345, 1500 345" fill="none" stroke="#1F6685" stroke-linecap="round" stroke-opacity="0.18" stroke-width="2.5"></path>
      <path d="M 720 360 C 920 350, 1120 375, 1380 360" fill="none" stroke="#8EB9C9" stroke-linecap="round" stroke-opacity="0.22" stroke-width="2"></path>
    </g>
  </svg>

  <!-- VISTA PANORÁMICA COMPLETA: DESKTOP Y TABLET (>= md) -->
  <svg class="w-full h-full hidden md:block" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="osornoSnowGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"></stop>
        <stop offset="100%" stop-color="#E3F0F5" stop-opacity="0.75"></stop>
      </linearGradient>
      <linearGradient id="osornoBodyGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#8EB9C9" stop-opacity="0.52"></stop>
        <stop offset="60%" stop-color="#5E91A7" stop-opacity="0.35"></stop>
        <stop offset="100%" stop-color="#F8FAF7" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient id="calbucoBodyGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#A5C4D4" stop-opacity="0.45"></stop>
        <stop offset="100%" stop-color="#F8FAF7" stop-opacity="0"></stop>
      </linearGradient>
    </defs>

    <!-- CAPA 1: Fondo lejano - Cordillera distante muy suave sobre #F8FAF7 -->
    <g class="anim-mtn-1" opacity="0.5">
      <path d="M-80 270 Q 80 185 240 225 T 580 170 T 920 200 T 1240 160 T 1540 240 L 1540 400 L -80 400 Z" fill="#DCEAF0"></path>
      <path d="M120 220 L 260 170 L 360 215 L 680 150 L 800 205 L 1100 135 L 1260 210 L 1480 165 L 1480 400 L 120 400 Z" fill="#D5E5ED" opacity="0.4"></path>
    </g>

    <!-- CAPA 2: Cordillera intermedia con pico andino secundario -->
    <g class="anim-mtn-2" opacity="0.45">
      <path d="M-40 310 Q 140 210 320 250 T 640 205 T 1000 220 T 1360 190 T 1500 260 L 1500 400 L -40 400 Z" fill="#8EB9C9"></path>
      <path d="M 460 320 L 560 165 L 660 320 Z" fill="url(#calbucoBodyGrad)"></path>
      <polygon points="560,165 540,195 580,195" fill="#FFFFFF" opacity="0.65"></polygon>
      <path d="M220 290 Q 420 195 580 225 T 900 185 T 1280 220 L 1280 400 L 220 400 Z" fill="#5E91A7" opacity="0.38"></path>
    </g>

    <!-- CAPA 3: Volcán Osorno cónico icónico con cumbre nevada y laderas suaves -->
    <g class="anim-mtn-3">
      <!-- Silueta cónica suave del Volcán Osorno hacia la derecha de la composición -->
      <path d="M 880 325 L 1090 95 Q 1105 82 1120 95 L 1330 325 Z" fill="url(#osornoBodyGrad)"></path>
      <path d="M 940 325 L 1105 84 L 1270 325 Z" fill="#5E91A7" opacity="0.18"></path>
      <!-- Glaciar y cumbre de nieve característica del volcán -->
      <path d="M 1070 120 L 1105 84 L 1140 120 Q 1130 134 1122 126 Q 1114 138 1105 125 Q 1096 138 1088 126 Q 1080 134 1070 120 Z" fill="url(#osornoSnowGrad)"></path>
      <!-- Filos de nieve que bajan por las laderas del cono -->
      <path d="M 1105 84 L 1114 140 Q 1120 156 1132 170 L 1126 150 L 1105 84 Z" fill="#FFFFFF" opacity="0.7"></path>
      <path d="M 1105 84 L 1096 142 Q 1088 158 1076 172 L 1084 150 L 1105 84 Z" fill="#FFFFFF" opacity="0.5"></path>
    </g>

    <!-- CAPA 4: Lago Llanquihue orgánico sin cortes rectos -->
    <g class="anim-lake-wave">
      <!-- Capa tenue de bruma lacustre sobre la base de las montañas -->
      <path d="M -60 330 C 180 310, 360 345, 600 320 C 840 295, 1080 335, 1320 315 C 1410 310, 1470 320, 1500 325 L 1500 400 L -60 400 Z" fill="#DDE9D8" opacity="0.35"></path>
      <!-- Líneas de agua onduladas fluidas y sutiles -->
      <path d="M 0 348 C 240 332, 480 365, 720 346 C 960 326, 1200 358, 1440 342" fill="none" stroke="#1F6685" stroke-linecap="round" stroke-opacity="0.18" stroke-width="2.5"></path>
      <path d="M 0 364 C 300 350, 600 376, 900 359 C 1200 344, 1350 368, 1440 356" fill="none" stroke="#8EB9C9" stroke-linecap="round" stroke-opacity="0.22" stroke-width="2"></path>
      <path d="M 0 376 C 200 366, 500 385, 800 372 C 1100 362, 1300 380, 1440 370" fill="none" stroke="#8EAD73" stroke-linecap="round" stroke-opacity="0.18" stroke-width="1.8"></path>
    </g>
  </svg>
</div>

<!-- 1. ENCABEZADO EDITORIAL CON IDENTIDAD DE PUERTO VARAS Y FRASE MANUSCRITA -->
<section class="relative pt-2 pb-2 anim-fade-up anim-delay-1">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="max-w-3xl space-y-2.5">
        <!-- Identificador Cívico de Cuadrante / Sector (Estilo Sobrio) -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="inline-flex items-center gap-2 text-xs font-semibold text-[#123F5B] bg-white/85 backdrop-blur-xs border border-[#E2E9E4] px-3.5 py-1.5 rounded-xl shadow-2xs">
            <i class="fa-solid fa-location-dot text-[#4F8A3D] text-xs"></i>
            <span class="font-bold">{{ (userRoles && userRoles.length > 0) ? userRoles[0] : 'Cuadrante Costanera Sur' }}</span>
            <span class="text-slate-300">•</span>
            <span class="text-slate-600 font-medium">Puerto Varas</span>
            <span class="text-slate-300 hidden sm:inline">•</span>
            <span class="text-slate-500 font-normal text-[11px] hidden sm:inline">Sector Lago</span>
          </div>

          <!-- Indicador de sincronización únicamente durante la carga -->
          <div *ngIf="isLoadingData" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-[#0284c7] text-[11px] font-bold border border-sky-200">
            <i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
            <span>Sincronizando...</span>
          </div>
        </div>
<div class="flex items-center gap-3 pt-1">
<h1 class="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy tracking-tight leading-tight">
            Hola, {{ userName || 'Vecino/a' }} 👋
          </h1>
<!-- Hojita verde decorativa nativa con sutil balanceo natural -->
<svg class="w-7 h-7 text-brand-green-light opacity-90 hidden sm:block -mt-2 anim-leaf-sway" fill="currentColor" viewbox="0 0 24 24">
<path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"></path>
</svg>
</div>
<p class="text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl font-normal">
          Esta semana estás ayudando a mantener <strong class="text-brand-navy font-bold">Puerto Varas</strong> limpia, verde y sustentable junto a nuestro querido Lago Llanquihue.
        </p>
</div>
<!-- Frase con identidad local manuscrita -->
<div class="hidden md:flex flex-col items-end text-right pb-1">
<span class="font-handwriting text-2xl lg:text-3xl text-brand-navy font-bold tracking-wide">
          Juntos por una Puerto Varas más limpia ♡
        </span>
<!-- Ondas sutiles del lago como acento -->
<svg class="w-48 h-3 text-brand-lake mt-1 opacity-70" fill="none" viewbox="0 0 160 10">
<path d="M0,5 Q20,0 40,5 T80,5 T120,5 T160,5" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
</svg>
</div>
</div>
</section>
<!-- 2. HERO PRINCIPAL REFINADO: "TU PRÓXIMO RETIRO" + "MATERIAL DE LA SEMANA" -->
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
                🗓 {{ proximoRetiro?.diaSemana?.toUpperCase() || 'MARTES' }}
              </h2>
<span class="font-heading font-semibold text-2xl sm:text-3xl text-brand-lake">
                {{ proximoRetiro?.fechaTexto || 'Día asignado' }}
              </span>
</div>
</div>
<!-- DETALLES AMPLIOS (Horario y Dirección con textos grandes 15-17px) -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
<div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-lake/40">
<div class="w-12 h-12 rounded-xl bg-[#E8F3F7] text-brand-lake flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
<i class="fa-regular fa-clock"></i>
</div>
<div>
<span class="text-xs font-bold uppercase text-brand-muted tracking-wider block">Horario municipal</span>
<span class="text-base sm:text-[17px] font-bold text-brand-navy">{{ proximoRetiro?.horaInicio ? (proximoRetiro.horaInicio + ' – ' + proximoRetiro.horaFin + ' hrs') : '08:00 – 17:00 hrs' }}</span>
</div>
</div>
<div class="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2EAE0] transition-colors hover:bg-white hover:border-brand-green/40">
<div class="w-12 h-12 rounded-xl bg-[#EEF7EC] text-brand-green flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
<i class="fa-solid fa-location-dot"></i>
</div>
<div>
<span class="text-xs font-bold uppercase text-brand-muted tracking-wider block">Tu dirección</span>
<span class="text-base sm:text-[17px] font-bold text-brand-navy leading-tight">{{ proximoRetiro?.direccion || 'Calle Los Guindos' }}</span>
<span class="text-xs text-brand-muted block">Puerto Varas Centro</span>
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
<!-- ILUSTRACIÓN VECTORIAL CLARA Y DESTACADA: Contenedor y Botellas de Vidrio con animación de flotación -->
<div class="my-4 relative">
<div class="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-white shadow-md border-4 border-[#C8E4C3] flex items-center justify-center relative p-3 anim-float-soft transition-transform duration-300 group-hover:scale-105">
<!-- Composición vectorial: Botellas y frasco dentro del contenedor verde -->
<svg class="w-20 h-20 sm:w-24 sm:h-24" fill="none" viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<!-- Botella verde principal estilizada -->
<path d="M44 14H52V24L58 32V68C58 72 55 76 50 76H46C41 76 38 72 38 68V32L44 24V14Z" fill="#4F8A3D" opacity="0.9"></path>
<path d="M44 12H52V14H44V12Z" fill="#123F5B"></path>
<rect fill="#EEF7EC" height="18" rx="2" width="12" x="42" y="42"></rect>
<circle cx="48" cy="51" fill="#4F8A3D" r="3"></circle>
<!-- Frasco de vidrio lateral transparente/celeste -->
<rect fill="#1F6685" height="26" opacity="0.28" rx="4" stroke="#1F6685" stroke-width="2" width="16" x="56" y="44"></rect>
<rect fill="#123F5B" height="6" rx="1" width="12" x="58" y="38"></rect>
<!-- Botellita pequeña lateral izquierda -->
<path d="M30 40H34V46L38 52V70C38 72 36 74 33 74H31C28 74 26 72 26 70V52L30 46V40Z" fill="#8EAD73" opacity="0.8"></path>
<!-- Pequeñas estrellas / destellos de limpieza -->
<path d="M68 28L70 32L74 34L70 36L68 40L66 36L62 34L66 32L68 28Z" fill="#EAB308"></path>
<path d="M26 26L27.5 29L30.5 30.5L27.5 32L26 35L24.5 32L21.5 30.5L24.5 29L26 26Z" fill="#4F8A3D"></path>
</svg>
<!-- Pill flotante con icono de reciclaje -->
<div class="absolute -bottom-2 -right-2 bg-brand-navy text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md text-sm border-2 border-white anim-recycle-spin">
<i class="fa-solid fa-recycle"></i>
</div>
</div>
<p class="text-xs uppercase font-bold text-brand-muted tracking-widest mt-3">Esta semana reciclamos exclusivamente</p>
<h3 class="font-heading font-black text-3xl sm:text-4xl text-brand-green tracking-wide mt-0.5">{{ proximoRetiro?.residuoNombre?.toUpperCase() || 'VIDRIO' }}</h3>
</div>
<!-- INSTRUCCIONES ESENCIALES Y DIRECTAS (Legibles y contrastadas) -->
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
<!-- 3. SEGUIMIENTO DEL CAMIÓN VISUAL Y DINÁMICO (Línea de tiempo clara de 3 hitos) -->
<section class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs relative card-hover anim-fade-up anim-delay-3">
<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#EAEFE8] gap-4">
<div>
<h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Seguimiento del camión recolector
          </h3>
<p class="text-base text-brand-muted mt-1">Monitoreo cívico en tiempo real para el cuadrante Costanera Sur</p>
</div>
<!-- Badge de recorrido activo sin puntos -->
<span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E8F3F7] text-[#123F5B] border border-[#CFE4ED] self-start sm:self-auto shadow-2xs">
<i class="fa-solid fa-truck-moving text-brand-lake text-sm"></i>
<span>Recorrido activo hoy</span>
</span>
</div>
<!-- LÍNEA DE TIEMPO VISUAL AMPLIA (3 PASOS GRANDES) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
<!-- PASO 1: COMPLETADO (Verde RecicLaGo #4F8A3D con check) -->
<div class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border-2 border-[#CDE5C8] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
<div class="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
<i class="fa-solid fa-check"></i>
</div>
<div>
<span class="text-xs font-bold uppercase tracking-wider text-brand-green">Paso 1 • Completado</span>
<h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro programado</h4>
<p class="text-sm text-brand-muted mt-1 leading-relaxed">
            Tu sector está cargado en la ruta oficial del día.
          </p>
</div>
</div>
<!-- PASO 2: EN CURSO (Azul RecicLaGo #123F5B / #1F6685, animación del camión y pulso radar) -->
<div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EBF4F8] via-[#E2F0F5] to-[#D5E8F0] border-2 border-brand-lake shadow-md flex items-start gap-4 relative overflow-hidden anim-soft-pulse">
<!-- Onda animada de radar -->
<span class="anim-gps-wave absolute top-4 left-4 w-12 h-12 rounded-2xl bg-brand-lake/20 pointer-events-none"></span>
<!-- Icono de camión con animación de cabeceo/marcha suave -->
<div class="w-12 h-12 rounded-2xl bg-brand-lake text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm relative z-10">
<i class="fa-solid fa-truck-moving anim-truck-gentle"></i>
</div>
<div class="flex-grow relative z-10">
<div class="flex items-center justify-between gap-2">
<span class="text-xs font-extrabold uppercase tracking-wider text-brand-lake">Paso 2 • En curso</span>
<span class="px-2.5 py-0.5 rounded-md bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider">
              En ruta
            </span>
</div>
<h4 class="font-heading font-extrabold text-lg sm:text-xl text-brand-navy mt-0.5">Camión en ruta</h4>
<!-- Barrita animada de avance del camión -->
<div class="w-full h-1.5 bg-brand-lake/20 rounded-full mt-2 mb-2 overflow-hidden">
<div class="anim-route-flow h-full w-1/3 bg-brand-lake rounded-full"></div>
</div>
<p class="text-sm text-brand-charcoal font-medium leading-tight">
            Recorriendo cuadrante Costanera Sur.<br/>
<strong class="text-brand-navy font-bold text-sm">Estimado: 08:00 – 17:00 hrs</strong>
</p>
</div>
</div>
<!-- PASO 3: PENDIENTE (Gris neutro suave) -->
<div class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] opacity-80 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
<div class="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
<i class="fa-solid fa-recycle"></i>
</div>
<div>
<span class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 3 • Pendiente</span>
<h4 class="font-heading font-bold text-lg text-slate-700 mt-0.5">Retiro realizado</h4>
<p class="text-sm text-brand-muted mt-1 leading-relaxed">
            Pesaje y traslado seguro al centro de valorización comunal.
          </p>
</div>
</div>
</div>
<!-- FRASE DE ACOMPAÑAMIENTO CON IDENTIDAD LOCAL -->
<div class="mt-8 pt-6 border-t border-[#EEF3EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
<div class="flex items-center gap-2 text-brand-lake font-medium text-sm">
<i class="fa-solid fa-circle-info text-base"></i>
<span>Los camiones cuentan con geolocalización GPS municipal.</span>
</div>
<span class="font-handwriting text-2xl sm:text-3xl font-bold text-brand-navy">
        Cada botella cuenta para cuidar nuestro Lago Llanquihue 💧
      </span>
</div>
</section>
<!-- 4. MÉTRICAS COMUNITARIAS UNIFICADAS (Resumen continuo de impacto con contadores animados por JS) -->
<section class="bg-gradient-to-r from-[#EEF7EC] via-[#F4F9F2] to-[#EEF5F8] border border-[#DFE8E1] rounded-3xl p-6 sm:p-9 shadow-xs card-hover anim-fade-up anim-delay-4" id="impacto-section">
<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#DFEAE0] gap-2">
<div>
<h3 class="font-heading font-extrabold text-2xl text-brand-navy">Tu impacto positivo en Puerto Varas</h3>
<p class="text-base text-brand-muted">Aporte acumulado por tu hogar durante el programa 2025–2026</p>
</div>
<span class="font-handwriting text-2xl text-brand-green-dark font-bold">
        Tu reciclaje también cuida el Lago Llanquihue 🍃
      </span>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8E6D9] gap-6 md:gap-0">
<!-- Métrica 1: Retiros -->
<div class="pt-4 md:pt-0 md:px-6 first:pl-0 flex items-center gap-4 group">
<div class="w-14 h-14 rounded-2xl bg-white text-brand-green flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#D5E6D2] interactive-icon">
<i class="fa-solid fa-arrows-rotate"></i>
</div>
<div>
<div class="font-heading font-black text-4xl text-brand-navy leading-none">
<span class="count-metric" data-target="18">{{ pickups.length }}</span>
</div>
<p class="text-[16px] font-bold text-brand-charcoal mt-1">Retiros realizados</p>
<p class="text-sm text-brand-muted">En tu domicilio en Calle Los Guindos</p>
</div>
</div>
<!-- Métrica 2: Kilogramos -->
<div class="pt-4 md:pt-0 md:px-6 flex items-center gap-4 group">
<div class="w-14 h-14 rounded-2xl bg-white text-brand-green flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#D5E6D2] interactive-icon">
<i class="fa-solid fa-leaf anim-leaf-sway"></i>
</div>
<div>
<div class="font-heading font-black text-4xl text-brand-navy leading-none">
<span class="count-metric" data-target="142">{{ getTotalKilos() }}</span> <span class="text-xl font-bold text-brand-muted">kg</span>
</div>
<p class="text-[16px] font-bold text-brand-charcoal mt-1">Material reciclado</p>
<p class="text-sm text-brand-muted">~85 kg CO₂ evitados para la cuenca</p>
</div>
</div>
<!-- Métrica 3: Participación -->
<div class="pt-4 md:pt-0 md:px-6 last:pr-0 flex items-center gap-4 group">
<div class="w-14 h-14 rounded-2xl bg-white text-brand-lake flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#CFE4ED] interactive-icon">
<i class="fa-solid fa-award"></i>
</div>
<div>
<div class="font-heading font-black text-4xl text-brand-navy leading-none">
<span class="count-metric" data-target="100">100</span>%
            </div>
<p class="text-[16px] font-bold text-brand-charcoal mt-1">Participación comunitaria</p>
<p class="text-sm text-brand-muted">Vecino destacado del cuadrante</p>
</div>
</div>
</div>
</section>
<!-- 5. RETIRO ESPECIAL & MAPA DE RECORRIDO AMIGABLE (Dos columnas balanceadas con áreas táctiles amplias) -->
<section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch anim-fade-up anim-delay-5">
<!-- CARD: RETIRO ESPECIAL VOLUMINOSOS -->
<div class="bg-white rounded-3xl border border-[#E2E9E4] p-7 sm:p-9 flex flex-col justify-between shadow-xs card-hover">
<div class="space-y-4">
<div class="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-brand-green flex items-center justify-center text-2xl interactive-icon">
<i class="fa-solid fa-couch"></i>
</div>
<div>
<span class="text-xs font-bold uppercase tracking-wider text-brand-green">Servicio a domicilio</span>
<h3 class="font-heading font-extrabold text-2xl text-brand-navy mt-1">¿Necesitas un retiro especial?</h3>
</div>
<p class="text-[16px] text-brand-muted leading-relaxed">
          ¿Tienes aparatos electrónicos, colchones, muebles u otros residuos voluminosos? Coordinamos el retiro directamente con la cuadrilla municipal de Puerto Varas en tu puerta.
        </p>
</div>
<div class="pt-8">
<button (click)="scrollToSolicitud()" type="button" class="btn-action inline-flex items-center justify-center gap-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-base px-7 py-4 rounded-full transition-all shadow-md w-full sm:w-auto text-center cursor-pointer">
<span>Agendar retiro especial</span>
<i class="fa-solid fa-arrow-right text-sm btn-arrow"></i>
</button>
</div>
</div>
<!-- CARD: MAPA DE RECORRIDO COMUNAL AMIGABLE (Diseño visual acogedor, con ruta trazada y camión activo) -->
<div class="bg-white rounded-3xl border border-[#E2E9E4] p-7 sm:p-9 flex flex-col justify-between shadow-xs card-hover">
<div class="space-y-4">
<div class="w-12 h-12 rounded-2xl bg-[#E8F3F7] text-brand-lake flex items-center justify-center text-2xl interactive-icon">
<i class="fa-solid fa-map-location-dot"></i>
</div>
<div>
<span class="text-xs font-bold uppercase tracking-wider text-brand-lake">Mapa barrial interactivo</span>
<h3 class="font-heading font-extrabold text-2xl text-brand-navy mt-1">Mapa de recorrido vecinal</h3>
</div>
<p class="text-[16px] text-brand-muted leading-relaxed">
          Consulta cuándo pasa el camión por tu calle y revisa el cuadrante comunal por días y tipos de materiales en toda la comuna.
        </p>
<!-- REPRESENTACIÓN VECTORIAL ESTILIZADA DE CALLES Y LAGO (Con trazo interactivo y movimiento) -->
<div class="rounded-2xl bg-[#F0F6F9] border-2 border-[#D4E6EF] p-4 relative overflow-hidden">
<div class="flex items-center justify-between gap-2 mb-2">
<div class="flex items-center gap-2">
<i class="fa-solid fa-compass text-brand-lake text-lg"></i>
<span class="font-bold text-sm text-brand-navy">Cuadrante 2: Costanera y Llanquihue Sur</span>
</div>
<span class="text-xs bg-white px-2.5 py-1 rounded-md text-brand-lake font-bold border border-[#CCE1EC] shadow-xs">
              En circulación
            </span>
</div>
<!-- Croquis visual amigable de lago y calles -->
<div class="h-24 w-full bg-white rounded-xl relative p-2 overflow-hidden border border-[#E1EDF2]">
<!-- Lago estilizado arriba a la derecha -->
<div class="absolute -top-3 -right-3 w-32 h-16 bg-[#E1F1F8] rounded-full flex items-center justify-center text-[10px] font-bold text-brand-lake">
              Lago Llanquihue
            </div>
<!-- Trazado de calles base -->
<div class="absolute left-6 top-0 bottom-0 w-3 bg-slate-100"></div>
<div class="absolute left-0 right-0 top-12 h-3 bg-slate-100"></div>
<!-- Ruta vectorial trazada con stroke animado -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" fill="none">
<path class="route-path-animated" d="M 30 0 L 30 54 L 320 54" stroke="#4F8A3D" stroke-linecap="round" stroke-width="4"></path>
</svg>
<!-- Camión en el mapa con animación de traslación suave -->
<div class="absolute left-24 top-9 bg-brand-lake text-white w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md anim-truck-route z-10">
<i class="fa-solid fa-truck-fast"></i>
</div>
<!-- Marcador de casa de Matías -->
<div class="absolute left-44 top-7 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-brand-green shadow-xs text-[11px] font-bold text-brand-green z-10">
<i class="fa-solid fa-house-chimney text-[10px]"></i> Tu casa
            </div>
</div>
</div>
</div>
<div class="pt-6">
<button (click)="showRutaModal = true" type="button" class="btn-action inline-flex items-center justify-start gap-2.5 text-brand-lake hover:text-brand-navy font-bold text-base transition-colors py-2 cursor-pointer">
<span>Ver mi recorrido comunal completo</span>
<i class="fa-solid fa-arrow-right text-sm btn-arrow"></i>
</button>
</div>
</div>
</section>
<!-- 6. HISTORIAL DE RETIROS VECINALES - ESPACIOSO Y FÁCIL DE LEER -->
<section class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs card-hover anim-fade-up anim-delay-5">
<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-4 border-b border-[#EAEFE8] gap-2">
<div>
<h3 class="font-heading font-extrabold text-2xl text-brand-navy">Mis retiros anteriores</h3>
<p class="text-base text-brand-muted">Historial transparente de aportes reciclables en tu domicilio</p>
</div>
<button (click)="showHistorialModal = true" type="button" class="btn-action text-sm font-bold text-brand-lake hover:text-brand-navy flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer">
<span>Ver todos los retiros</span>
<i class="fa-solid fa-chevron-right text-xs btn-arrow"></i>
</button>
</div>
<!-- LISTA EDITORIAL ESPACIOSA Y CLARA -->
<div class="divide-y divide-[#EEF3EF]">
  <!-- Repetir por cada pickup -->
  <div *ngFor="let pickup of pickups" class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAF8] px-3 rounded-2xl transition-all duration-200 group">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-brand-green flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
        <i class="fa-solid fa-recycle"></i>
      </div>
      <div>
        <div class="flex items-center gap-3">
          <span class="font-heading font-bold text-lg sm:text-xl text-brand-navy">{{ pickup.fechaTexto || 'Fecha' }}</span>
          <span class="text-sm font-bold text-brand-green px-2.5 py-0.5 rounded-full bg-[#EBF5E7]">{{ pickup.residuoNombre }}</span>
        </div>
        <p class="text-sm sm:text-base text-brand-muted mt-0.5">
          {{ pickup.direccion }} • <strong class="text-brand-charcoal font-semibold">{{ pickup.estado === 'completado' ? (pickup.kilosRecolectados + ' kg') : 'Pendiente' }}</strong>
        </p>
      </div>
    </div>
    <div class="self-start sm:self-center">
      <span *ngIf="pickup.estado === 'completado'" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-[#EAF5E6] text-brand-green border border-[#CDE9C6] transition-colors group-hover:bg-[#dff0db]">
        <i class="fa-solid fa-check text-xs"></i> Retirado con éxito
      </span>
      <span *ngIf="pickup.estado !== 'completado'" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-slate-100 text-slate-600 border border-slate-200 transition-colors group-hover:bg-slate-200">
        <i class="fa-regular fa-clock text-xs"></i> {{ pickup.estado }}
      </span>
    </div>
  </div>
  
  <div *ngIf="pickups.length === 0" class="py-8 text-center text-slate-500 font-medium">
    No tienes retiros registrados aún.
  </div>
</div>
<!-- MENSAJE DE CIERRE EDITORIAL -->
<div class="mt-6 pt-5 border-t border-[#EEF3EF] text-center">
<span class="font-handwriting text-2xl text-brand-navy font-bold">
        Cada acción cuenta para cuidar nuestro lago 🍃
      </span>
</div>
</section>


    
    <!-- 7. FORMULARIO VECINAL: SOLICITAR RETIRO EN DOMICILIO -->
    <section id="solicitud-retiro" class='bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs card-hover anim-fade-up anim-delay-5 mt-8'>
      <div class='flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#EAEFE8] gap-2'>
        <div>
          <h3 class='font-heading font-extrabold text-2xl sm:text-3xl text-[#123F5B]'>
            Solicitar retiro en tu domicilio
          </h3>
          <p class='text-base text-[#61717A] mt-1'>
            Completa el formulario y el equipo municipal programará la recolección.
          </p>
        </div>
      </div>

      <!-- Formulario interactivo con feedback claro -->
      <form (ngSubmit)='onSubmit()' class='space-y-6'>
        
        <!-- Mensajes de estado -->
        <div *ngIf='submitStatus === "success"' class='bg-[#EEF5EB] border border-[#CDE5C8] text-[#3B6E2C] px-4 py-3 rounded-2xl flex items-center gap-3 mb-6'>
          <i class='fa-solid fa-circle-check text-xl'></i>
          <div>
            <span class='block font-bold text-sm'>¡Solicitud recibida con éxito!</span>
            <span class='text-xs'>Hemos registrado tu solicitud para el próximo recorrido municipal.</span>
          </div>
        </div>
        
        <div *ngIf='submitStatus === "error"' class='bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-center gap-3 mb-6'>
          <i class='fa-solid fa-circle-exclamation text-xl'></i>
          <div>
            <span class='block font-bold text-sm'>Error al solicitar</span>
            <span class='text-xs'>Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo más tarde.</span>
          </div>
        </div>

        <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div class='space-y-2'>
            <label class='block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1' for='direccion'>Dirección exacta</label>
            <div class='relative'>
              <div class='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10'>
                <i class='fa-solid fa-location-dot text-[#61717A] text-sm'></i>
              </div>
              <input [(ngModel)]='newPickup.direccion' class='input-stitch has-icon !pl-11 pr-4' id='direccion' name='direccion' placeholder='Ej: Calle Los Guindos 450, Puerto Varas' required type='text' />
            </div>
          </div>
          <div class='space-y-2'>
            <label class='block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1' for='residuoNombre'>Material a reciclar</label>
            <div class='relative'>
              <div class='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10'>
                <i class='fa-solid fa-recycle text-[#61717A] text-sm'></i>
              </div>
              <select [(ngModel)]='newPickup.residuoNombre' class='select-stitch has-icon !pl-11 !pr-10 appearance-none' id='residuoNombre' name='residuoNombre' required>
                <option value=''>Selecciona el tipo de material principal</option>
                <option *ngFor='let res of residuos' [value]='res.nombre'>{{ res.nombre }}</option>
              </select>
              <div class='absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10'>
                <i class='fa-solid fa-chevron-down text-[#61717A] text-xs'></i>
              </div>
            </div>
          </div>
        </div>

        <div class='space-y-2'>
          <label class='block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1' for='comentarios'>Comentarios adicionales (opcional)</label>
          <div class='relative'>
            <textarea [(ngModel)]='newPickup.comentarios' class='input-stitch min-h-[100px] resize-y pt-3' id='comentarios' name='comentarios' placeholder='Instrucciones para llegar, cantidad aproximada, etc.'></textarea>
          </div>
        </div>

        <div class='pt-2 flex justify-end'>
          <button [disabled]='isSubmitting' class='btn-stitch-primary w-full md:w-auto px-8 py-3.5 text-base shadow-sm' type='submit'>
            <span *ngIf='!isSubmitting'>Agendar retiro municipal</span>
            <span *ngIf='isSubmitting' class='flex items-center gap-2'>
              <i class='fa-solid fa-circle-notch fa-spin'></i> Procesando...
            </span>
          </button>
        </div>
      </form>
    </section>

    <!-- ==================== MODAL 1: RECORRIDO COMUNAL Y CUADRANTES ==================== -->
    <div *ngIf="showRutaModal"
         (click)="showRutaModal = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <!-- Franja superior con gradiente comunal -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Plan Comunal DIMAO • Puerto Varas
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Recorrido y Cuadrantes
              </h3>
            </div>
          </div>
          <button (click)="showRutaModal = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs sm:text-sm text-slate-600">
            El servicio municipal cubre la cuenca urbana y rural dividida en 4 cuadrantes. Los camiones cuentan con pesaje digital y registro continuo de trazabilidad.
          </p>

          <div class="space-y-3 pt-1">
            <!-- Cuadrante 1 -->
            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#CBDCD1] transition-colors flex items-start gap-3.5">
              <span class="px-2.5 py-1 rounded-lg bg-[#123F5B] text-white text-xs font-bold mt-0.5 tracking-wide flex-shrink-0">Lunes</span>
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-sm text-[#123F5B]">Cuadrante 1: Puerto Chico y Llanquihue Norte</h4>
                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Vidrio y Cartón</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-medium text-slate-600">08:00 – 17:00 hrs</span>
                </p>
              </div>
            </div>

            <!-- Cuadrante 2 (Tu Sector) -->
            <div class="p-4 rounded-2xl bg-[#EEF5EB] border-2 border-[#4F8A3D]/40 flex items-start gap-3.5 relative overflow-hidden shadow-xs">
              <span class="px-2.5 py-1 rounded-lg bg-[#4F8A3D] text-white text-xs font-bold mt-0.5 tracking-wide flex-shrink-0">Martes</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-bold text-sm text-[#123F5B]">Cuadrante 2: Costanera Sur y Nueva Braunau</h4>
                  <span class="px-2 py-0.5 rounded-full bg-[#4F8A3D] text-white text-[10px] font-extrabold uppercase tracking-wider">Tu Sector</span>
                </div>
                <p class="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Vidrio, Plásticos y Latas</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-medium text-slate-700">08:00 – 17:00 hrs</span>
                </p>
              </div>
            </div>

            <!-- Cuadrante 3 -->
            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#CBDCD1] transition-colors flex items-start gap-3.5">
              <span class="px-2.5 py-1 rounded-lg bg-[#123F5B] text-white text-xs font-bold mt-0.5 tracking-wide flex-shrink-0">Miércoles</span>
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-sm text-[#123F5B]">Cuadrante 3: Sector Centro, Estación y Colón</h4>
                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Cartón, Papel y Plásticos</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-medium text-slate-600">08:00 – 17:00 hrs</span>
                </p>
              </div>
            </div>

            <!-- Cuadrante 4 -->
            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#CBDCD1] transition-colors flex items-start gap-3.5">
              <span class="px-2.5 py-1 rounded-lg bg-[#123F5B] text-white text-xs font-bold mt-0.5 tracking-wide flex-shrink-0">Jueves</span>
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-sm text-[#123F5B]">Cuadrante 4: Ensenada, Ralún y Camino a Petrohué</h4>
                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Todas las fracciones clasificadas</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-medium text-slate-600">09:00 – 16:00 hrs</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Nota de recordatorio -->
          <div class="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-[#123F5B]">
            <i class="fa-solid fa-clock text-sky-600 mt-0.5 flex-shrink-0"></i>
            <span>Recuerda dejar tus bolsas o contenedores en la entrada de tu domicilio antes de las <strong>08:30 hrs</strong> del día asignado.</span>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span class="hidden sm:inline">DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="showRutaModal = false"
                  type="button"
                  class="bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Entendido, gracias
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL 2: HISTORIAL COMPLETO DE RETIROS ==================== -->
    <div *ngIf="showHistorialModal"
         (click)="showHistorialModal = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <!-- Franja superior con gradiente comunal -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Trazabilidad Vecinal • Puerto Varas
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Historial Completo de Retiros
              </h3>
            </div>
          </div>
          <button (click)="showHistorialModal = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-5">
          <!-- Tarjeta resumen acumulado -->
          <div class="bg-[#F8FAF7] rounded-2xl p-4 sm:p-5 border border-[#E2E9E4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span class="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Total reciclado acumulado</span>
              <p class="font-heading font-black text-2xl sm:text-3xl text-[#123F5B] mt-0.5">
                {{ getTotalKilos() }} <span class="text-base font-semibold text-slate-500">kg certificados</span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1.5 rounded-full bg-[#EEF5EB] text-[#4F8A3D] text-xs font-bold border border-[#D5E6D2] flex items-center gap-1.5">
                <i class="fa-solid fa-shield-halved text-[11px]"></i> Cuenca Protegida
              </span>
            </div>
          </div>

          <!-- Lista de retiros -->
          <div class="divide-y divide-[#E2E9E4] border border-[#E2E9E4] rounded-2xl overflow-hidden bg-white">
            <div *ngFor="let p of pickups" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAF7] transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 text-[#123F5B] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <i class="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm text-[#123F5B]">{{ p.fechaTexto || 'Fecha por confirmar' }}</span>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      {{ p.residuoNombre }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-[11px] text-slate-400"></i>
                    <span>{{ p.direccion }}</span>
                  </p>
                </div>
              </div>
              <div class="sm:text-right flex items-center sm:flex-col sm:items-end justify-between gap-1 pl-12 sm:pl-0">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                      [ngClass]="p.estado === 'completado' ? 'bg-[#EEF5EB] text-[#4F8A3D] border border-[#D5E6D2]' : 'bg-amber-50 text-amber-700 border border-amber-200'">
                  <i [class]="p.estado === 'completado' ? 'fa-solid fa-check text-[10px]' : 'fa-solid fa-hourglass-half text-[10px]'"></i>
                  {{ p.estado === 'completado' ? (p.kilosRecolectados + ' kg pesados') : 'Pendiente' }}
                </span>
                <span *ngIf="p.comentarios" class="text-[11px] text-slate-400 italic max-w-xs truncate">
                  "{{ p.comentarios }}"
                </span>
              </div>
            </div>

            <!-- Estado vacío -->
            <div *ngIf="pickups.length === 0" class="py-12 px-4 text-center">
              <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-3">
                <i class="fa-solid fa-calendar-xmark"></i>
              </div>
              <p class="font-semibold text-slate-700 text-sm">Aún no registras retiros de reciclaje</p>
              <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Agenda un retiro especial arriba o espera el día correspondiente a tu cuadrante.
              </p>
            </div>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span class="hidden sm:inline">DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="showHistorialModal = false"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>

  </main>
`
})
export class DashboardComponent implements OnInit {
  userName = '';
  userRoles: string[] = [];

  residuos: any[] = [];
  pickups: any[] = [];
  proximoRetiro: any = null;

  isLoadingData = true;
  isLoadingResiduos = true;
  isLoadingPickups = true;

  showRutaModal = false;
  showHistorialModal = false;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showRutaModal = false;
    this.showHistorialModal = false;
  }

  newPickup = {
    direccion: '',
    residuoNombre: '',
    comentarios: ''
  };

  isSubmitting = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';

  constructor(
    private bffService: BffService,
    private authService: MsalService
  ) {}

  ngOnInit(): void {
    const account = this.authService.instance.getActiveAccount();
    if (account) {
      this.userName = account.name || account.username || '';
      if (account.idTokenClaims && account.idTokenClaims.roles) {
        this.userRoles = account.idTokenClaims.roles;
      }
    }

    this.loadResiduos();
    this.loadPickups();
  }

  checkLoadingStatus(): void {
    if (!this.isLoadingResiduos && !this.isLoadingPickups) {
      setTimeout(() => {
        this.isLoadingData = false;
      }, 400);
    }
  }

  scrollToSolicitud(): void {
    document.getElementById('solicitud-retiro')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Catálogo y retiros de demostración municipal (resiliencia cuando el BFF :8080 está apagado)
  private readonly defaultPickups: any[] = [
    {
      id: 1,
      fecha: '2026-09-02',
      fechaTexto: 'Miércoles 02 Septiembre',
      residuoNombre: 'Vidrio',
      kilosRecolectados: 14.2,
      direccion: 'Calle Los Guindos 450, Puerto Varas',
      estado: 'completado',
      comentarios: 'Botellas limpias en caja plástica'
    },
    {
      id: 2,
      fecha: '2026-08-26',
      fechaTexto: 'Miércoles 26 Agosto',
      residuoNombre: 'Cartón y Papel',
      kilosRecolectados: 8.5,
      direccion: 'Calle Los Guindos 450, Puerto Varas',
      estado: 'completado',
      comentarios: 'Cajas aplanadas y atadas'
    },
    {
      id: 3,
      fecha: '2026-08-19',
      fechaTexto: 'Miércoles 19 Agosto',
      residuoNombre: 'Plásticos (PET)',
      kilosRecolectados: 5.0,
      direccion: 'Calle Los Guindos 450, Puerto Varas',
      estado: 'completado',
      comentarios: 'Bidones y botellas aplastadas'
    }
  ];

  private readonly defaultResiduos: any[] = [
    { id: 1, nombre: 'Vidrio', descripcion: 'Botellas y frascos limpios', categoria: 'VIDRIO' },
    { id: 2, nombre: 'Cartón y Papel', descripcion: 'Cajas secas y aplanadas', categoria: 'CARTON' },
    { id: 3, nombre: 'Plásticos (PET 1 / PEAD 2)', descripcion: 'Envases aplastados', categoria: 'PLASTICO' },
    { id: 4, nombre: 'Latas y Metales', descripcion: 'Aluminio y hojalata limpia', categoria: 'METAL' }
  ];

  loadResiduos(): void {
    this.isLoadingResiduos = true;
    this.bffService.getResiduos().subscribe({
      next: (data) => {
        this.residuos = (data && data.length > 0) ? data : this.defaultResiduos;
        this.isLoadingResiduos = false;
        this.checkLoadingStatus();
      },
      error: (err) => {
        console.warn('BFF :8080 no disponible. Usando catálogo local de demostración:', err.message || err.statusText);
        this.residuos = this.defaultResiduos;
        this.isLoadingResiduos = false;
        this.checkLoadingStatus();
      }
    });
  }

  loadPickups(): void {
    this.isLoadingPickups = true;
    this.bffService.getPickups().subscribe({
      next: (data) => {
        this.pickups = (data && data.length > 0) ? data : this.defaultPickups;
        if (this.pickups.length > 0) {
          this.proximoRetiro = this.pickups.find(p => p.estado !== 'completado') || this.pickups[0];
        }
        this.isLoadingPickups = false;
        this.checkLoadingStatus();
      },
      error: (err) => {
        console.warn('BFF :8080 no disponible. Usando retiros locales de demostración:', err.message || err.statusText);
        this.pickups = [...this.defaultPickups];
        this.proximoRetiro = this.pickups[0];
        this.isLoadingPickups = false;
        this.checkLoadingStatus();
      }
    });
  }

  onSubmit(): void {
    if (!this.newPickup.direccion || !this.newPickup.residuoNombre) {
      return;
    }
    this.isSubmitting = true;
    this.submitStatus = 'idle';

    this.bffService.createPickup(this.newPickup).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitStatus = 'success';
        this.newPickup = { direccion: '', residuoNombre: '', comentarios: '' };
        this.loadPickups();
        setTimeout(() => this.submitStatus = 'idle', 5000);
      },
      error: (err) => {
        // Modo resiliente: Si el microservicio BFF en :8080 no está encendido (status 0 / connection refused),
        // simulamos el registro exitoso localmente para permitir pruebas fluidas del UI.
        if (err.status === 0) {
          console.warn('BFF :8080 apagado. Registrando solicitud en modo demostración local.');
          const nuevo = {
            id: Date.now(),
            fecha: new Date().toISOString().split('T')[0],
            fechaTexto: 'Programado para próximo recorrido',
            residuoNombre: this.newPickup.residuoNombre,
            kilosRecolectados: 0,
            direccion: this.newPickup.direccion,
            estado: 'pendiente',
            comentarios: this.newPickup.comentarios
          };
          this.pickups.unshift(nuevo);
          this.proximoRetiro = nuevo;
          this.isSubmitting = false;
          this.submitStatus = 'success';
          this.newPickup = { direccion: '', residuoNombre: '', comentarios: '' };
          setTimeout(() => this.submitStatus = 'idle', 5000);
          return;
        }

        console.error('Error creating pickup', err);
        this.isSubmitting = false;
        this.submitStatus = 'error';
        setTimeout(() => this.submitStatus = 'idle', 5000);
      }
    });
  }

  getTotalKilos(): number {
    return this.pickups
      .filter(p => p.estado === 'completado' && p.kilosRecolectados)
      .reduce((sum, p) => sum + p.kilosRecolectados, 0);
  }
}
