import { Component, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BffService } from '../../../services/bff.service';

export interface MetricaImpacto {
  kilosCertificados: number;
  porcentajeDesvio: number;
  camionesActivos: number;
}

@Component({
  selector: 'app-home-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- SECCIÓN: Impacto Comunal y Trazabilidad (Panel Institucional DIMAO Unificado) -->
    <section class="py-20 sm:py-24 bg-niebla-100 relative border-b border-niebla-200" id="impacto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado Sobrio Sin Badges Cliché -->
        <div class="max-w-2xl mb-12">
          <p class="font-mono text-xs text-pizarra-600 tracking-wider mb-2">
            AUDITORÍA AMBIENTAL COMUNAL · DIMAO
          </p>
          <h2 class="text-3xl sm:text-5xl font-extrabold text-bosque-950 tracking-tight font-heading leading-tight mb-2">
            Impacto y trazabilidad de pesaje
          </h2>
          <p class="text-sm sm:text-base text-pizarra-600 font-sans leading-relaxed">
            Datos reales registrados en báscula electrónica para valorización en plantas regionales y mitigación de vertedero.
          </p>
        </div>

        <!-- PANEL INSTITUCIONAL UNIFICADO (bg-bosque-950) -->
        <div class="bg-bosque-950 text-niebla-100 rounded-3xl p-8 sm:p-12 border border-bosque-800 shadow-2xl overflow-hidden relative">
          
          <!-- Metadatos de Cabecera del Panel -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-bosque-800 gap-4 text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-lago-400"></span>
              <span class="text-lago-400 uppercase tracking-wider font-semibold">
                SISTEMA REGIONAL DE VALORIZACIÓN
              </span>
            </div>
            <div class="text-pizarra-400">
              DATOS EN TIEMPO REAL · CUENCA LAGO LLANQUIHUE
            </div>
          </div>

          <!-- COMPOSICIÓN EDITORIAL ASIMÉTRICA: Cifra Hero + Instrumental Técnico -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
            
            <!-- Columna Hero (7 cols): Cifra Monumental -->
            <div class="lg:col-span-7">
              <span class="font-mono text-xs uppercase tracking-wider text-pizarra-400 block mb-2">
                Total Certificado en Báscula
              </span>
              <div class="flex items-baseline gap-3 mb-3">
                <span class="font-mono font-black text-6xl sm:text-7xl lg:text-8xl text-white tracking-tight tabular-nums">
                  {{ displayKg }}
                </span>
                <span class="font-heading font-extrabold text-3xl sm:text-4xl text-lago-400">kg</span>
              </div>
              <p class="text-sm text-pizarra-400 max-w-lg leading-relaxed font-sans">
                Materiales segregados limpios pesados electrónicamente antes de su despacho a plantas de reciclaje en la Región de Los Lagos.
              </p>
            </div>

            <!-- Columna Soporte Técnico (5 cols): Barra Instrumental & Flota -->
            <div class="lg:col-span-5 space-y-8 bg-bosque-900/60 p-6 sm:p-8 rounded-2xl border border-bosque-800">
              
              <!-- Métrica 1: Desvío de Vertedero con Barra de Progreso Técnica -->
              <div>
                <div class="flex justify-between items-baseline mb-2">
                  <span class="font-mono text-xs text-pizarra-400 uppercase tracking-wider">
                    Desviación de Vertedero
                  </span>
                  <span class="font-mono text-xl font-bold text-white tabular-nums">
                    {{ currentPercent }}%
                  </span>
                </div>

                <!-- Barra Instrumental Continua -->
                <div class="relative w-full h-3 bg-bosque-950 rounded-full overflow-hidden border border-bosque-800">
                  <div
                    class="h-full bg-lago-400 rounded-full transition-all duration-1000 ease-out"
                    [style.width.%]="currentPercent">
                  </div>
                </div>

                <!-- Coordenadas sobre la barra -->
                <div class="flex justify-between items-center text-[10px] font-mono text-pizarra-400 mt-2">
                  <span>0% BASE</span>
                  <span class="text-madera-400">ACTUAL: {{ currentPercent }}%</span>
                  <span>META COMUNAL: 70%</span>
                </div>
              </div>

              <!-- Métrica 2: Flota Satelital en Operación -->
              <div class="pt-6 border-t border-bosque-800">
                <div class="flex justify-between items-baseline mb-2">
                  <span class="font-mono text-xs text-pizarra-400 uppercase tracking-wider">
                    Flota de Camiones Activa
                  </span>
                  <span class="font-mono text-xl font-bold text-white tabular-nums">
                    {{ currentTrucks }} vehículos
                  </span>
                </div>
                <p class="text-xs text-pizarra-400 font-sans leading-relaxed">
                  Monitoreo satelital continuo cubriendo los 4 cuadrantes con tolva para residuos limpios.
                </p>
                <div class="mt-3 flex items-center gap-2 text-[11px] font-mono text-lago-400">
                  <i class="fa-solid fa-satellite-dish text-xs"></i>
                  <span>COBERTURA TOTAL COMUNAL</span>
                </div>
              </div>

            </div>

          </div>

          <!-- SUB-SECCIÓN INTEGRADA: Retiro de Voluminosos (Continuación Natural del Panel) -->
          <div class="pt-8 border-t border-bosque-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <span class="font-mono text-[11px] text-madera-400 uppercase tracking-wider block mb-1">
                Servicio Especial Municipal DIMAO
              </span>
              <h4 class="font-heading font-extrabold text-xl text-white tracking-tight mb-1">
                ¿Necesitas retirar voluminosos o podas?
              </h4>
              <p class="text-xs text-pizarra-400 font-sans leading-relaxed">
                Agenda retiro puerta a puerta para ramas de jardín, escombros limpios o muebles en desuso sin contaminar espacios públicos.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a routerLink="/dashboard" class="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-madera-500 hover:bg-madera-600 text-white font-heading font-semibold text-xs transition shadow-sm cursor-pointer">
                Agendar Retiro Especial
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-bosque-900 hover:bg-bosque-800 text-niebla-200 font-heading font-semibold text-xs transition border border-bosque-800 cursor-pointer">
                Preguntas Frecuentes
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  `
})
export class HomeImpactComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() openInfoModal = new EventEmitter<void>();

  targetKg = 0;
  targetPercent = 25;
  targetTrucks = 2;

  currentKg = 0;
  currentPercent = 0;
  currentTrucks = 0;
  displayKg = '0';
  isVisible = false;
  isLiveConnected = false;
  liveKilosEnVivo = 0;

  private observer?: IntersectionObserver;
  private animFrameId?: number;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private bffService: BffService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.cargarMetricasEnVivo();
    if (!this.isBrowser) {
      this.currentKg = this.targetKg;
      this.currentPercent = this.targetPercent;
      this.currentTrucks = this.targetTrucks;
      this.displayKg = this.targetKg.toLocaleString('es-CL');
      this.isVisible = true;
    }
  }

  cargarMetricasEnVivo(): void {
    this.bffService.getImpactoComunal().subscribe({
      next: (data) => {
        if (data) {
          this.isLiveConnected = true;
          if (data.kilosCertificados !== undefined && data.kilosCertificados !== null) this.targetKg = Number(data.kilosCertificados);
          if (data.porcentajeVertederos !== undefined && data.porcentajeVertederos !== null) this.targetPercent = Number(data.porcentajeVertederos);
          if (data.camionesOperativos !== undefined && data.camionesOperativos !== null) this.targetTrucks = Number(data.camionesOperativos);
          if (data.kilosEnVivo !== undefined && data.kilosEnVivo !== null) this.liveKilosEnVivo = Number(data.kilosEnVivo);
          if (this.isVisible) {
            this.startCountAnimation();
          } else {
            this.displayKg = this.targetKg.toLocaleString('es-CL');
          }
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.bffService.getCamiones().subscribe({
          next: (camiones) => {
            if (camiones && camiones.length > 0) {
              this.targetTrucks = camiones.length;
              this.isLiveConnected = true;
              this.cdr.markForCheck();
            }
          },
          error: () => {}
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.isVisible = true;
          this.cdr.markForCheck();
          this.observer?.disconnect();
          this.startCountAnimation();
        }
      }, { threshold: 0.15 });

      this.observer.observe(this.el.nativeElement);
    } else {
      this.isVisible = true;
      this.startCountAnimation();
    }
  }

  startCountAnimation(): void {
    const duration = 1500;
    const startTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        const valKg = Math.floor(ease * this.targetKg);
        const valPercent = Math.floor(ease * this.targetPercent);
        const valTrucks = Math.floor(ease * this.targetTrucks);

        this.ngZone.run(() => {
          this.currentKg = valKg;
          this.displayKg = valKg.toLocaleString('es-CL');
          this.currentPercent = valPercent;
          this.currentTrucks = valTrucks;
          this.cdr.markForCheck();
        });

        if (progress < 1) {
          this.animFrameId = requestAnimationFrame(step);
        } else {
          this.ngZone.run(() => {
            this.currentKg = this.targetKg;
            this.displayKg = this.targetKg.toLocaleString('es-CL');
            this.currentPercent = this.targetPercent;
            this.currentTrucks = this.targetTrucks;
            this.cdr.markForCheck();
          });
        }
      };

      this.animFrameId = requestAnimationFrame(step);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
