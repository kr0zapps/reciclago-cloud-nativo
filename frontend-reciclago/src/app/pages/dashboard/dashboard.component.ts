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
    <div style="padding: 24px; max-width: 1100px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333;">
      <div style="background: linear-gradient(135deg, #1b5e20, #2e7d32); color: white; border-radius: 12px; padding: 24px 30px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700;">Panel de Control RecicLaGo</h1>
            <p style="margin: 0; opacity: 0.9; font-size: 14px;">Autenticado con Microsoft Entra ID (Azure AD) y protegido por <code>MsalGuard</code></p>
          </div>
          <div style="background: rgba(255,255,255,0.15); padding: 10px 18px; border-radius: 8px; backdrop-filter: blur(4px);">
            <div style="font-size: 14px; font-weight: 600;">{{ userName }}</div>
            <div style="font-size: 12px; opacity: 0.85;">{{ userEmail }}</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <h3 style="color: #e65100; margin-top: 0; font-size: 17px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Roles y Permisos (Token JWT)
          </h3>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Roles asignados (claim 'roles'):</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span *ngFor="let role of userRoles" style="background-color: #ff9800; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                {{ role }}
              </span>
              <span *ngIf="userRoles.length === 0" style="background-color: #4caf50; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                Rol por Defecto: Vecino (Sin roles administrativos)
              </span>
            </div>
          </div>
          <div>
            <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Scopes delegados (claim 'scp'):</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span *ngFor="let scope of userScopes" style="background-color: #0288d1; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                {{ scope }}
              </span>
              <span *ngIf="userScopes.length === 0" style="color: #888; font-size: 13px; font-style: italic;">
                Scope implícito por recurso
              </span>
            </div>
          </div>
        </div>

        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <h3 style="color: #1565c0; margin-top: 0; font-size: 17px; display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> Pruebas Directas BFF (MsalInterceptor)
          </h3>
          <p style="color: #666; font-size: 13px; margin-bottom: 14px;">
            <code>MsalInterceptor</code> inyecta automáticamente el token Bearer en el puerto 8080.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button (click)="callProfileApi()" style="padding: 8px 14px; background-color: #1976d2; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-align: left; font-size: 13px;">
              👤 GET /api/me (Perfil & Claims)
            </button>
            <button (click)="callPickupsSummaryApi()" style="padding: 8px 14px; background-color: #388e3c; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-align: left; font-size: 13px;">
              📊 GET /api/pickups/summary (Resumen Microservicio)
            </button>
            <button (click)="callAdminApi()" style="padding: 8px 14px; background-color: #d32f2f; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-align: left; font-size: 13px;">
              🔒 GET /api/admin/dashboard (Prueba RBAC 403 Forbidden)
              </button>
            <button (click)="callCoordinadorApi()" style="padding: 8px 14px; background-color: #f57c00; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-align: left; font-size: 13px;">
              📋 GET /api/coordinador/dashboard (Prueba RBAC Coordinador/Admin)
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="apiResponse" style="background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <strong style="color: #2e7d32;">Respuesta Exitosa del BFF (HTTP {{ apiStatus }}):</strong>
        <pre style="background: white; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 8px; border: 1px solid #c8e6c9;">{{ apiResponse | json }}</pre>
      </div>

      <div *ngIf="apiError" style="background: #ffebee; border: 1px solid #ef9a9a; border-radius: 8px; padding: 16px; margin-bottom: 24px; color: #c62828;">
        <strong>Respuesta de Seguridad del BFF (HTTP {{ apiStatus }}):</strong>
        <pre style="background: white; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 8px; border: 1px solid #ffcdd2;">{{ apiError | json }}</pre>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 24px; margin-bottom: 24px;">
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 22px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #2e7d32; font-size: 18px;">♻️ Catálogo de Residuos</h3>
            <button (click)="loadResiduos()" style="background: #f1f8e9; border: 1px solid #c5e1a5; color: #33691e; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">
              Refrescar
            </button>
          </div>
          <div *ngIf="loadingResiduos" style="color: #666; font-size: 14px;">Cargando catálogo vía BFF...</div>
          <div *ngIf="!loadingResiduos && residuos.length === 0" style="color: #888; font-size: 14px;">No hay residuos registrados en el catálogo.</div>
          <div *ngIf="residuos.length > 0" style="display: flex; flex-direction: column; gap: 10px;">
            <div *ngFor="let item of residuos" style="background: #f9fbe7; border: 1px solid #e6ee9c; border-radius: 6px; padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <strong style="color: #33691e;">{{ item.nombre }}</strong>
                <span style="font-size: 12px; font-weight: bold; background: #dce775; padding: 2px 8px; border-radius: 10px;">
                  \${{ item.precioPorKg }} / kg
                </span>
              </div>
              <div style="font-size: 12px; color: #555; margin-top: 4px;">{{ item.descripcion }}</div>
              <div style="font-size: 11px; color: #888; margin-top: 4px;">Código: <code>{{ item.codigo }}</code></div>
            </div>
          </div>
        </div>

        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 22px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <h3 style="margin-top: 0; margin-bottom: 16px; color: #1565c0; font-size: 18px;">📦 Solicitar Retiro a Domicilio</h3>
          
          <div *ngIf="createSuccess" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 6px; padding: 10px; font-size: 13px; margin-bottom: 12px;">
            {{ createSuccess }}
          </div>
          <div *ngIf="createError" style="background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 6px; padding: 10px; font-size: 13px; margin-bottom: 12px;">
            {{ createError }}
          </div>

          <form (ngSubmit)="submitPickup()" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Tipo de Residuo:</label>
              <select [(ngModel)]="newPickup.residuoId" name="residuoId" style="width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px;">
                <option *ngFor="let r of residuos" [value]="r.id">{{ r.nombre }} (\${{ r.precioPorKg }}/kg)</option>
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Dirección:</label>
                <input type="text" [(ngModel)]="newPickup.direccion" name="direccion" required placeholder="Ej: Av. Providencia 123" style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px;" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Comuna:</label>
                <select [(ngModel)]="newPickup.comuna" name="comuna" style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px;">
                  <option value="Providencia">Providencia</option>
                  <option value="Santiago">Santiago</option>
                  <option value="Vitacura">Vitacura</option>
                  <option value="Las Condes">Las Condes</option>
                  <option value="Ñuñoa">Ñuñoa</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Peso Estimado (kg):</label>
              <input type="number" step="0.5" [(ngModel)]="newPickup.pesoEstimadoKg" name="pesoEstimadoKg" required style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px;" />
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Observaciones:</label>
              <input type="text" [(ngModel)]="newPickup.observaciones" name="observaciones" placeholder="Ej: Dejar en conserjería" style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px;" />
            </div>

            <button type="submit" [disabled]="submittingPickup" style="margin-top: 6px; padding: 10px; background-color: #2e7d32; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
              {{ submittingPickup ? 'Enviando solicitud...' : 'Confirmar Solicitud de Retiro' }}
            </button>
          </form>
        </div>
      </div>

      <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 22px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #37474f; font-size: 18px;">📋 Historial de Solicitudes de Retiro</h3>
          <button (click)="loadPickups()" style="background: #eceff1; border: 1px solid #cfd8dc; color: #37474f; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Refrescar
          </button>
        </div>

        <div *ngIf="loadingPickups" style="color: #666; font-size: 14px;">Cargando retiros vía BFF...</div>
        <div *ngIf="!loadingPickups && pickups.length === 0" style="color: #888; font-size: 14px;">No hay retiros registrados.</div>

        <div *ngIf="pickups.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f5f5f5; text-align: left;">
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Código</th>
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Vecino</th>
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Residuo</th>
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Dirección</th>
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Peso Est.</th>
                <th style="padding: 10px; border-bottom: 2px solid #e0e0e0;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of pickups" style="border-bottom: 1px solid #eeeeee;">
                <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #1565c0;">{{ p.codigoRetiro }}</td>
                <td style="padding: 10px;">
                  <div>{{ p.vecinoNombre }}</div>
                  <div style="font-size: 11px; color: #888;">{{ p.vecinoEmail }}</div>
                </td>
                <td style="padding: 10px;">{{ p.residuoNombre || 'Residuo #' + p.residuoId }}</td>
                <td style="padding: 10px;">{{ p.direccion }}, {{ p.comuna }}</td>
                <td style="padding: 10px;">{{ p.pesoEstimadoKg }} kg</td>
                <td style="padding: 10px;">
                  <span [style.background-color]="getEstadoColor(p.estado)" style="color: white; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: bold;">
                    {{ p.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 22px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
        <h3 style="margin-top: 0; color: #424242; font-size: 17px;">🔑 Claims del Token JWT</h3>
        <p style="color: #666; font-size: 13px;">Información extraída del token emitido por Microsoft Entra ID:</p>
        
        <div style="max-height: 250px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tbody>
              <tr *ngFor="let item of claimsList" style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 12px; font-family: monospace; font-weight: bold; color: #333; background: #fafafa; width: 25%;">{{ item.key }}</td>
                <td style="padding: 8px 12px; word-break: break-all; color: #555;">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <a routerLink="/" style="display: inline-block; padding: 10px 20px; background-color: #424242; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          ← Volver al Inicio
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userRoles: string[] = [];
  userScopes: string[] = [];
  claimsList: { key: string; value: string }[] = [];

  apiResponse: any = null;
  apiError: any = null;
  apiStatus: number | null = null;

  residuos: any[] = [];
  pickups: any[] = [];
  loadingResiduos: boolean = false;
  loadingPickups: boolean = false;
  submittingPickup: boolean = false;

  newPickup = {
    residuoId: 1,
    direccion: 'Av. Providencia 1234',
    comuna: 'Providencia',
    pesoEstimadoKg: 10,
    observaciones: ''
  };

  createSuccess: string | null = null;
  createError: string | null = null;

  constructor(
    private authService: MsalService,
    private bffService: BffService
  ) { }

  ngOnInit(): void {
    const account = this.authService.instance.getActiveAccount();
    if (account && account.idTokenClaims) {
      const claims = account.idTokenClaims as Record<string, any>;

      this.userName = claims['name'] || account.name || account.username;
      this.userEmail = claims['preferred_username'] || account.username;

      if (claims['roles'] && Array.isArray(claims['roles'])) {
        this.userRoles = claims['roles'];
      } else if (claims['roles'] && typeof claims['roles'] === 'string') {
        this.userRoles = [claims['roles']];
      }

      if (claims['scp'] && typeof claims['scp'] === 'string') {
        this.userScopes = claims['scp'].split(' ');
      }

      this.claimsList = Object.keys(claims).map((key) => ({
        key,
        value: typeof claims[key] === 'object' ? JSON.stringify(claims[key]) : String(claims[key])
      }));
    }

    this.loadResiduos();
    this.loadPickups();
  }

  loadResiduos(): void {
    this.loadingResiduos = true;
    this.bffService.getResiduos().subscribe({
      next: (data) => {
        this.residuos = Array.isArray(data) ? data : [];
        if (this.residuos.length > 0) {
          this.newPickup.residuoId = this.residuos[0].id;
        }
        this.loadingResiduos = false;
      },
      error: () => {
        this.loadingResiduos = false;
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

    const selectedResiduo = this.residuos.find(r => r.id == this.newPickup.residuoId);

    const payload = {
      vecinoNombre: this.userName,
      vecinoEmail: this.userEmail,
      direccion: this.newPickup.direccion,
      comuna: this.newPickup.comuna,
      residuoId: this.newPickup.residuoId,
      residuoNombre: selectedResiduo ? selectedResiduo.nombre : 'Residuo General',
      pesoEstimadoKg: this.newPickup.pesoEstimadoKg,
      observaciones: this.newPickup.observaciones
    };

    this.bffService.createPickup(payload).subscribe({
      next: (created) => {
        this.submittingPickup = false;
        this.createSuccess = `¡Solicitud ${created.codigoRetiro || 'creada'} registrada con éxito! El camión será coordinado a la brevedad.`;
        this.loadPickups();
      },
      error: (err) => {
        this.submittingPickup = false;
        this.createError = err?.error?.details || 'Error al enviar la solicitud de retiro al BFF.';
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'SOLICITADO': return '#0288d1';
      case 'PROGRAMADO': return '#ed6c02';
      case 'EN_RUTA': return '#9c27b0';
      case 'RETIRADO': return '#2e7d32';
      case 'PESADO': return '#00796b';
      case 'CANCELADO': return '#d32f2f';
      default: return '#757575';
    }
  }

  callProfileApi(): void {
    this.resetApiFeedback();
    this.bffService.getProfile().subscribe({
      next: (data) => {
        this.apiResponse = data;
        this.apiStatus = 200;
      },
      error: (err) => {
        this.apiError = err.error || err;
        this.apiStatus = err.status;
      }
    });
  }
  callCoordinadorApi(): void {
    this.resetApiFeedback();
    this.bffService.getCoordinadorDashboard().subscribe({
      next: (data) => {
        this.apiResponse = data;
        this.apiStatus = 200;
      },
      error: (err) => {
        this.apiError = err.error || err;
        this.apiStatus = err.status;
      }
    });
  }

  callPickupsSummaryApi(): void {
    this.resetApiFeedback();
    this.bffService.getPickupsSummary().subscribe({
      next: (data) => {
        this.apiResponse = data;
        this.apiStatus = 200;
      },
      error: (err) => {
        this.apiError = err.error || err;
        this.apiStatus = err.status;
      }
    });
  }

  callAdminApi(): void {
    this.resetApiFeedback();
    this.bffService.getAdminDashboard().subscribe({
      next: (data) => {
        this.apiResponse = data;
        this.apiStatus = 200;
      },
      error: (err) => {
        this.apiError = err.error || err;
        this.apiStatus = err.status;
      }
    });
  }

  private resetApiFeedback(): void {
    this.apiResponse = null;
    this.apiError = null;
    this.apiStatus = null;
  }
}
