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
  @ViewChild('dialogTemplate') dialogTemplate: any;

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
    // Oggetto con le descrizioni per ogni ufficio
    const descrizioniUffici: { [key: string]: string } = {
      'Risorse Umane': "L'Ufficio Risorse Umane è responsabile per la gestione e lo sviluppo del personale all'interno dell'azienda. Si occupa di attività come il reclutamento, la formazione, la gestione delle carriere e delle performance dei dipendenti, nonché delle politiche retributive e del benessere organizzativo. È un punto di riferimento per i dipendenti riguardo a contratti, diritti e opportunità di crescita professionale.",
      'Ufficio Tecnico': "L'Ufficio Tecnico è incaricato della gestione e manutenzione dell'infrastruttura tecnologica dell'azienda. Le sue attività comprendono lo sviluppo software, la gestione dei sistemi informativi, il supporto tecnico quotidiano, e l'implementazione di nuove soluzioni tecnologiche. Questo ufficio è essenziale per garantire che le risorse informatiche aziendali siano sempre aggiornate, sicure e funzionanti.",
      'Cybersecurity': "L'Ufficio Cybersecurity si occupa della protezione dei sistemi informatici e delle reti aziendali contro le minacce digitali. Gestisce la sicurezza dei dati sensibili, implementa misure di prevenzione contro attacchi informatici, e monitora costantemente le vulnerabilità nei sistemi. L'obiettivo è garantire la sicurezza delle informazioni aziendali e tutelare la privacy dei clienti e dei dipendenti.",
      'Marketing': "L'Ufficio Marketing è responsabile della pianificazione e dell'esecuzione delle strategie di marketing per promuovere il brand e i prodotti aziendali. Si occupa di analizzare il mercato, studiare i comportamenti dei consumatori e sviluppare campagne pubblicitarie efficaci. Inoltre, coordina la creazione di contenuti, la gestione dei social media e la comunicazione con i clienti per favorire la crescita dell'azienda."
    };
  
    // Ottieni la descrizione dell'ufficio cliccato
    const descrizione = descrizioniUffici[ufficio];
  
    if (descrizione) {
      this.dialog.open(this.dialogTemplate, {
        width: '600px',   
        height: '500px', 
        data: { titolo: ufficio, descrizione: descrizione }
      });
    } else {
      console.error(`Descrizione non trovata per l'ufficio: ${ufficio}`);
    }
  }
  
  

  

  
}
