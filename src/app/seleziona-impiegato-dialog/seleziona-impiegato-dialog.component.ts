import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImpiegatoService } from '../services/impiegato.service'; 

@Component({
  selector: 'app-seleziona-impiegato-dialog',
  standalone: false,
  templateUrl: './seleziona-impiegato-dialog.component.html',
  styleUrls: ['./seleziona-impiegato-dialog.component.css']
})
export class SelezionaImpiegatoDialogComponent implements OnInit {
  impiegati: any[] = [];
  selectedImpiegati: string[] = [];  

  constructor(
    private impiegatoService: ImpiegatoService,
    public dialogRef: MatDialogRef<SelezionaImpiegatoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codUff: string } 
  ) {}

  ngOnInit(): void {
    this.impiegatoService.getListaImpiegatiTot().subscribe(
      (response) => {
        this.impiegati = response.data;
      },
      (error) => console.error("Errore nel recupero degli impiegati:", error)
    );
  }

  conferma() {
    this.dialogRef.close(this.selectedImpiegati); // Chiude il dialog restituendo gli ID selezionati
  }

  annulla() {
    this.dialogRef.close(); // Chiude il dialog senza selezionare nulla
  }
}
