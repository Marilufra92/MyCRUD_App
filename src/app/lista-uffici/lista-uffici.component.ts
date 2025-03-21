import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UfficioService } from '../services/ufficio.service';
import { SelezionaImpiegatoDialogComponent } from '../seleziona-impiegato-dialog/seleziona-impiegato-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lista-uffici',
  standalone: false,
  templateUrl: './lista-uffici.component.html',
  styleUrls: ['./lista-uffici.component.css']
})
export class ListaUfficiComponent implements OnInit {
  currentView: string = 'uffici'; 
  // tabella uffici VIEW 1
  displayedColumns: string[] = ['codUff', 'nomeUff', 'sede', 'indirizzo', 'numInterno', 'action'];

  dataSource!: MatTableDataSource<any>;
  

   // tabella VIEW 2 - COUNT dipendenti negli uffici
   displayedColumns2: string[] = [
    'codUff',
    'nomeUff',
    'Conteggio_dipendenti'
   ]; 
    
  dataSourceConteggio!: MatTableDataSource<any>;
    

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient,
              private ufficioService: UfficioService, 
              public dialog: MatDialog,
              
            ) {}

  ngOnInit(): void {
    this.getUffici();  
  }

  // Funzione per recuperare gli uffici
  getUffici() {
    this.http.get<any>('http://localhost:3000/ufficio').subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource(response.data);  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => console.error('Errore nel recupero degli uffici:', error)
    );
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


  // Funzione per cambiare la vista
  setView(view: string) {
    this.currentView = view;  
    if (view === 'dipendenti-per-ufficio') {
      this.getConteggioDipendentiRisultato();  
    }
  };

   // ottiene i dati del risultato della query conteggio dipendenti
  getConteggioDipendentiRisultato() {
    this.ufficioService.getCountDip().subscribe({
      next: (res) => {
        console.log("Dati ricevuti per conteggio impiegati negli uffici :", res);
         if (res && Array.isArray(res.data)) {
                  this.dataSourceConteggio = new MatTableDataSource(res.data); // Assegna i dati alla view2
               
                } else {
                  console.error("Errore: i dati ricevuti non sono un array", res);
                }}



    })
  }

  onCardClick(ufficio: string) {
    console.log(`Hai cliccato su: ${ufficio}`);
   

  }

  

  
}
