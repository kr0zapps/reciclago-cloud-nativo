import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BffService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/me`);
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/admin/dashboard`);
  }

  getPickupsSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/pickups/summary`);
  }

  getResiduos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/catalog/residuos`);
  }

  getPickups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/pickups`);
  }

  createPickup(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/pickups`, payload);
  }

  getPublicStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/status`);
  }
}
