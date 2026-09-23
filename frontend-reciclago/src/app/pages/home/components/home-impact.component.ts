import { Component, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BffService } from '../../../services/bff.service';

@Component({
  selector: 'app-home-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: ImpactSection -->
    <section class="py-14 sm:py-16 bg-[#F8FAF7] border-t border-[#E2E8F0]" id="impacto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección -->
        <div class="mb-8 text-center sm:text-left">
          <span class="text-xs font-bold uppercase tracking-wider text-[#22a652]">Trazabilidad Ley REP</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#123F5B] tracking-tight mt-1 font-heading">
            Impacto en Puerto Varas
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Pesaje digital y balance en tiempo real de la recolección comunal en la cuenca del Lago Llanquihue.
          </p>
        </div>

        <!-- 3 Tarjetas de Métricas Horizontales Limpias -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          
          <!-- Métrica 1: Kilos -->
          <div class="bg-white rounded-xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs flex items-center gap-4 hover:border-[#22a652] transition-colors">
            <div class="w-12 h-12 rounded-xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xl flex-shrink-0">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-[#123F5B] font-heading tracking-tight">
                {{ displayKg }} <span class="text-base font-bold text-[#22a652]">kg</span>
              </div>
              <div class="text-xs font-bold text-gray-800 mt-0.5">Reciclaje Certificado</div>
              <p class="text-[11px] text-gray-400 mt-0.5">Pesaje digital en ruta vecinal</p>
            </div>
          </div>

          <!-- Métrica 2: Vertederos -->
          <div class="bg-white rounded-xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs flex items-center gap-4 hover:border-[#22a652] transition-colors">
            <div class="w-12 h-12 rounded-xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xl flex-shrink-0">
              <i class="fa-solid fa-arrow-trend-down"></i>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-[#123F5B] font-heading tracking-tight">
                {{ currentPercent }}<span class="text-xl font-bold text-[#22a652]">%</span>
              </div>
              <div class="text-xs font-bold text-gray-800 mt-0.5">Menos en Vertederos</div>
              <p class="text-[11px] text-gray-400 mt-0.5">Desviación hacia valorización</p>
            </div>
          </div>

          <!-- Métrica 3: Flota -->
          <div class="bg-white rounded-xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs flex items-center gap-4 hover:border-[#22a652] transition-colors">
            <div class="w-12 h-12 rounded-xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xl flex-shrink-0">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-[#123F5B] font-heading tracking-tight">
                {{ currentTrucks }} <span class="text-base font-bold text-[#22a652]">camiones</span>
              </div>
              <div class="text-xs font-bold text-gray-800 mt-0.5">Flota en Operación</div>
              <p class="text-[11px] text-gray-400 mt-0.5">Cobertura en 4 cuadrantes</p>
            </div>
          </div>

        </div>

        <!-- Banner Retiro Especial: Sólido, Limpio y de Alto Contraste -->
        <div class="bg-[#123F5B] rounded-xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22a652] mb-1">
              <i class="fa-solid fa-truck-ramp-box"></i>
              <span>Servicio Municipal DIMAO</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold font-heading text-white">¿Necesitas un retiro especial a domicilio?</h3>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Solicita recolección para podas de jardín, escombros limpios o enseres fuera de tu cuadrante semanal.
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a routerLink="/dashboard" class="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-[#22a652] hover:bg-[#1b8e45] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer">
              Agendar Retiro Especial
            </a>
            <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 cursor-pointer">
              Preguntas Frecuentes
            </button>
          </div>
        </div>

      </div>
    </section>
    <!-- END: ImpactSection -->
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
        // Fallback: intentar al menos obtener el conteo de camiones reales desde ms-reciclago-catalog
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
        
        // Easing: easeOutCubic
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

