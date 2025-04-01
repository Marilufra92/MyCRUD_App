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
  displayedColumns: string[] = ['codUff', 'nomeUff', 'sede', 'indirizzo', 'numInterno', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns2: string[] = ['codUff', 'nomeUff', 'Conteggio_dipendenti']; 
  dataSourceConteggio = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTemplate') dialogTemplate: any;

  constructor(private http: HttpClient, private ufficioService: UfficioService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUffici();  
  }

  getUffici() {
    this.http.get<any>('http://localhost:3000/ufficio').subscribe(
      (response) => {
        if (response && response.data) {
          this.dataSource = new MatTableDataSource(response.data);  
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => console.error('Errore nel recupero degli uffici:', error)
    );
  }

  associaImpiegatodaUff(codUff: string) {
    const dialogRef = this.dialog.open(SelezionaImpiegatoDialogComponent, {
      width: '400px',
      data: { codUff }
    });

    dialogRef.afterClosed().subscribe((impiegatoId) => {
      if (impiegatoId) {
        console.log(`Impiegato ${impiegatoId} associato all'ufficio ${codUff}`);
        this.getUffici();
      }
    });
  }

  setView(view: string) {
    this.currentView = view;  
    if (view === 'dipendenti-per-ufficio') {
      this.getConteggioDipendentiRisultato();  
    }
  }

  getConteggioDipendentiRisultato() {
    this.ufficioService.getCountDip().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dataSourceConteggio = new MatTableDataSource(res.data);
        }
      },
      error: (err) => console.error('Errore nel recupero del conteggio dipendenti:', err)
    });
  }

  onCardClick(ufficio: string) {
    const descrizioniUffici: { [key: string]: string } = {
      'Risorse Umane': "L'Ufficio Risorse Umane gestisce il personale, la formazione e le assunzioni.",
      'Ufficio Tecnico': "L'Ufficio Tecnico gestisce l'infrastruttura IT e il supporto tecnico.",
      'Cybersecurity': "L'Ufficio Cybersecurity protegge i sistemi aziendali da minacce informatiche.",
      'Marketing': "L'Ufficio Marketing promuove il brand e analizza il mercato."
    };
    
    const descrizione = descrizioniUffici[ufficio];
    
    if (descrizione) {
      this.dialog.open(this.dialogTemplate, {
        width: '600px',
        height: '500px',
        data: { titolo: ufficio, descrizione }
      });
    } else {
      console.error(`Descrizione non trovata per l'ufficio: ${ufficio}`);
    }
  }
}
