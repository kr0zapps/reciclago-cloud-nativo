import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div style="text-align:center; margin-top: 50px;">
      <h1>Bienvenido a RecicLaGo</h1>
      
      <div *ngIf="!isIframe">
        <button *ngIf="!loginDisplay" (click)="login()">Iniciar sesión con Microsoft</button>
        <button *ngIf="loginDisplay" (click)="logout()">Cerrar sesión</button>
      </div>
      
      <div *ngIf="loginDisplay" style="margin-top: 20px; padding: 20px; background: #e0f7fa; border-radius: 8px;">
        <h3>¡Autenticación Exitosa!</h3>
        <p>Ya puedes acceder a los retiros de la comunidad.</p>
      </div>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.authService.instance.initialize().then(() => {
      this.authService.instance.handleRedirectPromise().then(() => {
        this.setLoginDisplay();
      });
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response) => {
            this.authService.instance.setActiveAccount(response.account);
            this.setLoginDisplay();
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response) => {
            this.authService.instance.setActiveAccount(response.account);
            this.setLoginDisplay();
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}