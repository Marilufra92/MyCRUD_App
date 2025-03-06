import { Component, OnInit, ViewChild } from '@angular/core';
import { ImpiegatoService } from '../services/impiegato.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from '../core/core.service';
import { AggModImpComponent } from '../agg-mod-imp/agg-mod-imp.component';

@Component({
  selector: 'app-lista-impiegati',
  standalone: false,
  templateUrl: './lista-impiegati.component.html',
  styleUrls: ['./lista-impiegati.component.css']
})
export class ListaImpiegatiComponent implements OnInit {

  currentView: string = 'impiegati';

  // tabella-colonne VIEW 1
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
    'codUff',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

    

  // tabella-colonne VIEW 2    RELAZIONE IMPIEGATO-SEDI
  displayedColumnsView2: string[] = [
  'id',
  'nome',
  'cognome',
  'sede'
];
dataSourceView2!: MatTableDataSource<any>;

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


  openAggModImpForm() {
    const dialogRef = this._dialog.open(AggModImpComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getListaImpiegati();
        }
      },
    });
  }

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminaImpiegato(id: number) {
    this._impService.eliminaImpiegato(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Impiegato eliminato!', 'OK');
        this.getListaImpiegati();
      },
      error: console.log,
    });
  }

  apriModForm(data: any) {
    const dialogRef = this._dialog.open(AggModImpComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getListaImpiegati();
        }
      },
    });
  }

  // cambia vista tra "impiegati" e "uffici"
  setView(view: string) {
    this.currentView = view;
    if (view === 'impiegati-sedi') {
      this.getRelazioneImpiegatoSede(); // Ottieni i dati della relazione impiegato-sede
    } else {
      this.getListaImpiegati(); // Torna alla lista impiegati
    }
  }

  // ottiene i dati della relazione impiegato-sede
  getRelazioneImpiegatoSede() {
    this._impService.getImpiegatiSedi().subscribe({
      next: (res) => {
        console.log("Dati ricevuti per impiegati-sedi:", res);

        if (res && Array.isArray(res.data)) {
          this.dataSourceView2 = new MatTableDataSource(res.data); // Assegna i dati alla seconda tabella
          this.dataSourceView2.sort = this.sort;
          this.dataSourceView2.paginator = this.paginator;
        } else {
          console.error("Errore: i dati ricevuti non sono un array", res);
        }
      },
      error: (err) => {
        console.error("Errore nel recupero della relazione impiegato-sede:", err);
      }
    });
  }
}
  

  


