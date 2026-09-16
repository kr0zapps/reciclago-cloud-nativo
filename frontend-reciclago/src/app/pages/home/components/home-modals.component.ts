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
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-2 w-full bg-gradient-to-r from-[#206935] via-[#38BDF8] to-[#093554]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#206935] text-xl flex-shrink-0 shadow-xs">
              <i [class]="selectedQuadrant.iconClass"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#206935] block">
                Cuadrante {{ selectedQuadrant.cuadranteNumber }} · {{ selectedQuadrant.name }}
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#093554] leading-tight">
                Preparación: {{ selectedQuadrant.materialNombre }}
              </h3>
            </div>
          </div>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 space-y-4 text-sm text-slate-700 leading-relaxed">
          <!-- Horario y Día -->
          <div class="bg-[#edf8ed] p-3.5 rounded-2xl border border-[#d6ebd0] flex items-center justify-between text-xs">
            <span class="flex items-center gap-2 font-bold text-[#1a552b]">
              <i class="fa-solid fa-calendar-day"></i> Día: {{ selectedQuadrant.day }}
            </span>
            <span class="font-medium text-slate-600">
              <i class="fa-regular fa-clock text-[#206935]"></i> {{ selectedQuadrant.hours }}
            </span>
          </div>

          <!-- Instrucciones directas del Catálogo -->
          <div>
            <h4 class="font-bold text-sm text-[#093554] mb-1 flex items-center gap-2">
              <i class="fa-solid fa-clipboard-check text-emerald-600"></i>
              Instrucciones Oficiales DIMAO
            </h4>
            <p class="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              {{ selectedQuadrant.materialInstrucciones || 'Entregar el material limpio, seco y compactado antes del horario de paso del camión municipal.' }}
            </p>
          </div>

          <!-- Requisitos clave -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white border border-slate-200">
              <span class="font-bold text-slate-800 block mb-1">
                <i class="fa-solid fa-check text-emerald-600 mr-1"></i>Aceptado
              </span>
              <p class="text-[11px] text-slate-500">{{ selectedQuadrant.materialDescripcion }}</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200">
              <span class="font-bold text-slate-800 block mb-1">
                <i class="fa-solid fa-xmark text-red-500 mr-1"></i>No aceptado
              </span>
              <p class="text-[11px] text-slate-500">Materiales sucios con grasa, restos orgánicos o mezclados.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">DIMAO · Municipalidad de Puerto Varas</span>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="bg-[#206935] hover:bg-[#1a552b] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guía de Materiales -->
    <div *ngIf="showMaterialsModal"
         (click)="closeMaterialsModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-1.5 w-full bg-gradient-to-r from-[#437d32] via-[#38BDF8] to-[#093554]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#437d32] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#437d32] block">
                Ordenanza Comunal · Clasificación
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#093554] leading-tight">
                Materiales Aceptados en Ruta
              </h3>
            </div>
          </div>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs text-slate-500">
            Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorización:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-2xl bg-[#edf8ed] border border-[#d6ebd0]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#238038] block mb-1">1. Vidrio</span>
              <p class="text-xs text-slate-600">Botellas y frascos de conservas sin tapas metálicas. Limpios y secos.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#edf4fb] border border-[#d0e5f5]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#176fa9] block mb-1">2. Cartón y Papel</span>
              <p class="text-xs text-slate-600">Cajas aplanadas, diarios, revistas y papel blanco seco.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fbe9c8]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#c4871d] block mb-1">3. Plásticos</span>
              <p class="text-xs text-slate-600">Botellas de líquidos y envases limpios, aplastados y con tapa puesta.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#fdf0ef] border border-[#fad5d3]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#c94b43] block mb-1">4. Latas</span>
              <p class="text-xs text-slate-600">Latas de aluminio y conservas metálicas enjuagadas y aplastadas.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">DIMAO · Puerto Varas</span>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="bg-[#437d32] hover:bg-[#366827] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Preguntas Frecuentes / Info del Programa -->
    <div *ngIf="showFaqModal"
         (click)="closeFaqModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-1.5 w-full bg-gradient-to-r from-[#437d32] via-[#38BDF8] to-[#093554]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#093554] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-circle-question"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Orientación Comunitaria
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#093554] leading-tight">
                Programa Municipal RecicLaGo
              </h3>
            </div>
          </div>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3.5 text-sm text-slate-600 leading-relaxed">
          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
              ¿Tiene algún costo el retiro municipal?
            </h4>
            <p class="text-xs text-slate-600 pl-4">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas para proteger el entorno natural.</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
              ¿Cómo funciona el pesaje in situ?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Cada camión cuenta con una báscula digital homologada. Al momento del retiro en tu puerta, el chofer pesa la carga y queda registrada de inmediato en la plataforma para emitir tu certificado ambiental.</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
              ¿Cómo solicito retiro de colchones, podas o electrodomésticos?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Inicia sesión en tu cuenta con Microsoft y agenda un <strong>"Retiro especial"</strong> para coordinar una fecha de recolección de voluminosos con la cuadrilla municipal.</p>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">DIMAO · Puerto Varas</span>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="bg-[#093554] hover:bg-[#072438] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
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

