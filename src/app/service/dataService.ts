import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PiResponse } from '../../../Model/pi-model';
import { HealthResponse } from '../../../Model/health-model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3001';
  private pi = signal<number | null>(null);

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  getPis(): Observable<PiResponse[]> {
    return this.http.get<PiResponse[]>(`${this.baseUrl}/api/pis`);
  }

  createPi(pi: PiResponse): Observable<PiResponse> {
    return this.http.post<PiResponse>(`${this.baseUrl}/api/pis`, pi);
  }

  setPi(pi: number) {
    this.pi.set(pi);
  }
}
