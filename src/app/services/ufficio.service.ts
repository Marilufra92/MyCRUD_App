import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UfficioService {
  private ufficioUrl = 'http://localhost:3000/ufficio';
  private conteggioNumDipUrl = 'http://localhost:3000/conteggio-num-dipendenti';

  constructor(private http: HttpClient) { }

  // Associa un impiegato a un ufficio 
  associaImpiegatoAUfficio(codUff: string, impiegatoId: string): Observable<any> {
    return this.http.post<any>(`${this.ufficioUrl}/${codUff}/associa-impiegato`, { id: impiegatoId }).pipe(
      tap(response => console.log('Impiegato associato:', response)),
      catchError(err => {
        console.error('Errore:', err);
        return of({ message: 'Errore durante l\'associazione' });
      })
    );
  }


  //  Ottieni il conteggio dei dipendenti dal backend
  getCountDip(): Observable<any> {
    return this.http.get(`${this.conteggioNumDipUrl}`).pipe(
      tap(data => console.log('Dati ricevuti dal server:', data)),
      catchError(err => {
        console.error('Errore nel recupero del conteggio impiegati', err);
        return of([]);
      })
    );
  }



  // Ottieni tutti gli impiegati associati a un determinato ufficio
  getImpiegatiByUfficio(codUff: string): Observable<any> {
    const url = `http://localhost:3000/ufficio/${codUff}/impiegati`;

    return this.http.get(url).pipe(
      tap(data => console.log(`Impiegati per l'ufficio ${codUff}:`, data)),
      catchError(err => {
        console.error(`Errore nel recupero degli impiegati per l'ufficio ${codUff}:`, err);
        return of([]);
      })
    );
  }


}
