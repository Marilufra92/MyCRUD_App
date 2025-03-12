import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UfficioService } from '../services/ufficio.service';
import { SelezionaImpiegatoDialogComponent } from '../seleziona-impiegato-dialog/seleziona-impiegato-dialog.component';

@Component({
  selector: 'app-lista-uffici',
  standalone: false,
  templateUrl: './lista-uffici.component.html',
  styleUrls: ['./lista-uffici.component.css']
})
export class ListaUfficiComponent implements OnInit {
  displayedColumns: string[] = ['codUff', 'nomeUff', 'sede', 'indirizzo', 'numInterno', 'action'];
  dataSource: any[] = [];
  dataSourceConteggio: any[] = [];  // Nuovo array per i dati del conteggio dei dipendenti per ufficio
  currentView: string = 'uffici';  // Variabile per gestire la vista corrente

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private http: HttpClient, private ufficioService: UfficioService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUffici();  // Recupera gli uffici all'inizio
  }

  // Funzione per recuperare gli uffici
  getUffici() {
    this.http.get<any>('http://localhost:3000/ufficio').subscribe(
      (response) => {
        this.dataSource = response.data;  // Popola la lista degli uffici
      },
      (error) => console.error('Errore nel recupero degli uffici:', error)
    );
  }

  /* Funzione per recuperare il conteggio dei dipendenti per ufficio
  getConteggioDipendenti() {
    this.http.get<any>('http://localhost:3000/ufficio/conteggio-dipendenti').subscribe(
      (response) => {
        this.dataSourceConteggio = response.data;  // Popola il conteggio dei dipendenti
      },
      (error) => console.error('Errore nel recupero del conteggio dei dipendenti:', error)
    );
  }  */

    getConteggioDipendenti() {
      throw new Error('Method not implemented.');
    }

  // Funzione per cambiare la vista
  setView(view: string) {
    this.currentView = view;  // Imposta la vista attiva
    if (view === 'dipendenti-per-ufficio') {
      this.getConteggioDipendenti();  // Recupera i dati dei dipendenti per ufficio quando si cambia alla vista dei dipendenti
    }
  } 
  

  // Funzione per associare un impiegato a un ufficio
  associaImpiegatodaUff(codUff: string) {
    const dialogRef = this.dialog.open(SelezionaImpiegatoDialogComponent, {
      width: '400px',
      data: { codUff }
    });

    dialogRef.afterClosed().subscribe((impiegatoId) => {
      if (impiegatoId) {
        // Una sola chiamata al backend, che viene già fatta nel componente SelezionaImpiegatoDialogComponent
        console.log(`Impiegato ${impiegatoId} associato all'ufficio ${codUff}`);
        this.getUffici();  // Ricarica la lista degli uffici dopo l'associazione
      }
    });
  }
}
