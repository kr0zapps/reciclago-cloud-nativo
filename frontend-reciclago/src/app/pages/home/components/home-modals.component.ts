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
         class="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-1.5 w-full bg-emerald-600"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 text-lg flex-shrink-0 shadow-2xs">
              <i [class]="selectedQuadrant.iconClass"></i>
            </div>
            <div>
              <span class="text-xs font-semibold text-emerald-700 block">
                Cuadrante {{ selectedQuadrant.cuadranteNumber }} · {{ selectedQuadrant.name }}
              </span>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 leading-tight">
                Preparación: {{ selectedQuadrant.materialNombre }}
              </h3>
            </div>
          </div>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
          <!-- Horario y Día -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span class="flex items-center gap-2 font-semibold text-slate-900">
              <i class="fa-regular fa-calendar text-emerald-600"></i> Día: {{ selectedQuadrant.day }}
            </span>
            <span class="text-slate-500 font-medium">
              <i class="fa-regular fa-clock text-slate-400 mr-1"></i>{{ selectedQuadrant.hours }}
            </span>
          </div>

          <!-- Instrucciones directas del Catálogo -->
          <div>
            <h4 class="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-clipboard-check text-emerald-600"></i>
              Instrucciones Oficiales DIMAO
            </h4>
            <p class="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {{ selectedQuadrant.materialInstrucciones || 'Entregar el material limpio, seco y compactado antes del horario de paso del camión municipal.' }}
            </p>
          </div>

          <!-- Requisitos clave -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-white border border-slate-200">
              <span class="font-semibold text-slate-900 block mb-1">
                <i class="fa-solid fa-check text-emerald-600 mr-1"></i>Aceptado
              </span>
              <p class="text-[11px] text-slate-500">{{ selectedQuadrant.materialDescripcion }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-slate-200">
              <span class="font-semibold text-slate-900 block mb-1">
                <i class="fa-solid fa-xmark text-rose-500 mr-1"></i>No aceptado
              </span>
              <p class="text-[11px] text-slate-500">Materiales con grasa o restos orgánicos.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">DIMAO · Municipalidad de Puerto Varas</span>
          <button (click)="closeQuadrantModal()"
                  type="button"
                  class="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guía de Materiales -->
    <div *ngIf="showMaterialsModal"
         (click)="closeMaterialsModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-1.5 w-full bg-emerald-600"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 text-lg flex-shrink-0 shadow-2xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="text-xs font-semibold text-emerald-700 block">
                Ordenanza Comunal N° 1.402
              </span>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 leading-tight">
                Materiales Aceptados en Ruta
              </h3>
            </div>
          </div>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
          <p class="text-xs text-slate-700">
            Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorización:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-xs uppercase tracking-wider text-emerald-700 block mb-1">1. Vidrio</span>
              <p class="text-xs text-slate-600">Botellas y frascos sin tapas. Limpios y secos.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-xs uppercase tracking-wider text-amber-700 block mb-1">2. Cartón y Papel</span>
              <p class="text-xs text-slate-600">Cajas dobladas, diarios, revistas y papel blanco seco.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-xs uppercase tracking-wider text-sky-700 block mb-1">3. Plásticos</span>
              <p class="text-xs text-slate-600">Botellas y envases limpios, aplastados y con tapa.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-xs uppercase tracking-wider text-slate-700 block mb-1">4. Latas</span>
              <p class="text-xs text-slate-600">Latas de bebidas y conservas enjuagadas y aplastadas.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">DIMAO · Puerto Varas</span>
          <button (click)="closeMaterialsModal()"
                  type="button"
                  class="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Preguntas Frecuentes / Info del Programa -->
    <div *ngIf="showFaqModal"
         (click)="closeFaqModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden anim-modal-panel text-slate-800 my-auto">
        <div class="h-1.5 w-full bg-emerald-600"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-lg flex-shrink-0 shadow-2xs">
              <i class="fa-solid fa-circle-question text-emerald-600"></i>
            </div>
            <div>
              <span class="text-xs font-semibold text-slate-500 block">
                Orientación Comunitaria
              </span>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 leading-tight">
                Programa Municipal RecicLaGo
              </h3>
            </div>
          </div>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-2xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3.5 text-sm text-slate-600 leading-relaxed font-sans">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-emerald-600"></i>
              ¿Tiene algún costo el retiro municipal?
            </h4>
            <p class="text-xs text-slate-600 pl-4">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas.</p>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-emerald-600"></i>
              ¿Cómo funciona el pesaje in situ?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Cada camión cuenta con báscula digital homologada. Al momento del retiro en tu puerta, se pesa la carga y queda registrada de inmediato.</p>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-emerald-600"></i>
              ¿Cómo solicito retiro de colchones, podas o electrodomésticos?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Inicia sesión y agenda un <strong>"Retiro especial"</strong> para coordinar una fecha de recolección de voluminosos.</p>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">DIMAO · Puerto Varas</span>
          <button (click)="closeFaqModal()"
                  type="button"
                  class="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer">
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


