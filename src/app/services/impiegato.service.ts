import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImpiegatoService {
  private apiUrl = 'http://localhost:3000/impiegato';
  private ufficioUrl = 'http://localhost:3000/ufficio';
  private impiegatiSediUrl = 'http://localhost:3000/impiegati-sedi';

  constructor(private _http: HttpClient) {}

  // Aggiungi un nuovo impiegato
  addImpiegato(data: any): Observable<any> {
    return this._http.post(`${this.apiUrl}`, data);
  }

  // Aggiorna un impiegato
  updateImpiegato(id: number, data: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/${id}`, data);
  }

  // Ottieni la lista completa degli impiegati
  getListaImpiegatiTot(): Observable<any> {
    return this._http.get(`${this.apiUrl}`).pipe(
      tap(data => console.log('Dati ricevuti dal server:', data)),
      catchError(err => {
        console.error('Errore nel recupero degli impiegati:', err);
        return of([]);
      })
    );
  }

  // Elimina un impiegato
  eliminaImpiegato(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${id}`);
  }

  // Ottieni la lista dinamica degli uffici (nel field del dialog)
  getMenuUffici(): Observable<any> {
    return this._http.get(`${this.ufficioUrl}`).pipe(
      tap(data => console.log('Dati ricevuti dal server:', data)),
      catchError(err => {
        console.error('Errore nel recupero degli uffici:', err);
        return of([]);
      })
    );
  }

  // Ottieni la relazione impiegato-sede dal backend ( view2)
  getImpiegatiSedi(): Observable<any> {
    return this._http.get(`${this.impiegatiSediUrl}`).pipe(
      tap(data => console.log('Dati ricevuti dal server:', data)),
      catchError(err => {
        console.error('Errore nel recupero delle relazioni impiegato-sede:', err);
        return of([]);
      })
    );
  }

  // Funzione per associare UN impiegato ad un ufficio  
  associaImpiegatoAUff(codUff: string, impiegatoId: string): Observable<any> {
    const url = `${this.ufficioUrl}/${codUff}/associa-impiegato`;

    const payload = { id: impiegatoId };

    return this._http.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => console.log(`Impiegato ${impiegatoId} associato all'ufficio ${codUff}`)),
      catchError(err => {
        console.error("Errore nell'associazione dell'impiegato:", err);
        return of({ error: "Errore nell'associazione dell'impiegato" });
      })
    );
  }   

    // Funzione per associare PIU impiegati ad un ufficio
    associaImpiegatiAUff(codUff: string, impiegatiIds: string[]): Observable<any> {
      const url = `${this.ufficioUrl}/${codUff}/associa-impiegati`;
      const payload = { impiegatiIds };
    
      return this._http.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        tap(() => console.log(`Impiegati associati all'ufficio ${codUff}: ${impiegatiIds.join(', ')}`)),
        catchError(err => {
          console.error("Errore nell'associazione degli impiegati:", err);
          return of({ error: "Errore nell'associazione degli impiegati" });
        })
      );
    }


// Funzione per recuperare i ruoli

   getRuoli(): Observable<any> {
  return this._http.get<any>('http://localhost:3000/ruoli');
}

    
}
