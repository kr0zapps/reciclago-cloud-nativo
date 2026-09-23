import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest, EventMessage, EventType, AccountInfo } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { GlobalModalsComponent } from './shared/components/global-modals/global-modals.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    PageLoaderComponent,
    NavbarComponent,
    FooterComponent,
    GlobalModalsComponent
  ],
  template: `
    <app-page-loader [isLoading]="isPageLoading"></app-page-loader>

    <div class="min-h-screen max-w-full flex flex-col overflow-x-hidden" [ngClass]="(isHomePage && !isScrolled) ? 'bg-[#123F5B]' : 'bg-[#F8FAF7]'">
      <app-navbar
        [isHomePage]="isHomePage"
        [isScrolled]="isScrolled"
        [loginDisplay]="loginDisplay"
        [currentUser]="currentUser"
        (openHowItWorks)="showHowItWorks = true"
        (openMaterials)="showMaterials = true"
        (openContact)="showContact = true"
        (loginClicked)="login()"
        (logoutClicked)="logout()">
      </app-navbar>

      <main class="flex-1 flex flex-col relative max-w-full overflow-x-hidden bg-[#F8FAF7]">
        <router-outlet></router-outlet>
      </main>

      <app-footer
        (openHowItWorks)="showHowItWorks = true"
        (openMaterials)="showMaterials = true"
        (openContact)="showContact = true">
      </app-footer>
    </div>

    <app-global-modals
      [showHowItWorks]="showHowItWorks"
      [showMaterials]="showMaterials"
      [showContact]="showContact"
      (closeHowItWorks)="showHowItWorks = false"
      (closeMaterials)="showMaterials = false"
      (closeContact)="showContact = false">
    </app-global-modals>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  loginDisplay = false;
  currentUser = '';
  isPageLoading = false;

  showHowItWorks = false;
  showMaterials = false;
  showContact = false;

  isScrolled = false;
  isHomePage = typeof window !== 'undefined'
    ? (window.location.pathname === '/' || window.location.pathname === '/index.html' || !window.location.hash || window.location.hash === '#/' || window.location.hash === '#')
    : true;

  private readonly _destroying$ = new Subject<void>();

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 30;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeAllModals();
  }

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
    this.checkCurrentRoute();
    this.onWindowScroll();

    this.router.events
      .pipe(takeUntil(this._destroying$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isPageLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.isPageLoading = false;
          }, 350);
          this.checkCurrentRoute();
        }
      });

    try {
      this.authService.instance?.handleRedirectPromise?.().then((result) => {
        this.setLoginDisplay();
        if (result) {
          const returnUrl = sessionStorage.getItem('reciclago_return_url') || '/dashboard';
          sessionStorage.removeItem('reciclago_return_url');
          this.router.navigateByUrl(returnUrl);
        }
      }).catch((err: unknown) => {
        console.warn('MSAL redirect check warning:', err);
        this.setLoginDisplay();
      });
    } catch (e) {
      console.warn('MSAL handleRedirectPromise call error:', e);
      this.setLoginDisplay();
    }

    if (this.msalBroadcastService?.msalSubject$) {
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
          const returnUrl = sessionStorage.getItem('reciclago_return_url') || '/dashboard';
          sessionStorage.removeItem('reciclago_return_url');
          this.router.navigateByUrl(returnUrl);
        });
    }
  }

  checkCurrentRoute(): void {
    const url = this.router.url.split('?')[0].split('#')[0];
    this.isHomePage = url === '/' || url === '';
  }

  setLoginDisplay(): void {
    let accounts: AccountInfo[] = [];
    try {
      accounts = this.authService.instance?.getAllAccounts?.() || [];
    } catch {
      accounts = [];
    }

    if (accounts.length > 0) {
      this.loginDisplay = true;
      const active = this.authService.instance?.getActiveAccount?.() || accounts[0];
      if (!this.authService.instance?.getActiveAccount?.()) {
        try { this.authService.instance?.setActiveAccount?.(active); } catch {}
      }
      this.currentUser = active.name || active.username || 'Vecino de Puerto Varas';
    } else {
      this.loginDisplay = false;
      this.currentUser = '';
    }
  }

  login(): void {
    const redirectUri = environment.msalConfig.auth.redirectUri;

    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.loginPopup({
        ...(this.msalGuardConfig.authRequest as PopupRequest),
        redirectUri
      }).subscribe((response) => {
        this.authService.instance?.setActiveAccount?.(response.account);
        this.setLoginDisplay();
      });
    } else {
      this.authService.loginRedirect({
        ...(this.msalGuardConfig.authRequest as RedirectRequest),
        redirectUri
      });
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('reciclago_return_url');
    }
    this.authService.logoutRedirect();
  }

  closeAllModals(): void {
    this.showHowItWorks = false;
    this.showMaterials = false;
    this.showContact = false;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
