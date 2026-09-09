import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BffService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/me`);
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/admin/dashboard`);
  }

  getCoordinadorDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/coordinador/dashboard`);
  }

  getPickupsSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/pickups/summary`);
  }

  getResiduos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/catalog/residuos`);
  }

  getCamiones(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/catalog/camiones`);
  }

  getTarifas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/catalog/tarifas`);
  }

  getPickups(vecinoEmail?: string): Observable<any> {
    const url = vecinoEmail 
      ? `${this.baseUrl}/api/pickups?vecinoEmail=${encodeURIComponent(vecinoEmail)}`
      : `${this.baseUrl}/api/pickups`;
    return this.http.get(url);
  }

  createPickup(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/pickups`, payload);
  }

  programarPickup(id: number, payload?: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/pickups/${id}/programar`, payload || {});
  }

  enRutaPickup(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/pickups/${id}/en-ruta`, {});
  }

  retiradoPickup(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/pickups/${id}/retirado`, {});
  }

  pesadoPickup(id: number, pesoRealKg: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/pickups/${id}/pesado?pesoRealKg=${pesoRealKg}`, {});
  }

  cancelarPickup(id: number, motivo?: string): Observable<any> {
    const url = motivo 
      ? `${this.baseUrl}/api/pickups/${id}/cancelar?motivo=${encodeURIComponent(motivo)}`
      : `${this.baseUrl}/api/pickups/${id}/cancelar`;
    return this.http.patch(url, {});
  }

  getPublicStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/status`);
  }
}
