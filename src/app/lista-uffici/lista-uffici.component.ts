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

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private http: HttpClient, private ufficioService: UfficioService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUffici();
  }

  getUffici() {
    this.http.get<any>('http://localhost:3000/ufficio').subscribe(
      (response) => {
        this.dataSource = response.data;
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
        // Una sola chiamata al backend, che viene già fatta nel componente SelezionaImpiegatoDialogComponent
        console.log(`Impiegato ${impiegatoId} associato all'ufficio ${codUff}`);
        this.getUffici();  // Ricarica la lista degli uffici dopo l'associazione
      }
    });
  }
  

}
