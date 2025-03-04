import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ImpiegatoService {
  private apiUrl = 'http://localhost:3000/impiegato';
  private ufficioUrl = 'http://localhost:3000/ufficio';

  constructor(private _http: HttpClient) { }


  // aggiungi un nuovo impiegato
  addImpiegato(data: any): Observable<any> {


    return this._http.post(`${this.apiUrl}`, data);
  }

  // update impiegato
  updateImpiegato(id: number, data: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/${id}`, data);
  }

  // ottieni la lista di tutti gli impiegati
  getListaImpiegati(): Observable<any> {
    return this._http.get(`${this.apiUrl}`).pipe(
      tap(data => console.log("Dati ricevuti dal server:", data)) //  Logga i dati ricevuti
    );
  }


  //elimina impiegato
  eliminaImpiegato(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${id}`);


  }

  //ottieni la lista dinamica degli uffici
  getMenuUffici(): Observable<any> {
    return this._http.get(`${this.ufficioUrl}`).pipe(
      tap(data => console.log("Dati ricevuti dal server:", data))
    );


  }

    // ottieni la lista della relazione impiegato-sede (risultato della query)
   /* getImpiegatiSedi(): Observable<any> {
    return this._http.get(`${this.apiUrl}/impiegati-sedi`).pipe(
        tap(data => console.log('Dati ricevuti dal server:', data))
    );
} */
}









