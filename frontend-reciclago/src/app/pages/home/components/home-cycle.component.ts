import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  role: string;
  description: string;
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
        
        <!-- Encabezado de Sección -->
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span class="text-xs font-black uppercase tracking-widest text-[#22a652] block mb-2 font-heading">
            Trazabilidad Paso a Paso
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123F5B] tracking-tight font-heading">
            El ciclo de vida del retiro
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
            Un proceso certificado y transparente, desde tu solicitud hasta el pesaje digital in situ.
          </p>
        </div>

        <!-- Grid de Pasos Modernos (5 cards ejecutivas) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          <div *ngFor="let step of steps"
               class="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs hover:border-[#22a652] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-[#F8FAF7] text-[#123F5B] border border-[#E2E8F0] group-hover:bg-[#ecf7e6] group-hover:text-[#22a652] group-hover:border-[#22a652]/30 transition-colors">
                  0{{ step.stepNumber }}
                </span>
                <div class="w-9 h-9 rounded-xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform">
                  <i [class]="step.iconClass"></i>
                </div>
              </div>

              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                {{ step.role }}
              </span>
              <h3 class="font-extrabold text-[#123F5B] text-base font-heading mb-2">
                {{ step.title }}
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ step.description }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#22a652]">
              <i class="fa-solid fa-check text-[10px]"></i>
              <span>Garantizado</span>
            </div>
          </div>
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
      title: 'Solicitas',
      role: 'Vecino',
      description: 'Agenda tu retiro desde el portal vecinal o llamando directamente al 65 236 1200.',
      iconClass: 'fa-solid fa-file-lines'
    },
    {
      stepNumber: 2,
      title: 'Se programa',
      role: 'Coordinador DIMAO',
      description: 'Se organiza la ruta y el cuadrante según el calendario comunal oficial.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'Camión en ruta',
      role: 'Seguimiento GPS',
      description: 'Puedes ver el recorrido del camión en tiempo real desde tu teléfono.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retiramos',
      role: 'Puerta a puerta',
      description: 'La cuadrilla retira tus residuos clasificados en el frontis domiciliario.',
      iconClass: 'fa-solid fa-house-chimney'
    },
    {
      stepNumber: 5,
      title: 'Pesamos y certificamos',
      role: 'Báscula y CO₂',
      description: 'Se registra el peso exacto in situ y se computa la huella de carbono mitigada.',
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

