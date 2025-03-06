import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UfficioService {
  private ufficioUrl = 'http://localhost:3000/ufficio'; // Sostituisci con la tua API

  constructor(private http: HttpClient) {}

  associaImpiegatoAUfficio(codUff: string, impiegatoId: string): Observable<any> {
    return this.http.post<any>(`${this.ufficioUrl}/${codUff}/associa-impiegato`, { });
  }
}
