import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImpiegatoService } from '../services/impiegato.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelezionaImpiegatoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codUff: string }
  ) { }

  ngOnInit(): void {
    this.impiegatoService.getListaImpiegatiTot().subscribe(
      (response) => {
        this.impiegati = response.data;
      },
      (error) => console.error("Errore nel recupero degli impiegati:", error)
    );
  }

  // Funzione per aggiornare il codUff degli impiegati selezionati
  salvaAssociazione() {
    if (this.selectedImpiegati.length === 0) {
      this.snackBar.open('Seleziona almeno un impiegato', 'OK', { duration: 3000 });
      return;
    }

    const impiegatoId = this.selectedImpiegati[0]; // Prendiamo solo il primo impiegato selezionato

    if (!impiegatoId) {
      console.error("ID impiegato non valido:", impiegatoId);
      return;
    }

    this.impiegatoService.associaImpiegatoAUff(this.data.codUff, impiegatoId).subscribe(
      () => {
        this.snackBar.open('Impiegato associato con successo!', 'OK', { duration: 3000 });
        this.dialogRef.close(impiegatoId);
      },
      (error) => {
        console.error("Errore nell'associazione:", error);
        this.snackBar.open("Errore nell'associazione", 'OK', { duration: 3000 });
      }
    );

  }

  annulla() {
    this.dialogRef.close(); // Chiude il dialog senza selezionare nulla
  }
}
