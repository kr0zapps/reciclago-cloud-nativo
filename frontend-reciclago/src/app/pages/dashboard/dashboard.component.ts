import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BffService } from '../../services/bff.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 30px; max-width: 960px; margin: 0 auto; font-family: sans-serif;">
      <div style="background-color: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #2e7d32; margin-top: 0;">Panel de Control Protegido</h2>
        <p>Acceso concedido exitosamente mediante <strong>MsalGuard</strong>.</p>
        
        <div style="margin-top: 15px; line-height: 1.6;">
          <p><strong>Nombre:</strong> {{ userName }}</p>
          <p><strong>Correo / UPN:</strong> {{ userEmail }}</p>
        </div>
      </div>

      <div style="background-color: #fff3e0; border: 1px solid #ffe082; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #e65100; margin-top: 0;">Roles y Permisos Detectados en el Token</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>Roles Asignados (claim 'roles'):</strong>
          <div style="margin-top: 8px;">
            <span *ngFor="let role of userRoles" style="display: inline-block; background-color: #ff9800; color: white; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 8px;">
              {{ role }}
            </span>
            <span *ngIf="userRoles.length === 0" style="color: #777; font-style: italic;">
              Sin roles explícitos asignados en Azure AD (Rol por defecto: Vecino)
            </span>
          </div>
        </div>

        <div>
          <strong>Scopes de Acceso (claim 'scp'):</strong>
          <div style="margin-top: 8px;">
            <span *ngFor="let scope of userScopes" style="display: inline-block; background-color: #0288d1; color: white; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 8px;">
              {{ scope }}
            </span>
            <span *ngIf="userScopes.length === 0" style="color: #777; font-style: italic;">
              No se detectaron scopes delegados específicos en este token
            </span>
          </div>
        </div>
      </div>

      <div style="background-color: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #1565c0; margin-top: 0;">Prueba de Consumo Backend (MsalInterceptor)</h3>
        <p style="color: #444; font-size: 14px;">
          Al presionar estos botones, <code>MsalInterceptor</code> inyecta automáticamente el token Bearer en la cabecera hacia el BFF (puerto 8080).
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 15px;">
          <button (click)="callProfileApi()" style="padding: 10px 18px; background-color: #1976d2; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Consultar Perfil BFF (/api/me)
          </button>
          <button (click)="callPickupsSummaryApi()" style="padding: 10px 18px; background-color: #388e3c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Consultar Retiros (/api/pickups/summary)
          </button>
          <button (click)="callAdminApi()" style="padding: 10px 18px; background-color: #d32f2f; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Probar Endpoint Admin (/api/admin/dashboard)
          </button>
        </div>

        <div *ngIf="apiResponse" style="background: white; border: 1px solid #90caf9; border-radius: 6px; padding: 15px; margin-top: 10px;">
          <strong>Respuesta del BFF (HTTP {{ apiStatus }}):</strong>
          <pre style="background: #f8f9fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 13px; margin-top: 8px;">{{ apiResponse | json }}</pre>
        </div>

        <div *ngIf="apiError" style="background: #ffebee; border: 1px solid #ef9a9a; border-radius: 6px; padding: 15px; margin-top: 10px; color: #c62828;">
          <strong>Error recibido del BFF (HTTP {{ apiStatus }}):</strong>
          <pre style="background: #fff; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 13px; margin-top: 8px;">{{ apiError | json }}</pre>
        </div>
      </div>

      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin-top: 0;">Claims del Token JWT Decodificados</h3>
        <p style="color: #666; font-size: 14px;">Información extraída directamente desde <code>account.idTokenClaims</code>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f5f5f5; text-align: left;">
              <th style="padding: 8px; border: 1px solid #ddd;">Claim</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of claimsList">
              <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-weight: bold;">{{ item.key }}</td>
              <td style="padding: 8px; border: 1px solid #ddd; word-break: break-all;">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <a routerLink="/" style="display: inline-block; padding: 10px 20px; background-color: #424242; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Volver al Inicio
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

  constructor(
    private authService: MsalService,
    private bffService: BffService
  ) {}

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
