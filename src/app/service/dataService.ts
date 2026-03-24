import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PiResponse } from '../../../Model/pi-model';
import { HealthResponse } from '../../../Model/health-model';
import { EmployeeResponse } from '../../../Model/employee-model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3001';
  pi = signal<number | null>(null);

  // API status

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  // PI State
  setPi(pi: number) {
    this.pi.set(pi);
  }

  // Program Increments

  getPis(): Observable<PiResponse[]> {
    return this.http.get<PiResponse[]>(`${this.baseUrl}/api/pis`);
  }

  getOnePi(id: number): Observable<PiResponse> {
    return this.http.get<PiResponse>(`${this.baseUrl}/api/pis/${id}`);
  }

  createPi(pi: PiResponse): Observable<PiResponse> {
    return this.http.post<PiResponse>(`${this.baseUrl}/api/pis`, pi);
  }

  updatePi(pi: PiResponse): Observable<PiResponse> {
    return this.http.put<PiResponse>(`${this.baseUrl}/api/pis/${pi.id}`, pi);
  }

  deletePi(piId: number) {
    return this.http.delete<PiResponse>(`${this.baseUrl}/api/pis/${piId}`);
  }

  // Employees

  getEmployees(piId: number): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(`${this.baseUrl}/api/pis/${piId}/employees`);
  }

  createEmployee(newEmployee: EmployeeResponse): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(
      `${this.baseUrl}/api/pis/${newEmployee.id}/employees`,
      newEmployee,
    );
  }
}
