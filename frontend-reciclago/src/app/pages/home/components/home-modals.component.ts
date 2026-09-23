import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuadrantCardInfo } from '../data/home-sectors.data';

@Component({
  selector: 'app-home-modals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Detalle de Cuadrante y Preparación de Material (Reactivo al Catálogo) -->
    <div *ngIf="selectedQuadrant"
         (click)="closeQuadrantModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#163828]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E7E4DC] overflow-hidden anim-modal-panel text-[#232826] my-auto">
        <div class="h-2 w-full bg-gradient-to-r from-[#163828] via-[#C98A2C] to-[#22a652]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E7E4DC] flex items-center justify-between bg-[#FAF9F6]">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white border border-[#E7E4DC] flex items-center justify-center text-[#163828] text-xl flex-shrink-0 shadow-2xs">
              <i [class]="selectedQuadrant.iconClass"></i>
            </div>
            <div>
              <span class="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] block">
                Cuadrante {{ selectedQuadrant.cuadranteNumber }} · {{ selectedQuadrant.name }}
              </span>
              <h3 class="font-serif font-bold text-xl sm:text-2xl text-[#163828] leading-tight">
                Preparación: {{ selectedQuadrant.materialNombre }}
              </h3>
            </div>
          </div>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-[#E7E4DC] hover:bg-[#FAF9F6] text-[#6B726D] hover:text-[#163828] flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 space-y-4 text-sm text-[#232826] leading-relaxed font-sans">
          <!-- Horario y Día -->
          <div class="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E7E4DC] flex items-center justify-between text-xs">
            <span class="flex items-center gap-2 font-serif font-bold text-[#163828]">
              <i class="fa-solid fa-calendar-day text-[#C98A2C]"></i> Día: {{ selectedQuadrant.day }}
            </span>
            <span class="font-mono font-medium text-[#6B726D]">
              <i class="fa-regular fa-clock text-[#163828] mr-1"></i>{{ selectedQuadrant.hours }}
            </span>
          </div>

          <!-- Instrucciones directas del Catálogo -->
          <div>
            <h4 class="font-serif font-bold text-sm text-[#163828] mb-1 flex items-center gap-2">
              <i class="fa-solid fa-clipboard-check text-[#22a652]"></i>
              Instrucciones Oficiales DIMAO
            </h4>
            <p class="text-xs sm:text-sm text-[#6B726D] bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E7E4DC] leading-relaxed">
              {{ selectedQuadrant.materialInstrucciones || 'Entregar el material limpio, seco y compactado antes del horario de paso del camión municipal.' }}
            </p>
          </div>

          <!-- Requisitos clave -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-white border border-[#E7E4DC]">
              <span class="font-bold text-[#163828] block mb-1">
                <i class="fa-solid fa-check text-[#22a652] mr-1"></i>Aceptado
              </span>
              <p class="text-[11px] text-[#6B726D]">{{ selectedQuadrant.materialDescripcion }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-[#E7E4DC]">
              <span class="font-bold text-[#163828] block mb-1">
                <i class="fa-solid fa-xmark text-rose-600 mr-1"></i>No aceptado
              </span>
              <p class="text-[11px] text-[#6B726D]">Materiales con grasa, restos orgánicos o mezclados.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#FAF9F6] border-t border-[#E7E4DC] flex items-center justify-between">
          <span class="text-xs font-mono text-[#6B726D]">DIMAO · Municipalidad de Puerto Varas</span>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="bg-[#163828] hover:bg-[#1b5e37] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guía de Materiales -->
    <div *ngIf="showMaterialsModal"
         (click)="closeMaterialsModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#163828]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7E4DC] overflow-hidden anim-modal-panel text-[#232826] my-auto">
        <div class="h-1.5 w-full bg-gradient-to-r from-[#163828] via-[#C98A2C] to-[#22a652]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E7E4DC] flex items-center justify-between bg-[#FAF9F6]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white border border-[#E7E4DC] flex items-center justify-center text-[#163828] text-lg flex-shrink-0 shadow-2xs">
              <i class="fa-solid fa-leaf text-[#22a652]"></i>
            </div>
            <div>
              <span class="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] block">
                Ordenanza Comunal N° 1.402
              </span>
              <h3 class="font-serif font-bold text-xl sm:text-2xl text-[#163828] leading-tight">
                Materiales Aceptados en Ruta
              </h3>
            </div>
          </div>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-[#E7E4DC] hover:bg-[#FAF9F6] text-[#6B726D] hover:text-[#163828] flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-[#6B726D] leading-relaxed font-sans">
          <p class="text-xs text-[#232826]">
            Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorización:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
              <span class="font-mono font-bold text-xs uppercase tracking-wider text-[#163828] block mb-1">1. Vidrio</span>
              <p class="text-xs text-[#6B726D]">Botellas y frascos de conservas sin tapas metálicas. Limpios y secos.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
              <span class="font-mono font-bold text-xs uppercase tracking-wider text-[#C98A2C] block mb-1">2. Cartón y Papel</span>
              <p class="text-xs text-[#6B726D]">Cajas aplanadas, diarios, revistas y papel blanco seco.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
              <span class="font-mono font-bold text-xs uppercase tracking-wider text-sky-700 block mb-1">3. Plásticos</span>
              <p class="text-xs text-[#6B726D]">Botellas de líquidos y envases limpios, aplastados y con tapa puesta.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
              <span class="font-mono font-bold text-xs uppercase tracking-wider text-slate-700 block mb-1">4. Latas</span>
              <p class="text-xs text-[#6B726D]">Latas de aluminio y conservas metálicas enjuagadas y aplastadas.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#FAF9F6] border-t border-[#E7E4DC] flex items-center justify-between">
          <span class="text-xs font-mono text-[#6B726D]">DIMAO · Puerto Varas</span>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="bg-[#163828] hover:bg-[#1b5e37] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Preguntas Frecuentes / Info del Programa -->
    <div *ngIf="showFaqModal"
         (click)="closeFaqModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#163828]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7E4DC] overflow-hidden anim-modal-panel text-[#232826] my-auto">
        <div class="h-1.5 w-full bg-gradient-to-r from-[#163828] via-[#C98A2C] to-[#22a652]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E7E4DC] flex items-center justify-between bg-[#FAF9F6]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white border border-[#E7E4DC] flex items-center justify-center text-[#163828] text-lg flex-shrink-0 shadow-2xs">
              <i class="fa-solid fa-circle-question text-[#C98A2C]"></i>
            </div>
            <div>
              <span class="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] block">
                Orientación Comunitaria
              </span>
              <h3 class="font-serif font-bold text-xl sm:text-2xl text-[#163828] leading-tight">
                Programa Municipal RecicLaGo
              </h3>
            </div>
          </div>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-[#E7E4DC] hover:bg-[#FAF9F6] text-[#6B726D] hover:text-[#163828] flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3.5 text-sm text-[#6B726D] leading-relaxed font-sans">
          <div class="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
            <h4 class="font-serif font-bold text-sm text-[#163828] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#22a652]"></i>
              ¿Tiene algún costo el retiro municipal?
            </h4>
            <p class="text-xs text-[#6B726D] pl-4 font-sans">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas para proteger el entorno natural.</p>
          </div>

          <div class="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
            <h4 class="font-serif font-bold text-sm text-[#163828] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#22a652]"></i>
              ¿Cómo funciona el pesaje in situ?
            </h4>
            <p class="text-xs text-[#6B726D] pl-4 font-sans">Cada camión cuenta con una báscula digital homologada. Al momento del retiro en tu puerta, el chofer pesa la carga y queda registrada de inmediato en la plataforma para emitir tu certificado ambiental.</p>
          </div>

          <div class="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC]">
            <h4 class="font-serif font-bold text-sm text-[#163828] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#22a652]"></i>
              ¿Cómo solicito retiro de colchones, podas o electrodomésticos?
            </h4>
            <p class="text-xs text-[#6B726D] pl-4 font-sans">Inicia sesión en tu cuenta con Microsoft y agenda un <strong>"Retiro especial"</strong> para coordinar una fecha de recolección de voluminosos con la cuadrilla municipal.</p>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#FAF9F6] border-t border-[#E7E4DC] flex items-center justify-between">
          <span class="text-xs font-mono text-[#6B726D]">DIMAO · Puerto Varas</span>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="bg-[#163828] hover:bg-[#1b5e37] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class HomeModalsComponent implements OnChanges, OnDestroy {
  @Input() selectedQuadrant: QuadrantCardInfo | null = null;
  @Input() showMaterialsModal = false;
  @Input() showFaqModal = false;

  @Output() closeQuadrant = new EventEmitter<void>();
  @Output() closeMaterials = new EventEmitter<void>();
  @Output() closeFaq = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedQuadrant || this.showMaterialsModal || this.showFaqModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  closeQuadrantModal(): void {
    document.body.style.overflow = '';
    this.closeQuadrant.emit();
  }

  closeMaterialsModal(): void {
    document.body.style.overflow = '';
    this.closeMaterials.emit();
  }

  closeFaqModal(): void {
    document.body.style.overflow = '';
    this.closeFaq.emit();
  }
}


