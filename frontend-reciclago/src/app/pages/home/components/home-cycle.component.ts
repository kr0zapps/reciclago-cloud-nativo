import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  stage: string;
  title: string;
  description: string;
  detail: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-16 sm:py-24 bg-[#F8FAF7] border-b border-[#E2E8F0] relative overflow-hidden" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección: Sin eyebrows genéricos ni muletillas -->
        <div class="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123F5B] tracking-tight font-heading">
            El ciclo de vida del retiro
          </h2>
          <p class="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
            De tu puerta a la valorización: un proceso 100% trazable, coordinado entre los vecinos de Puerto Varas y la DIMAO bajo normativa Ley REP.
          </p>
        </div>

        <!-- Línea de Tiempo Conectada e Interconectada -->
        <div class="relative">
          
          <!-- Guía conectora horizontal continua (visible en desktop) -->
          <div class="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gray-200 -z-0"></div>

          <!-- Cuadrícula de Pasos -->
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6 relative z-10">
            <div *ngFor="let step of steps"
                 class="flex flex-col group">
              
              <!-- Nodo Milenario: Círculo con Ícono y Número -->
              <div class="flex items-center gap-3 lg:flex-col lg:items-start mb-4">
                <div class="w-14 h-14 rounded-2xl bg-white border-2 border-[#123F5B] text-[#123F5B] group-hover:border-[#22a652] group-hover:text-[#22a652] group-hover:bg-[#ecf7e6] flex items-center justify-center text-lg shadow-2xs transition-all duration-300 flex-shrink-0">
                  <i [class]="step.iconClass"></i>
                </div>
                <div>
                  <span class="text-xs font-black tracking-widest text-[#22a652] uppercase block">
                    Paso 0{{ step.stepNumber }}
                  </span>
                  <span class="text-xs font-bold text-gray-400 block lg:hidden">
                    {{ step.stage }}
                  </span>
                </div>
              </div>

              <!-- Tarjeta de Contenido con Jerarquía Real -->
              <div class="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs group-hover:border-[#22a652]/40 group-hover:shadow-md transition-all duration-300 flex-1 flex flex-col justify-between">
                <div>
                  <span class="hidden lg:block text-[11px] font-bold text-gray-400 mb-1 tracking-wide">
                    {{ step.stage }}
                  </span>
                  <h3 class="font-extrabold text-[#123F5B] text-base font-heading mb-2 leading-snug">
                    {{ step.title }}
                  </h3>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    {{ step.description }}
                  </p>
                </div>

                <!-- Detalle Operativo Real (en lugar de 'Garantizado' copiado 5 veces) -->
                <div class="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                  <i class="fa-solid fa-check text-[#22a652] text-[10px]"></i>
                  <span class="truncate">{{ step.detail }}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Nota Cívica Institucional al Pie -->
        <div class="mt-12 text-center">
          <p class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-xs text-gray-500 font-medium shadow-2xs">
            <i class="fa-solid fa-shield-halved text-[#22a652]"></i>
            <span>Trazabilidad auditada e integrada con el catálogo de rutas oficial de Puerto Varas</span>
          </p>
        </div>

      </div>
    </section>
    <!-- END: HowItWorks -->
  `
})
export class HomeCycleComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  isVisible = false;

  steps: CycleStep[] = [
    {
      stepNumber: 1,
      stage: 'Desde tu hogar',
      title: 'Solicitud del retiro',
      description: 'Pides el retiro con tu dirección y los materiales clasificados desde el portal vecinal o llamando directamente al municipio.',
      detail: 'Portal web o teléfono DIMAO',
      iconClass: 'fa-solid fa-clipboard-list'
    },
    {
      stepNumber: 2,
      stage: 'Organización comunal',
      title: 'Planificación y cuadrilla',
      description: 'El equipo de DIMAO programa el recorrido semanal de la cuadrilla y chofer según el cuadrante oficial.',
      detail: 'Cuadrante y fecha asignada',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      stage: 'En tiempo real',
      title: 'Camión en camino',
      description: 'El camión recolector inicia el recorrido y puedes seguir su aproximación satelital por GPS desde tu teléfono.',
      detail: 'Monitoreo GPS en vivo',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      stage: 'Puerta a puerta',
      title: 'Recolección en tu frontis',
      description: 'La cuadrilla municipal recoge tus residuos limpios y secos directamente en el frontis de tu domicilio.',
      detail: 'Retiro domiciliario gratuito',
      iconClass: 'fa-solid fa-house-circle-check'
    },
    {
      stepNumber: 5,
      stage: 'Certificación oficial',
      title: 'Pesaje y Ley REP',
      description: 'Se pesan los materiales in situ en la báscula digital calibrada y se computa el certificado oficial de valorización.',
      detail: 'Comprobante digital emitido',
      iconClass: 'fa-solid fa-scale-balanced'
    }
  ];

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

