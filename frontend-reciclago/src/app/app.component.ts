import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background-color: #1b5e20; color: white;">
      <div style="font-size: 20px; font-weight: bold;">RecicLaGo Cloud</div>
      <div style="display: flex; gap: 20px; align-items: center;">
        <a routerLink="/" style="color: white; text-decoration: none;">Inicio</a>
        <a routerLink="/dashboard" style="color: white; text-decoration: none;">Panel</a>
        <button *ngIf="!loginDisplay" (click)="login()" style="padding: 8px 16px; background-color: white; color: #1b5e20; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
          Iniciar sesión
        </button>
        <button *ngIf="loginDisplay" (click)="logout()" style="padding: 8px 16px; background-color: #c62828; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
          Cerrar sesión
        </button>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit, OnDestroy {
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

    this.authService.instance.handleRedirectPromise().then(() => {
      this.setLoginDisplay();
    });
  }

  setLoginDisplay(): void {
    const accounts = this.authService.instance.getAllAccounts();
    this.loginDisplay = accounts.length > 0;
    if (this.loginDisplay && !this.authService.instance.getActiveAccount()) {
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  login(): void {
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

  logout(): void {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}