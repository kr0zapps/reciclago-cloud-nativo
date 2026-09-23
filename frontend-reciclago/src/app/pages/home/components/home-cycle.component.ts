import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#E7E4DC]" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <!-- Section Tag Gazette -->
        <span class="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] bg-[#FAF0DC] px-3 py-1 rounded border border-[#EADBCA] inline-flex items-center gap-1.5 mb-3 shadow-2xs">
          <i class="fa-solid fa-arrows-spin text-[10px]"></i> Trazabilidad Paso a Paso
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#163828] tracking-tight mb-3 font-serif">
          El Ciclo de Vida del Retiro
        </h2>
        <p class="text-sm sm:text-base text-[#6B726D] max-w-2xl mx-auto mb-12 sm:mb-16 font-sans">
          Un proceso transparente y regulado bajo la Ley REP, desde tu hogar hasta la báscula y certificación digital.
        </p>

        <!-- 5-Step Process Editorial Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 relative text-left">
          <div *ngFor="let step of steps; let isLast = last" 
               class="group bg-white rounded-2xl p-6 border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.03)] hover:border-[#C98A2C] hover:shadow-[0_8px_24px_rgba(22,56,40,0.08)] transition-all duration-300 flex flex-col justify-between">
            
            <div>
              <!-- Top Row: Number + Icon Medallion -->
              <div class="flex items-center justify-between mb-4">
                <span class="font-serif text-2xl sm:text-3xl font-bold text-[#C98A2C]">
                  0{{ step.stepNumber }}
                </span>
                <div class="w-11 h-11 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-[#163828] text-base shadow-2xs group-hover:bg-[#163828] group-hover:text-white transition-colors duration-200">
                  <i [class]="step.iconClass"></i>
                </div>
              </div>

              <!-- Step Title & Actor -->
              <h3 class="font-serif text-lg font-bold text-[#163828] mb-0.5 leading-snug">
                {{ step.title }}
              </h3>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5D19] mb-2.5 block">
                {{ step.subtitle }}
              </span>

              <!-- Description -->
              <p class="font-sans text-xs text-[#6B726D] leading-relaxed">
                {{ step.description }}
              </p>
            </div>

            <!-- Bottom Progress Line Indicating Sequence -->
            <div class="mt-4 pt-3 border-t border-[#E7E4DC] flex items-center justify-between text-[10px] font-mono text-[#6B726D]">
              <span>Etapa {{ step.stepNumber }}/5</span>
              <i *ngIf="!isLast" class="fa-solid fa-arrow-right text-[#C98A2C] text-xs"></i>
              <i *ngIf="isLast" class="fa-solid fa-certificate text-[#22a652] text-xs"></i>
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
      title: 'Solicitado',
      subtitle: 'Vecino',
      description: 'El vecino agenda su retiro desde la web o teléfono municipal.',
      iconClass: 'fa-solid fa-user-check'
    },
    {
      stepNumber: 2,
      title: 'Programado',
      subtitle: 'Coordinador DIMAO',
      description: 'Se organiza la ruta y el cuadrante según el calendario comunal.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'En Ruta',
      subtitle: 'Seguimiento GPS',
      description: 'Puedes ver el recorrido del camión en tiempo real desde tu celular.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retirado',
      subtitle: 'Puerta a puerta',
      description: 'La cuadrilla municipal retira tus residuos en el frontis de tu hogar.',
      iconClass: 'fa-solid fa-house'
    },
    {
      stepNumber: 5,
      title: 'Pesado y Certificado',
      subtitle: 'Báscula y Ley REP',
      description: 'Se registra el peso exacto y se genera tu comprobante oficial de CO₂.',
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

