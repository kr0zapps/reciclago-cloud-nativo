import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { BffService } from '../../services/bff.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="background-color: #f3fcf4; min-height: 100vh; padding-bottom: 60px;">
      
      <!-- Protocol Ledger Top Bar -->
      <div style="background: rgba(226, 234, 227, 0.7); backdrop-filter: blur(4px); border-bottom: 1px solid #c0c9c1; padding: 10px 24px;">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; font-size: 12px; color: #414943;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; text-transform: uppercase;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #013623;"></span>
            <span>Ordenanza N° 1.402</span>
            <span style="color: #717973;">•</span>
            <span style="color: #161d19;">Sistema de Gestión Residual & Trazabilidad Predial</span>
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="background: #ffffff; color: #013623; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 14px;">verified_user</span>
              MICROSOFT ENTRA ID • ACCESO SSO SEGURO
            </span>
          </div>
        </div>
      </div>

      <!-- Escenario Principal en Cuadrícula Asimétrica Stitch -->
      <div style="max-width: 1280px; margin: 0 auto; padding: 36px 24px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 540px), 1fr)); gap: 36px; align-items: start;">
          
          <!-- Columna Izquierda: Terminal Ciudadano y Operativo -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Encabezado Tipográfico -->
            <div>
              <span style="font-size: 12px; color: #013623; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 16px;">how_to_reg</span>
                Acceso Cívico Centralizado
              </span>
              <h1 class="font-serif" style="font-size: clamp(28px, 3.5vw, 38px); font-weight: 600; color: #013623; margin: 6px 0 10px; line-height: 1.15;">
                Identificación de Vecino & Gestión Predial
              </h1>
              <p style="font-size: 15px; color: #414943; margin: 0; line-height: 1.5;">
                Acceso centralizado exclusivo mediante cuenta Microsoft institucional (&#64;ptovaras.cl) o cuenta vecinal verificada para gestión de residuos, pesaje y beneficios prediales.
              </p>
            </div>

            <!-- Tarjeta Terminal de Autenticación / Operación -->
            <div class="card-civic" style="padding: 28px;">
              
              <!-- Selector de Pestañas (Vecino / Funcionario) -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; background-color: #edf6ee; padding: 4px; border-radius: 6px; gap: 4px; margin-bottom: 24px; font-size: 13px; font-weight: 600;">
                <button 
                  (click)="tabActiva = 'vecino'" 
                  [style.background-color]="tabActiva === 'vecino' ? '#ffffff' : 'transparent'"
                  [style.color]="tabActiva === 'vecino' ? '#013623' : '#414943'"
                  style="padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 150ms ease;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">cottage</span>
                  <span>Acceso Vecino / Rol Predial</span>
                </button>

                <button 
                  (click)="tabActiva = 'operador'" 
                  [style.background-color]="tabActiva === 'operador' ? '#ffffff' : 'transparent'"
                  [style.color]="tabActiva === 'operador' ? '#013623' : '#414943'"
                  style="padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 150ms ease;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">local_shipping</span>
                  <span>Funcionario DIMAO / Cuadrilla</span>
                </button>
              </div>

              <!-- SI NO ESTÁ AUTENTICADO: Botón Microsoft Entra ID Oficial -->
              <div *ngIf="!isAuthenticated()" style="display: flex; flex-direction: column; gap: 18px;">
                
                <div style="background-color: rgba(237, 246, 238, 0.7); border: 1px solid #c0c9c1; border-radius: 8px; padding: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 700; color: #536257; text-transform: uppercase;">
                      Autenticación Única Homologada
                    </span>
                    <span style="font-size: 12px; font-weight: 600; color: #013623; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
                      Microsoft SSO
                    </span>
                  </div>

                  <p style="font-size: 13px; color: #414943; margin: 0 0 16px;">
                    Acceda con su cuenta Microsoft para sincronizar automáticamente sus inmuebles comunales, trazabilidad de reciclaje y certificaciones de pesaje predial.
                  </p>

                  <!-- Botón Microsoft SSO Stitch -->
                  <button (click)="login()" type="button" style="width: 100%; padding: 14px 18px; background-color: #ffffff; border: 1px solid #c0c9c1; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 150ms ease; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                        <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                        <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                        <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                        <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                      </svg>
                      <div style="text-align: left;">
                        <div style="font-weight: 700; font-size: 14px; color: #161d19;">Iniciar sesión con Microsoft</div>
                        <div style="font-size: 11px; color: #414943;">Microsoft 365 / Entra ID</div>
                      </div>
                    </div>
                    <span class="material-symbols-outlined" style="color: #013623;">arrow_forward</span>
                  </button>
                </div>

                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background-color: #e8f0e8; border-radius: 6px; font-size: 13px; color: #414943;">
                  <span class="material-symbols-outlined" style="color: #013623; font-size: 20px;">shield</span>
                  <span>Inicio de sesión seguro para cuentas <strong>&#64;ptovaras.cl</strong>, <strong>&#64;outlook.com</strong> o institucionales.</span>
                </div>

              </div>

              <!-- SI ESTÁ AUTENTICADO: Formulario de Solicitud y Gestión Real -->
              <div *ngIf="isAuthenticated()" style="display: flex; flex-direction: column; gap: 20px;">
                
                <!-- Perfil Activo -->
                <div style="background-color: #edf6ee; border: 1px solid #c0c9c1; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #013623; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                      {{ userName.charAt(0) }}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #013623;">{{ userName }}</div>
                      <div style="font-size: 12px; color: #536257;">{{ userEmail }}</div>
                    </div>
                  </div>
                  <span *ngFor="let r of userRoles" style="background-color: #013623; color: white; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px;">
                    {{ r }}
                  </span>
                  <span *ngIf="userRoles.length === 0" style="background-color: #d7e6d9; color: #013623; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px;">
                    Vecino Habilitado
                  </span>
                </div>

                <!-- Formulario para Agendar Retiro en Domicilio -->
                <div>
                  <h3 class="font-serif" style="font-size: 20px; font-weight: 600; color: #013623; margin: 0 0 12px;">
                    Solicitar Retiro en su Predio
                  </h3>

                  <div *ngIf="createSuccess" style="background-color: #d7e6d9; color: #013623; padding: 12px; border-radius: 4px; font-size: 13px; margin-bottom: 12px;">
                    ✓ {{ createSuccess }}
                  </div>
                  <div *ngIf="createError" style="background-color: #ffdad6; color: #ba1a1a; padding: 12px; border-radius: 4px; font-size: 13px; margin-bottom: 12px;">
                    ⚠ {{ createError }}
                  </div>

                  <form (ngSubmit)="submitPickup()" style="display: flex; flex-direction: column; gap: 12px;">
                    
                    <div>
                      <label style="display: block; font-size: 12px; font-weight: 600; color: #414943; margin-bottom: 4px;">Tipo de Residuo Segregado</label>
                      <select [(ngModel)]="newPickup.residuoId" name="residuoId" class="input-civic">
                        <option *ngFor="let r of residuos" [value]="r.id">
                          {{ r.nombre }} — \${{ r.precioPorKg }}/kg ({{ r.codigo }})
                        </option>
                      </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                      <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #414943; margin-bottom: 4px;">Dirección / Pasaje</label>
                        <input type="text" [(ngModel)]="newPickup.direccion" name="direccion" required placeholder="Ej. Pérez Rosales 850" class="input-civic" />
                      </div>
                      <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #414943; margin-bottom: 4px;">Sector / Comuna</label>
                        <select [(ngModel)]="newPickup.comuna" name="comuna" class="input-civic">
                          <option value="Puerto Varas">Puerto Varas</option>
                          <option value="Nueva Braunau">Nueva Braunau</option>
                          <option value="Providencia">Providencia</option>
                          <option value="Santiago">Santiago</option>
                        </select>
                      </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
                      <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #414943; margin-bottom: 4px;">Peso Estimado (Kg)</label>
                        <input type="number" step="0.5" [(ngModel)]="newPickup.pesoEstimadoKg" name="pesoEstimadoKg" required class="input-civic" />
                      </div>
                      <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #414943; margin-bottom: 4px;">Observaciones para el chofer</label>
                        <input type="text" [(ngModel)]="newPickup.observaciones" name="observaciones" placeholder="Ej. Dejar en conserjería" class="input-civic" />
                      </div>
                    </div>

                    <button type="submit" [disabled]="submittingPickup" class="btn-civic-primary" style="padding: 12px; margin-top: 6px;">
                      {{ submittingPickup ? 'Enviando solicitud...' : 'Confirmar Retiro en Cuadrante' }}
                    </button>

                  </form>
                </div>

                <!-- Historial de Solicitudes Registradas -->
                <div style="margin-top: 14px; border-top: 1px solid #dce5dd; padding-top: 18px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 class="font-serif" style="font-size: 18px; font-weight: 600; color: #013623; margin: 0;">Mis Retiros Registrados</h4>
                    <button (click)="loadPickups()" class="btn-civic-outline" style="padding: 4px 10px; font-size: 12px;">Refrescar</button>
                  </div>

                  <div *ngIf="pickups.length === 0" style="font-size: 13px; color: #717973; padding: 12px 0;">
                    No existen retiros registrados aún.
                  </div>

                  <div *ngIf="pickups.length > 0" style="display: flex; flex-direction: column; gap: 8px;">
                    <div *ngFor="let p of pickups" style="background-color: #edf6ee; padding: 12px; border-radius: 6px; border: 1px solid #c0c9c1; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="color: #013623;">{{ p.codigoRetiro }}</strong> — {{ p.residuoNombre || 'Residuo #' + p.residuoId }}
                        <div style="font-size: 11px; color: #536257;">{{ p.direccion }}, {{ p.comuna }} ({{ p.pesoEstimadoKg }} kg)</div>
                      </div>
                      <span style="font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #ffffff; color: #013623; border: 1px solid #c0c9c1;">
                        {{ p.estado }}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <!-- Micro-franja de métricas bajo tarjeta -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 16px; border-radius: 8px; background-color: #edf6ee;">
              <div>
                <div style="font-size: 11px; color: #536257; text-transform: uppercase;">Predios Activos</div>
                <div class="font-serif" style="font-size: 24px; font-weight: 700; color: #013623;">14.820</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #536257; text-transform: uppercase;">Cuenca Protegida</div>
                <div class="font-serif" style="font-size: 24px; font-weight: 700; color: #013623;">87,4 km²</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #536257; text-transform: uppercase;">Desvío Relleno</div>
                <div class="font-serif" style="font-size: 24px; font-weight: 700; color: #013623;">+41,2%</div>
              </div>
            </div>

          </div>

          <!-- Columna Derecha: Marco Documental y Beneficios Territoriales -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Foto de Cuenca Municipal con Osorno y Lago sin sobrecargas -->
            <div class="hero-photo-frame">
              <div style="height: 260px; width: 100%; overflow: hidden; background: #e8f0eb;">
                <img 
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop" 
                  alt="Cuenca del Lago Llanquihue y Volcán Osorno, Puerto Varas" 
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </div>
              <div style="padding: 12px 16px; background: #ffffff; border-top: 1px solid #e1ebe3; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                <span style="font-weight: 700; color: #013623;">ZONA COSTANERA · PUERTO VARAS</span>
                <span class="font-mono" style="color: #1e5e3a; font-weight: 600;">CIRCULACIÓN ACTIVA</span>
              </div>
            </div>

            <!-- Ficha de Ventajas del Portal Vecinal (Stitch Oficial) -->
            <div class="card-civic" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dce5dd; padding-bottom: 10px;">
                <span style="font-size: 12px; font-weight: 700; color: #013623; text-transform: uppercase;">
                  Ventajas del Portal Vecinal Registrado
                </span>
                <span style="font-size: 11px; color: #536257; font-weight: 600;">LEY 20.920</span>
              </div>

              <div style="display: flex; gap: 12px; align-items: flex-start; padding: 10px; background-color: #edf6ee; border-radius: 6px;">
                <div style="width: 32px; height: 32px; border-radius: 4px; background: #013623; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">scale</span>
                </div>
                <div>
                  <div style="font-size: 14px; font-weight: 600; color: #161d19;">Pesaje en Tiempo Real</div>
                  <div style="font-size: 12px; color: #414943;">Registro exacto de cartón, vidrio y plástico clasificado retirado desde su vereda.</div>
                </div>
              </div>

              <div style="display: flex; gap: 12px; align-items: flex-start; padding: 10px; background-color: #edf6ee; border-radius: 6px;">
                <div style="width: 32px; height: 32px; border-radius: 4px; background: #1e4d38; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">percent</span>
                </div>
                <div>
                  <div style="font-size: 14px; font-weight: 600; color: #161d19;">Descuento Predial Directo</div>
                  <div style="font-size: 12px; color: #414943;">Acumulación de hasta un -18% en los derechos comunales de aseo domiciliario.</div>
                </div>
              </div>

              <div style="display: flex; gap: 12px; align-items: flex-start; padding: 10px; background-color: #edf6ee; border-radius: 6px;">
                <div style="width: 32px; height: 32px; border-radius: 4px; background: #d4e4d6; color: #013623; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">rv_hookup</span>
                </div>
                <div>
                  <div style="font-size: 14px; font-weight: 600; color: #161d19;">Solicitud de Tolva Express</div>
                  <div style="font-size: 12px; color: #414943;">Acceso prioritario para agendamiento gratuito de podas y enseres voluminosos.</div>
                </div>
              </div>

            </div>

            <!-- Mesa de Ayuda DIMAO Puerto Varas -->
            <div style="background-color: #013623; color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <div style="font-size: 12px; color: #bbeed1; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 16px;">contact_support</span>
                Mesa de Ayuda DIMAO Puerto Varas
              </div>
              <div style="font-size: 13px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Línea Gratuita:</span>
                  <strong style="color: #bbeed1;">600 360 2200</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Correo:</span>
                  <strong style="color: #bbeed1;">aseo&#64;ptovaras.cl</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.8; margin-top: 4px;">
                  <span>Horario Presencial:</span>
                  <span>Lun a Vie • 08:30 a 14:00 hrs</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  tabActiva: 'vecino' | 'operador' = 'vecino';

  userName = '';
  userEmail = '';
  userRoles: string[] = [];

  residuos: any[] = [];
  pickups: any[] = [];
  loadingPickups = false;
  submittingPickup = false;

  createSuccess: string | null = null;
  createError: string | null = null;

  newPickup = {
    residuoId: 1,
    direccion: 'Pérez Rosales 850',
    comuna: 'Puerto Varas',
    pesoEstimadoKg: 10,
    observaciones: ''
  };

  constructor(
    private authService: MsalService,
    private bffService: BffService
  ) {}

  ngOnInit(): void {
    const account = this.authService.instance.getActiveAccount();
    if (account) {
      this.userName = account.name || account.username || 'Vecino Municipal';
      this.userEmail = account.username || '';

      const claims = account.idTokenClaims as Record<string, any> | undefined;
      if (claims && claims['roles']) {
        this.userRoles = Array.isArray(claims['roles']) ? claims['roles'] : [claims['roles']];
      }
    }

    this.loadResiduos();
    this.loadPickups();
  }

  isAuthenticated(): boolean {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  login(): void {
    this.authService.loginRedirect();
  }

  loadResiduos(): void {
    this.bffService.getResiduos().subscribe({
      next: (data) => {
        this.residuos = Array.isArray(data) ? data : [];
        if (this.residuos.length > 0) {
          this.newPickup.residuoId = this.residuos[0].id;
        }
      }
    });
  }

  loadPickups(): void {
    this.loadingPickups = true;
    this.bffService.getPickups().subscribe({
      next: (data) => {
        this.pickups = Array.isArray(data) ? data : [];
        this.loadingPickups = false;
      },
      error: () => {
        this.loadingPickups = false;
      }
    });
  }

  submitPickup(): void {
    this.submittingPickup = true;
    this.createSuccess = null;
    this.createError = null;

    const selected = this.residuos.find(r => r.id == this.newPickup.residuoId);

    const payload = {
      vecinoNombre: this.userName || 'Vecino Puerto Varas',
      vecinoEmail: this.userEmail || 'vecino@ptovaras.cl',
      direccion: this.newPickup.direccion,
      comuna: this.newPickup.comuna,
      residuoId: this.newPickup.residuoId,
      residuoNombre: selected ? selected.nombre : 'Residuo General',
      pesoEstimadoKg: this.newPickup.pesoEstimadoKg,
      observaciones: this.newPickup.observaciones
    };

    this.bffService.createPickup(payload).subscribe({
      next: (created) => {
        this.submittingPickup = false;
        this.createSuccess = `Solicitud ${created.codigoRetiro || 'registrada'} confirmada en cuadrante con éxito.`;
        this.newPickup.observaciones = '';
        this.loadPickups();
      },
      error: (err) => {
        this.submittingPickup = false;
        this.createError = err?.error?.details || err?.error?.error || 'No fue posible registrar la solicitud.';
      }
    });
  }
}
