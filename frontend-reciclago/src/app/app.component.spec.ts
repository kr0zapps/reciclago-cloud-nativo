import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { of, Subject } from 'rxjs';

describe('AppComponent', () => {
  let msalServiceMock: any;
  let msalBroadcastServiceMock: any;

  beforeEach(async () => {
    msalServiceMock = {
      instance: {
        getAllAccounts: () => [],
        getActiveAccount: () => null,
        setActiveAccount: () => { },
        handleRedirectPromise: () => Promise.resolve(null)
      },
      loginPopup: () => of({ account: null }),
      loginRedirect: () => Promise.resolve(),
      logoutRedirect: () => Promise.resolve()
    };

    msalBroadcastServiceMock = {
      msalSubject$: new Subject()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: MsalService, useValue: msalServiceMock },
        { provide: MsalBroadcastService, useValue: msalBroadcastServiceMock },
        {
          provide: MSAL_GUARD_CONFIG,
          useValue: { interactionType: InteractionType.Redirect }
        }
      ]
    }).compileComponents();
  });

  it('debe instanciar el componente principal (AppComponent)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe renderizar el titulo de la aplicacion "RecicLaGo"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RecicLaGo');
  });
});