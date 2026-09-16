import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Residuo, Camion, Pickup } from '../pages/dashboard/data/sectors.data';

export interface UserProfile {
  email: string;
  name: string;
  roles: string[];
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BffService {
  private readonly baseUrl = environment.apiConfig?.uri || 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/api/me`);
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

  getResiduos(): Observable<Residuo[]> {
    return this.http.get<Residuo[]>(`${this.baseUrl}/api/catalog/residuos`);
  }

  getCamiones(): Observable<Camion[]> {
    return this.http.get<Camion[]>(`${this.baseUrl}/api/catalog/camiones`);
  }

  getTarifas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/catalog/tarifas`);
  }

  getPickups(vecinoEmail?: string): Observable<Pickup[]> {
    const url = vecinoEmail 
      ? `${this.baseUrl}/api/pickups?vecinoEmail=${encodeURIComponent(vecinoEmail)}`
      : `${this.baseUrl}/api/pickups`;
    return this.http.get<Pickup[]>(url);
  }

  createPickup(payload: Partial<Pickup> | Record<string, unknown>): Observable<Pickup> {
    return this.http.post<Pickup>(`${this.baseUrl}/api/pickups`, payload);
  }

  programarPickup(id: number, payload?: Record<string, unknown>): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.baseUrl}/api/pickups/${id}/programar`, payload || {});
  }

  enRutaPickup(id: number): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.baseUrl}/api/pickups/${id}/en-ruta`, {});
  }

  retiradoPickup(id: number): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.baseUrl}/api/pickups/${id}/retirado`, {});
  }

  pesadoPickup(id: number, pesoRealKg: number): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.baseUrl}/api/pickups/${id}/pesado?pesoRealKg=${pesoRealKg}`, {});
  }

  cancelarPickup(id: number, motivo?: string): Observable<Pickup> {
    const url = motivo 
      ? `${this.baseUrl}/api/pickups/${id}/cancelar?motivo=${encodeURIComponent(motivo)}`
      : `${this.baseUrl}/api/pickups/${id}/cancelar`;
    return this.http.patch<Pickup>(url, {});
  }

  getPickupsHistory(vecinoEmail?: string, estado?: string, page: number = 0, size: number = 10): Observable<any> {
    let url = `${this.baseUrl}/api/pickups/history?page=${page}&size=${size}`;
    if (vecinoEmail) url += `&vecinoEmail=${encodeURIComponent(vecinoEmail)}`;
    if (estado) url += `&estado=${encodeURIComponent(estado)}`;
    return this.http.get(url);
  }

  getPickupById(id: number): Observable<Pickup> {
    return this.http.get<Pickup>(`${this.baseUrl}/api/pickups/${id}`);
  }

  getCuadrantes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/routes/cuadrantes`);
  }

  getCuadrante(direccion?: string): Observable<any> {
    const url = direccion 
      ? `${this.baseUrl}/api/routes/cuadrante?direccion=${encodeURIComponent(direccion)}`
      : `${this.baseUrl}/api/routes/cuadrante`;
    return this.http.get(url);
  }

  getTracking(cuadranteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/routes/${cuadranteId}/tracking`);
  }

  getCamionTracking(camionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/routes/tracking/${camionId}`);
  }

  sendCitizenContact(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/citizens/contact`, payload);
  }

  getCitizenContacts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/citizens/contact`);
  }

  getHowItWorks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/citizens/how-it-works`);
  }

  getFaqs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/citizens/faq`);
  }

  getPublicStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/status`);
  }
}
