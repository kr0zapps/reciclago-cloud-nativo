import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EstadoRetiro {
  id: string;
  paso: number;
  nombre: string;
  rol: string;
  estado: 'completado' | 'en_curso' | 'pendiente';
  timestamp?: string;
  detalleTecnico?: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- SECCIÓN: Ciclo de Vida del Retiro (Timeline Continuo y Asimétrico) -->
    <section class="py-20 sm:py-24 bg-niebla-100 border-b border-niebla-200" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado Editorial Sin Badges Cliché -->
        <div class="max-w-2xl mb-14">
          <p class="font-mono text-xs text-pizarra-600 tracking-wider mb-2">
            PROTOCOLO DIMAO · LEY 20.920
          </p>
          <h2 class="text-3xl sm:text-5xl font-extrabold text-bosque-950 tracking-tight font-heading leading-tight mb-3">
            El ciclo de vida del retiro
          </h2>
          <p class="text-sm sm:text-base text-pizarra-600 font-sans leading-relaxed">
            Cadena de custodia continua desde la solicitud vecinal hasta la báscula y emisión del certificado oficial de valorización.
          </p>
        </div>

        <!-- TIMELINE CONTINUO DESKTOP (lg:block) -->
        <div class="hidden lg:block relative mb-8">
          
          <!-- Línea conectora base -->
          <div class="absolute top-7 left-8 right-8 h-0.5 bg-niebla-200 -z-0">
            <div class="h-full bg-bosque-700 w-3/5 transition-all duration-1000"></div>
          </div>

          <!-- Grilla Asimétrica: 2 pasos compactos + 1 Activo Dominante + 1 Pendiente + 1 Ticket de Báscula -->
          <div class="grid grid-cols-12 gap-5 items-start relative z-10">
            
            <!-- Paso 1: Solicitado (Completado) -->
            <div class="col-span-2 pt-2">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-10 h-10 rounded-full bg-bosque-700 text-niebla-50 font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  <i class="fa-solid fa-check text-[11px]"></i>
                </span>
                <span class="font-mono text-[11px] text-pizarra-600 tabular-nums">08:12 hrs</span>
              </div>
              <h3 class="font-heading font-bold text-sm text-bosque-950 mb-0.5">1. Solicitud Vecinal</h3>
              <p class="text-xs text-pizarra-600 leading-snug">
                Georreferenciada en plataforma municipal.
              </p>
              <div class="mt-2 text-[10px] font-mono text-pizarra-400">ID: REQ-8821</div>
            </div>

            <!-- Paso 2: Programado (Completado) -->
            <div class="col-span-2 pt-2">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-10 h-10 rounded-full bg-bosque-700 text-niebla-50 font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  <i class="fa-solid fa-check text-[11px]"></i>
                </span>
                <span class="font-mono text-[11px] text-pizarra-600 tabular-nums">08:35 hrs</span>
              </div>
              <h3 class="font-heading font-bold text-sm text-bosque-950 mb-0.5">2. Asignación Cuadrante</h3>
              <p class="text-xs text-pizarra-600 leading-snug">
                Cuadrante 1 · Puerto Chico.
              </p>
              <div class="mt-2 text-[10px] font-mono text-pizarra-400">Ruta VRP DIMAO</div>
            </div>

            <!-- Paso 3: EN RUTA (ACTIVO DOMINANTE - PROTAGONISMO ESPACIAL) -->
            <div class="col-span-4 bg-bosque-950 text-niebla-100 rounded-2xl p-6 shadow-xl border border-bosque-800 relative -top-3">
              <!-- Indicador vivo sin parpadeos banales -->
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-bosque-800">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-lago-400"></span>
                  <span class="font-mono text-[11px] text-lago-400 font-semibold tracking-wider uppercase">
                    3. En Ruta · Telemetría en Vivo
                  </span>
                </div>
                <span class="font-mono text-xs text-niebla-200 tabular-nums">GPS Activo</span>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between items-baseline">
                  <span class="font-heading text-lg font-bold text-white">Camión Municipal DIMAO-02</span>
                  <span class="font-mono text-xs text-madera-400">ETA: ~14 min</span>
                </div>
                <p class="text-xs text-pizarra-400 leading-relaxed font-sans">
                  Cuadrilla en tránsito hacia Calle Vicente Pérez Rosales. Tolva compartimentada para Vidrio.
                </p>
              </div>

              <!-- Telemetría técnica -->
              <div class="grid grid-cols-2 gap-2 pt-3 border-t border-bosque-900 font-mono text-[11px]">
                <div>
                  <span class="text-pizarra-400 block text-[9px] uppercase">Coordenadas</span>
                  <span class="text-white tabular-nums">-41.3195, -72.9854</span>
                </div>
                <div>
                  <span class="text-pizarra-400 block text-[9px] uppercase">Capacidad Tolva</span>
                  <span class="text-lago-400 tabular-nums">48% ocupada</span>
                </div>
              </div>
            </div>

            <!-- Paso 4: Retirado (Pendiente inmediato) -->
            <div class="col-span-2 pt-2 opacity-85">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-10 h-10 rounded-full bg-niebla-200 border border-niebla-300 text-pizarra-600 font-mono text-xs font-bold flex items-center justify-center">
                  04
                </span>
                <span class="font-mono text-[11px] text-pizarra-400">Próximo</span>
              </div>
              <h3 class="font-heading font-bold text-sm text-bosque-950 mb-0.5">4. Retiro Frontis</h3>
              <p class="text-xs text-pizarra-600 leading-snug">
                Inspección de pureza y carga selectiva en domicilio.
              </p>
            </div>

            <!-- Paso 5: PESADO Y CERTIFICADO (TICKET DE BÁSCULA CON FOLIO) -->
            <div class="col-span-2 bg-niebla-50 border border-dashed border-pizarra-400 rounded-xl p-4 relative shadow-2xs">
              <div class="flex items-center justify-between pb-2 mb-2 border-b border-niebla-200 font-mono text-[10px] text-pizarra-600">
                <span>CERTIFICADO REP</span>
                <span class="text-madera-500 font-bold">#PV-9042</span>
              </div>
              <div class="mb-2">
                <span class="font-mono text-[9px] text-pizarra-400 block uppercase">5. Pesaje Báscula</span>
                <span class="font-heading font-black text-xl text-bosque-950 tabular-nums">14.8 kg</span>
              </div>
              <p class="text-[11px] text-pizarra-600 leading-tight">
                Emisión digital con trazabilidad a planta de reciclaje regional.
              </p>
              <div class="mt-2.5 pt-2 border-t border-niebla-200 flex items-center justify-between text-[9px] font-mono text-madera-600">
                <span>BÁSCULA INN</span>
                <span class="font-bold">VERIFICADO</span>
              </div>
            </div>

          </div>
        </div>

        <!-- TIMELINE VERTICAL MOBILE (lg:hidden) -->
        <div class="lg:hidden space-y-6 relative border-l-2 border-bosque-700/30 ml-4 pl-6">
          
          <!-- Paso 1 -->
          <div class="relative">
            <span class="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-bosque-700 text-white flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-check"></i>
            </span>
            <div class="flex items-baseline gap-2 mb-1">
              <h3 class="font-heading font-bold text-sm text-bosque-950">1. Solicitud Vecinal</h3>
              <span class="font-mono text-[10px] text-pizarra-600">08:12 hrs</span>
            </div>
            <p class="text-xs text-pizarra-600">Ingresada y validada en plataforma municipal.</p>
          </div>

          <!-- Paso 2 -->
          <div class="relative">
            <span class="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-bosque-700 text-white flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-check"></i>
            </span>
            <div class="flex items-baseline gap-2 mb-1">
              <h3 class="font-heading font-bold text-sm text-bosque-950">2. Asignación Cuadrante</h3>
              <span class="font-mono text-[10px] text-pizarra-600">08:35 hrs</span>
            </div>
            <p class="text-xs text-pizarra-600">Cuadrante 1 · Puerto Chico.</p>
          </div>

          <!-- Paso 3: Activo Móvil -->
          <div class="relative bg-bosque-950 text-white p-5 rounded-xl border border-bosque-800 shadow-md -ml-2">
            <span class="absolute -left-[27px] top-4 w-6 h-6 rounded-full bg-lago-400 text-bosque-950 font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-[10px] text-lago-400 uppercase tracking-wider font-semibold">En Ruta Activa</span>
              <span class="font-mono text-xs text-madera-400">ETA ~14 min</span>
            </div>
            <h3 class="font-heading font-bold text-base mb-1">Camión Municipal DIMAO-02</h3>
            <p class="text-xs text-pizarra-400 mb-3">En trayecto por Costanera. Material: Vidrio.</p>
            <div class="text-[10px] font-mono text-pizarra-400 pt-2 border-t border-bosque-900 flex justify-between">
              <span>GPS: -41.3195, -72.9854</span>
              <span>Tolva: 48%</span>
            </div>
          </div>

          <!-- Paso 4 -->
          <div class="relative opacity-80">
            <span class="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-niebla-200 border border-niebla-300 text-pizarra-600 flex items-center justify-center text-[10px]">
              4
            </span>
            <h3 class="font-heading font-bold text-sm text-bosque-950">4. Retiro Frontis</h3>
            <p class="text-xs text-pizarra-600">Inspección de pureza y carga selectiva en domicilio.</p>
          </div>

          <!-- Paso 5: Ticket Móvil -->
          <div class="relative bg-niebla-50 border border-dashed border-pizarra-400 p-4 rounded-xl -ml-2">
            <div class="flex justify-between items-center text-[10px] font-mono text-pizarra-600 mb-1">
              <span>CERTIFICADO DIGITAL BÁSCULA</span>
              <span class="text-madera-500 font-bold">#PV-9042</span>
            </div>
            <span class="font-heading font-black text-xl text-bosque-950">14.8 kg Certificados</span>
            <p class="text-xs text-pizarra-600 mt-1">Pesaje electrónico calibrado INN.</p>
          </div>

        </div>

      </div>
    </section>
  `
})
export class HomeCycleComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  isVisible = false;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.15 });

      this.observer.observe(this.elementRef.nativeElement);
    } else {
      this.isVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
