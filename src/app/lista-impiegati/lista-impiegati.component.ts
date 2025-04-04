import { Component, OnInit, ViewChild } from '@angular/core';
import { ImpiegatoService } from '../services/impiegato.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from '../core/core.service';
import { AggModImpComponent } from '../agg-mod-imp/agg-mod-imp.component';

// 1. Definizione dell'interfaccia Impiegato
interface Impiegato {
  id: number;
  nome: string;
  cognome: string;
  email?: string;
  datadinascita?: string;
  genere?: string;
  istruzione?: string;
  azienda?: string;
  esperienza?: string;
  ral?: string;
  sede?: string; // Sede potrebbe essere una stringa separata da virgole
  sedi?: string; // Assumiamo che 'sedi' possa essere una stringa separata da virgole
}

@Component({
  selector: 'app-lista-impiegati',
  standalone: false,
  templateUrl: './lista-impiegati.component.html',
  styleUrls: ['./lista-impiegati.component.css']
})
export class ListaImpiegatiComponent implements OnInit {

  currentView: string = 'impiegati';

  // Tabella-colonne VIEW 1
  displayedColumns: string[] = [
    'id',
    'nome',
    'cognome',
    'email',
    'datadinascita',
    'genere',
    'istruzione',
    'azienda',
    'esperienza',
    'ral',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;
  nascondiColonna = true; // Imposta a false per mostrare la colonna

  // Tabella-colonne VIEW 2 - RELAZIONE IMPIEGATO-SEDI
  displayedColumnsView2: string[] = [
    'id',
    'nome',
    'cognome',
    'sede'
  ];
  dataSourceView2 = new MatTableDataSource<any>([]); // Inizializza con un array vuoto

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _impService: ImpiegatoService,
    private _coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this.getListaImpiegati();
  }

  // Apre il modulo per aggiungere/modificare un impiegato
  openAggModImpForm() {
    const dialogRef = this._dialog.open(AggModImpComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getListaImpiegati(); // Ricarica la lista degli impiegati dopo la modifica
        }
      },
    });
  }

  // Recupera la lista di tutti gli impiegati
  getListaImpiegati() {
    this._impService.getListaImpiegatiTot().subscribe({
      next: (res) => {
        console.log("Dati ricevuti dal server:", res); // Debug

        if (res && Array.isArray(res.data)) { // Controlla se "data" è un array
          this.dataSource = new MatTableDataSource(
            res.data.map((row: { datadinascita: string; }) => ({
              ...row,
              datadinascita: this.correctDate(row.datadinascita) // Corregge la data
            }))
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          console.error("Errore: i dati ricevuti non sono un array", res);
        }
      },
      error: (err) => {
        console.error("Errore nel recupero dei dati:", err);
      }
    });
  }

  // Funzione per correggere la data aggiungendo 1 ora
  correctDate(date: string): string {
    if (!date) return '';
    let correctedDate = new Date(date);
    correctedDate.setHours(correctedDate.getHours() + 1); // Aggiunge 1 ora
    return correctedDate.toISOString(); // Ritorna nel formato ISO
  }

  // Funzione per applicare il filtro nella tabella
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Elimina un impiegato
  eliminaImpiegato(id: number) {
    this._impService.eliminaImpiegato(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Impiegato eliminato!', 'OK');
        this.getListaImpiegati(); // Ricarica la lista dopo l'eliminazione
      },
      error: console.log,
    });
  }

  // Apre il modulo di modifica impiegato
  apriModForm(data: any) {
    const dialogRef = this._dialog.open(AggModImpComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getListaImpiegati(); // Ricarica la lista dopo la modifica
        }
      },
    });
  }

  // Cambia vista tra "impiegati" e "uffici"
  setView(view: string) {
    this.currentView = view;
    if (view === 'impiegati-sedi') {
      this.getRelazioneImpiegatoSede(); // Ottieni i dati della relazione impiegato-sede
    } else {
      this.getListaImpiegati(); // Torna alla lista impiegati
    }
  }

  // Ottiene i dati della relazione impiegato-sede
  getRelazioneImpiegatoSede() {
    this._impService.getImpiegatiSedi().subscribe({
      next: (res) => {
        console.log("Risposta completa ricevuta per impiegati-sedi:", res);
        if (res && res.data && Array.isArray(res.data)) {
          const updatedData = res.data.map((impiegato: Impiegato) => {
            
            const sediAssociati = impiegato.sedi && typeof impiegato.sedi === 'string' 
              ? impiegato.sedi // Mantenere la stringa separata da virgole
              : 'Non associato'; // Se 'sedi' non è presente, mostriamo 'Non associato'
            
            return {
              ...impiegato,
              sede: sediAssociati // Ora 'sedi' è una stringa separata da virgole
            };
          });
  
          // Aggiorna il dataSource con i nuovi dati
          this.dataSourceView2.data = updatedData;
          this.dataSourceView2.sort = this.sort;
          this.dataSourceView2.paginator = this.paginator;
        } else {
          console.error("Errore nei dati ricevuti:", res);
        }
      },
      error: (err) => {
        console.error("Errore nel recupero dei dati:", err);
      }
    });
  }
  
  
}
