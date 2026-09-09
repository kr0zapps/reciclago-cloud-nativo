import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface DataPoint {
  label: string;
  value: string;
}

interface SectorInfo {
  id: string;
  name: string;
  desc: string;
  image: string;
  dataPoints: DataPoint[]; // Permite orden dinámico de datos
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('pageEntrance', [
      transition(':enter', [
        query('.entrance-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('800ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('contentFade', [
      transition('* => *', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(8px)' }),
          stagger(60, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('imageFade', [
      transition('* => *', [
        style({ opacity: 0, scale: 0.98 }),
        animate('700ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, scale: 1 }))
      ])
    ])
  ],
  template: `
    <div class="text-text-primary antialiased flex flex-col font-sans pb-16 transition-colors duration-300" @pageEntrance>
      
      <!-- HERO SECTION -->
      <section class="w-full pt-16 pb-20 px-4 sm:px-8">
        <div class="max-w-[1040px] mx-auto">
          
          <!-- Titular Principal -->
          <div class="text-center max-w-3xl mx-auto mb-16 entrance-item">
            <h2 class="text-5xl sm:text-6xl md:text-7xl font-normal text-brand-primary tracking-tight leading-[1.05] font-serif mb-6 transition-colors duration-300">
              Gestión inteligente de retiro en Puerto Varas.
            </h2>
            <p class="text-[17px] text-text-secondary leading-relaxed max-w-xl mx-auto font-normal font-sans transition-colors duration-300">
              Consulte la recolección diferenciada en su calle y agende retiros programados para proteger la cuenca del lago Llanquihue.
            </p>
          </div>

          <!-- Navegación de Sectores -->
          <div class="max-w-3xl mx-auto mb-10 flex flex-wrap sm:flex-nowrap gap-1 border-b border-border pb-px entrance-item">
            <button 
              *ngFor="let s of sectores" 
              (click)="seleccionarSector(s)"
              class="relative flex-1 py-3 px-4 text-[14px] font-semibold text-center transition-colors duration-300 focus:outline-none"
              [class.text-brand-primary]="s.id === sectorActivo.id"
              [class.text-text-secondary]="s.id !== sectorActivo.id"
              [class.hover:text-text-primary]="s.id !== sectorActivo.id">
              {{ s.name }}
              <!-- Indicador Activo Inferior -->
              <div *ngIf="s.id === sectorActivo.id" class="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"></div>
            </button>
          </div>

          <!-- Panel de Información del Sector (Estilo Editorial & Dinámico) -->
          <div class="bg-transparent border-y border-border grid grid-cols-1 md:grid-cols-12 min-h-[460px] entrance-item transition-colors duration-300">
            
            <!-- Columna Izquierda: Datos (Con Animación Stagger) -->
            <div class="md:col-span-5 lg:col-span-5 py-10 pr-6 sm:pr-12 flex flex-col justify-center transition-colors duration-300">
              <div [@contentFade]="sectorActivo.id">
                
                <h3 class="stagger-item text-4xl sm:text-5xl font-normal text-brand-primary font-serif mb-3 tracking-tight transition-colors duration-300">
                  {{ sectorActivo.name }}
                </h3>
                
                <p class="stagger-item text-[15px] text-text-secondary mb-8 leading-relaxed font-sans transition-colors duration-300">
                  {{ sectorActivo.desc }}
                </p>

                <!-- Bloque de Datos Dinámico (Sentence case real, sin uppercase) -->
                <div class="stagger-item space-y-5 mb-10">
                  <div *ngFor="let point of sectorActivo.dataPoints">
                    <div class="text-[12px] font-medium text-text-secondary mb-1 transition-colors duration-300">{{ point.label }}</div>
                    <div class="text-[16px] font-semibold text-text-primary transition-colors duration-300">{{ point.value }}</div>
                  </div>
                </div>

                <div class="stagger-item flex flex-col sm:flex-row gap-3">
                  <a routerLink="/dashboard" class="btn-primary w-full sm:w-auto">
                    Agendar retiro
                  </a>
                  <button class="btn-outline w-full sm:w-auto">
                    Ver mapa
                  </button>
                </div>

              </div>
            </div>

            <!-- Columna Derecha: Fotografía Limpia y Enmarcada (Sin Pills, Sin Badges) -->
            <div class="md:col-span-7 lg:col-span-7 flex items-center justify-center py-6 sm:py-8 transition-colors duration-300">
              <div class="group relative w-full h-[380px] sm:h-[420px] rounded-[2px] rounded-br-[28px] overflow-hidden border border-border shadow-md bg-surface transition-all duration-500 hover:shadow-xl">
                <div class="w-full h-full" [@imageFade]="sectorActivo.id">
                  <img [src]="sectorActivo.image" 
                       [alt]="'Servicio en ' + sectorActivo.name" 
                       class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105">
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- PIE DE PÁGINA OFICIAL -->
      <footer class="bg-transparent border-t border-border py-16 px-6 mt-12 max-w-[1040px] mx-auto w-full entrance-item transition-colors duration-300">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-[26px] text-brand-primary">forest</span>
              <span class="font-serif text-[20px] font-bold text-brand-primary">RecicLaGo</span>
            </div>
            <p class="text-[13px] leading-relaxed text-text-secondary mb-5">
              Plataforma cívica municipal de gestión integral de residuos y protección de la cuenca lacustre de Llanquihue.
            </p>
            <div class="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
              <span class="material-symbols-outlined text-[16px]">location_on</span>
              <span>San Francisco 413, Puerto Varas</span>
            </div>
          </div>

          <div>
            <h4 class="font-serif text-[15px] font-bold text-text-primary mb-4">Ordenanzas y normativa</h4>
            <div class="flex flex-col gap-3 text-[13px] text-text-secondary font-medium">
              <a routerLink="/dashboard" class="hover:text-brand-primary hover:underline transition-colors">Ordenanza municipal N° 42</a>
              <a routerLink="/dashboard" class="hover:text-brand-primary hover:underline transition-colors">Implementación Ley REP</a>
              <a routerLink="/dashboard" class="hover:text-brand-primary hover:underline transition-colors">Protocolos de fiscalización</a>
              <a routerLink="/dashboard" class="hover:text-brand-primary hover:underline transition-colors">Protección de humedales</a>
            </div>
          </div>

          <div>
            <h4 class="font-serif text-[15px] font-bold text-text-primary mb-4">Puntos limpios fijos</h4>
            <div class="flex flex-col gap-3 text-[13px] text-text-secondary font-medium">
              <div><strong class="font-bold text-text-primary">Costanera:</strong> Lun-Sáb 08:30-18:00</div>
              <div><strong class="font-bold text-text-primary">Ensenada:</strong> Mar/Jue 09:00-16:00</div>
              <div><strong class="font-bold text-text-primary">Colón:</strong> Lun-Vie 08:30-17:30</div>
              <div><strong class="font-bold text-text-primary">Braunau:</strong> Miércoles (Móvil)</div>
            </div>
          </div>

          <div>
            <h4 class="font-serif text-[15px] font-bold text-text-primary mb-4">Atención ciudadana</h4>
            <div class="flex flex-col gap-3 text-[13px] text-text-secondary mb-5 font-medium">
              <div>DIMAO: +56 65 236 1200</div>
              <div>Emergencias: 1409</div>
              <div>contacto&#64;puertovaras.cl</div>
            </div>
            <div class="inline-flex items-center gap-2 bg-surface border border-border px-3 py-2 rounded-btn text-[10px] font-bold text-brand-primary uppercase tracking-wider transition-colors">
              <span class="material-symbols-outlined text-[16px]">eco</span>
              <span>Comuna Circular</span>
            </div>
          </div>

        </div>

        <div class="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-text-secondary uppercase tracking-wider font-bold transition-colors">
          <div>© 2026 I. Municipalidad de Puerto Varas</div>
          <div>Portal Comunal Transparente</div>
        </div>
      </footer>

    </div>
  `
})
export class HomeComponent implements OnInit {
  // Fotografía local oficial del camión municipal de Puerto Varas
  realTruckPhoto = '/assets/camion-puerto-varas.jpg';

  sectores: SectorInfo[] = [
    {
      id: 'costanera',
      name: 'Costanera',
      desc: 'Sector Costanera Norte y Muelle',
      image: this.realTruckPhoto,
      dataPoints: [
        { label: 'Cronograma de retiro', value: 'Martes y viernes (08:30)' },
        { label: 'Fracción asignada', value: 'Vidrio y cartón' }
      ]
    },
    {
      id: 'puerto_chico',
      name: 'Puerto Chico',
      desc: 'Avenida Colón y perímetro Villa Los Volcanes',
      image: this.realTruckPhoto,
      dataPoints: [
        { label: 'Fracción prioritaria', value: 'Plásticos y secos' },
        { label: 'Centro de acopio cercano', value: 'Punto limpio Colón' }
      ]
    },
    {
      id: 'braunau',
      name: 'Nueva Braunau',
      desc: 'Cuadrante Central Braunau y parcelas aledañas',
      image: this.realTruckPhoto,
      dataPoints: [
        { label: 'Operativo móvil', value: 'Miércoles (09:00 - 14:00)' },
        { label: 'Fracción asignada', value: 'Orgánicos y podas' }
      ]
    },
    {
      id: 'ensenada',
      name: 'Ensenada',
      desc: 'Ruta 225 Km 12 a 42, faldeos Volcán Osorno',
      image: this.realTruckPhoto,
      dataPoints: [
        { label: 'Condición de ruta', value: 'Retiro sujeto a clima' },
        { label: 'Cronograma especial', value: 'Sábados (cada 15 días)' }
      ]
    }
  ];

  sectorActivo: SectorInfo = this.sectores[0];

  ngOnInit() {
    // Al iniciar, el sector activo es el primero
  }

  seleccionarSector(sector: SectorInfo): void {
    this.sectorActivo = sector;
  }
}
