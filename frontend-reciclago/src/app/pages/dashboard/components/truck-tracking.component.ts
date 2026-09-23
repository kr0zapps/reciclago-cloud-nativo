import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-truck-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-2xs">
      
      <!-- ==================== CASO 1: TIENE SOLICITUDES ACTIVAS ==================== -->
      <div *ngIf="activePickup">
        
        <!-- Barra de Encabezado: Título y Selector de Pedido -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E2E8F0]">
          <div>
            <span class="text-xs font-black uppercase tracking-wider text-[#22a652] block mb-1">
              Rastreo en Vivo DIMAO
            </span>
            <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B]">
              Estado de tu Retiro
            </h3>
          </div>

          <!-- Selector de Solicitud (Si tiene más de una, o para cambiarla fácilmente) -->
          <div *ngIf="userPickups.length > 1" class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-gray-500">Cambiar pedido:</span>
            <select
              [ngModel]="activePickup.id"
              (ngModelChange)="onSelectPickupId($event)"
              class="bg-[#F8FAF7] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#123F5B] focus:outline-none focus:border-[#22a652]">
              <option *ngFor="let p of userPickups" [value]="p.id">
                #{{ p.id }} · {{ p.residuoNombre || 'Reciclaje' }} ({{ p.estado }})
              </option>
            </select>
          </div>
        </div>

        <!-- Tarjeta Informativa del Pedido que se está Rastreando -->
        <div class="p-4 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#22a652] flex items-center justify-center text-lg shadow-2xs flex-shrink-0">
              <i class="fa-solid fa-recycle"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-xs font-black px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#123F5B]">
                  #{{ activePickup.id }}
                </span>
                <span class="font-heading font-black text-sm text-[#123F5B]">
                  {{ activePickup.direccion }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Material: <strong class="text-[#123F5B]">{{ activePickup.residuoNombre || 'Reciclaje Domiciliario' }}</strong>
                <span class="text-gray-300 mx-1.5">•</span>
                Fecha: <strong class="text-[#123F5B]">{{ activePickup.fechaTexto || activePickup.fecha || sector?.dia }}</strong>
              </p>
            </div>
          </div>

          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider self-start sm:self-center"
                [ngClass]="getStatusBadgeClass(activePickup.estado)">
            <i class="fa-solid fa-circle text-[8px]"></i>
            <span>{{ activePickup.estado }}</span>
          </span>
        </div>

        <!-- ==================== BARRA DE PROGRESO ACCESIBLE Y GRANDE ==================== -->
        <div class="py-4 sm:py-6 px-2 sm:px-6">
          <div class="relative flex items-center justify-between">
            <!-- Línea de Fondo -->
            <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 bg-gray-200 rounded-full z-0"></div>
            <!-- Línea de Progreso Activa -->
            <div class="absolute left-6 top-1/2 -translate-y-1/2 h-2 bg-[#22a652] rounded-full z-0 transition-all duration-700" 
                 [style.width]="getProgressBarWidth()"></div>

            <!-- Pasos -->
            <div *ngFor="let step of steps; let i = index" class="relative z-10 flex flex-col items-center group cursor-default">
              <!-- Círculo Grande con Ícono -->
              <div class="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-sm sm:text-base font-black transition-all duration-300 shadow-2xs"
                   [ngClass]="getStepClass(i)">
                <i [class]="step.icon"></i>
              </div>

              <!-- Etiqueta del Paso -->
              <span class="text-xs sm:text-sm font-bold mt-2.5 text-center transition-colors"
                    [ngClass]="getTextClass(i)">
                {{ step.label }}
              </span>
              <span class="text-[10px] text-gray-400 font-medium hidden sm:block text-center mt-0.5">
                {{ step.sublabel }}
              </span>
            </div>
          </div>
        </div>

        <!-- ==================== MENSAJE EXPLICATIVO PARA ABUELOS / CIUDADANOS ==================== -->
        <div class="mt-8 p-4 sm:p-5 rounded-2xl border transition-all"
             [ngClass]="getFeedbackBoxClass()">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                 [ngClass]="getFeedbackIconBoxClass()">
              <i [class]="getFeedbackIcon()"></i>
            </div>
            <div>
              <h4 class="font-heading font-black text-sm sm:text-base" [ngClass]="getFeedbackTitleClass()">
                {{ getFeedbackTitle() }}
              </h4>
              <p class="text-xs sm:text-sm mt-1 leading-relaxed" [ngClass]="getFeedbackTextClass()">
                {{ getFeedbackMessage() }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- ==================== CASO 2: NO TIENE NINGÚN RETIRO SOLICITADO ==================== -->
      <div *ngIf="!activePickup" class="py-8 px-4 text-center">
        <div class="w-16 h-16 rounded-2xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-2xl mx-auto mb-4 shadow-2xs">
          <i class="fa-solid fa-calendar-check"></i>
        </div>

        <h3 class="font-heading font-black text-2xl text-[#123F5B] mb-2">
          No tienes ningún retiro activo para rastrear
        </h3>
        
        <p class="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mb-6 leading-relaxed">
          El camión de reciclaje municipal pasa por tu sector (<strong>{{ sector?.nombre }}</strong>) los días <strong class="text-[#22a652]">{{ sector?.dia }}</strong>. Para que la cuadrilla pase a retirar a la puerta de tu casa y puedas ver el camión en tiempo real, ingresa tu solicitud.
        </p>

        <button
          type="button"
          (click)="requestRetiroClick.emit()"
          class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white font-black text-sm uppercase tracking-wider cursor-pointer shadow-md transition-all">
          <i class="fa-solid fa-circle-plus text-base"></i>
          <span>Pedir Retiro de Reciclaje Ahora</span>
        </button>
      </div>

    </div>
  `
})
export class TruckTrackingComponent {
  @Input() sector!: Sector | null;
  @Input() pickups: Pickup[] = [];
  @Input() userEmail: string = '';
  @Input() isCamionEnRuta: boolean = false;
  @Input() selectedPickup: Pickup | null = null;

  @Output() pickupSelected = new EventEmitter<Pickup>();
  @Output() requestRetiroClick = new EventEmitter<void>();

  steps = [
    { label: '1. Solicitado', state: 'SOLICITADO', icon: 'fa-solid fa-file-lines', sublabel: 'Aviso recibido' },
    { label: '2. Programado', state: 'PROGRAMADO', icon: 'fa-solid fa-calendar-check', sublabel: 'Cuadrilla asignada' },
    { label: '3. En camino', state: 'EN_RUTA', icon: 'fa-solid fa-truck-fast', sublabel: 'Recorriendo sector' },
    { label: '4. Retirado', state: 'RETIRADO', icon: 'fa-solid fa-house-circle-check', sublabel: 'Retirado en puerta' },
    { label: '5. Pesado', state: 'PESADO', icon: 'fa-solid fa-scale-balanced', sublabel: 'Pesaje certificado' }
  ];

  get userPickups(): Pickup[] {
    if (!this.pickups || this.pickups.length === 0) return [];
    if (this.userEmail) {
      const mine = this.pickups.filter(p => p.vecinoEmail && p.vecinoEmail.toLowerCase() === this.userEmail.toLowerCase() && p.estado !== 'CANCELADO');
      if (mine.length > 0) return mine;
    }
    return this.pickups.filter(p => p.estado !== 'CANCELADO');
  }

  get activePickup(): Pickup | null {
    if (this.selectedPickup) return this.selectedPickup;
    if (this.userPickups.length > 0) {
      return this.userPickups.find(p => p.estado === 'EN_RUTA')
        || this.userPickups.find(p => p.estado === 'RETIRADO')
        || this.userPickups.find(p => p.estado === 'PROGRAMADO')
        || this.userPickups.find(p => p.estado === 'SOLICITADO')
        || this.userPickups[0];
    }
    return null;
  }

  onSelectPickupId(id: any): void {
    const found = this.userPickups.find(p => p.id === Number(id));
    if (found) {
      this.pickupSelected.emit(found);
    }
  }

  get effectiveEstado(): string {
    if (this.activePickup && this.activePickup.estado) {
      return this.activePickup.estado.toUpperCase();
    }
    return 'SOLICITADO';
  }

  getCurrentStepIndex(): number {
    return this.steps.findIndex(s => s.state === this.effectiveEstado);
  }

  getProgressBarWidth(): string {
    const index = this.getCurrentStepIndex();
    if (index <= 0) return '0%';
    const pct = (index / (this.steps.length - 1)) * 100;
    return `calc(${pct}% - 2rem)`;
  }

  getStepClass(index: number): string {
    const current = this.getCurrentStepIndex();
    if (index < current) {
      // Completado
      return 'bg-[#22a652] text-white ring-4 ring-[#ecf7e6] border-2 border-[#22a652]';
    } else if (index === current) {
      // En curso / actual
      return 'bg-[#123F5B] text-white ring-4 ring-[#123F5B]/20 border-2 border-[#123F5B] scale-110';
    }
    // Futuro
    return 'bg-white text-gray-400 border-2 border-gray-200';
  }

  getTextClass(index: number): string {
    const current = this.getCurrentStepIndex();
    if (index === current) {
      return 'text-[#123F5B] font-extrabold text-sm scale-105';
    } else if (index < current) {
      return 'text-[#22a652] font-bold';
    }
    return 'text-gray-400 font-medium';
  }

  getStatusBadgeClass(estado?: string): string {
    switch (estado?.toUpperCase()) {
      case 'EN_RUTA': return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'PROGRAMADO': return 'bg-sky-100 text-sky-900 border border-sky-300';
      case 'RETIRADO': return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
      case 'PESADO': return 'bg-purple-100 text-purple-900 border border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  }

  getFeedbackBoxClass(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return 'bg-amber-50/80 border-amber-200 text-amber-950';
      case 'RETIRADO': return 'bg-emerald-50/80 border-emerald-200 text-emerald-950';
      case 'PESADO': return 'bg-purple-50/80 border-purple-200 text-purple-950';
      case 'PROGRAMADO': return 'bg-sky-50/80 border-sky-200 text-sky-950';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  getFeedbackIconBoxClass(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return 'bg-amber-500 text-white';
      case 'RETIRADO': return 'bg-emerald-600 text-white';
      case 'PESADO': return 'bg-purple-600 text-white';
      case 'PROGRAMADO': return 'bg-sky-600 text-white';
      default: return 'bg-[#123F5B] text-white';
    }
  }

  getFeedbackIcon(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return 'fa-solid fa-truck-fast';
      case 'RETIRADO': return 'fa-solid fa-house-circle-check';
      case 'PESADO': return 'fa-solid fa-scale-balanced';
      case 'PROGRAMADO': return 'fa-solid fa-calendar-check';
      default: return 'fa-solid fa-clock';
    }
  }

  getFeedbackTitle(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return '¡El camión va en camino a tu sector!';
      case 'RETIRADO': return 'Tus residuos ya fueron retirados en tu puerta';
      case 'PESADO': return '¡Retiro completado y certificado con éxito!';
      case 'PROGRAMADO': return 'Tu retiro está programado';
      default: return 'Solicitud en revisión municipal';
    }
  }

  getFeedbackTitleClass(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return 'text-amber-900';
      case 'RETIRADO': return 'text-emerald-900';
      case 'PESADO': return 'text-purple-900';
      case 'PROGRAMADO': return 'text-sky-900';
      default: return 'text-[#123F5B]';
    }
  }

  getFeedbackTextClass(): string {
    switch (this.effectiveEstado) {
      case 'EN_RUTA': return 'text-amber-800';
      case 'RETIRADO': return 'text-emerald-800';
      case 'PESADO': return 'text-purple-800';
      case 'PROGRAMADO': return 'text-sky-800';
      default: return 'text-gray-600';
    }
  }

  getFeedbackMessage(): string {
    const camion = this.activePickup?.camionPatente || 'PV-RC-2026';
    const material = this.activePickup?.residuoNombre || 'Reciclaje';
    const fecha = this.activePickup?.fechaTexto || this.sector?.dia || 'esta semana';
    const kilos = this.activePickup?.kilosRecolectados || 0;

    switch (this.effectiveEstado) {
      case 'EN_RUTA':
        return `La cuadrilla municipal se encuentra en recorrido con el camión patente ${camion}. Asegúrate de tener tus bolsas o contenedores de ${material} afuera de tu domicilio.`;
      case 'RETIRADO':
        return `La cuadrilla ya pasó por tu domicilio y recogió tus residuos de ${material}. El camión se dirige al centro de acopio para el pesaje digital oficial.`;
      case 'PESADO':
        return `Se registró un pesaje oficial de ${kilos} kg en la báscula municipal. Tu certificado de reciclaje ha sido emitido bajo la Ley REP. ¡Muchas gracias por cuidar Puerto Varas!`;
      case 'PROGRAMADO':
        return `El retiro fue asignado para el día ${fecha}. Recuerda dejar los residuos limpios y secos en tu frontis antes de las 08:00 hrs de ese día.`;
      default:
        return 'Tu aviso de retiro fue recibido en la plataforma. El coordinador de DIMAO está organizando la cuadrilla y te notificará la fecha oficial de paso.';
    }
  }
}
