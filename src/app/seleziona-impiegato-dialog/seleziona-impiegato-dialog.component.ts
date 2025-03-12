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
  
    const impiegatoId = this.selectedImpiegati[0];  // Prendi il primo impiegato selezionato
    
    // Log per verificare l'ID impiegato selezionato
    console.log('Impiegato selezionato:', this.selectedImpiegati); // Controlla tutti gli impiegati selezionati
    console.log('ID impiegato selezionato:', impiegatoId);  // Log per vedere l'ID del primo impiegato selezionato
  
    if (!impiegatoId) {
      console.error("ID impiegato non valido:", impiegatoId);
      this.snackBar.open("Errore nell'associazione: ID impiegato non valido", 'OK', { duration: 3000 });
      return;
    }
  
    // Verifica anche che il codUff sia corretto
    if (!this.data.codUff) {
      console.error("Codice ufficio non valido:", this.data.codUff);
      this.snackBar.open("Errore nell'associazione: Codice ufficio non valido", 'OK', { duration: 3000 });
      return;
    }
  
    // Log di controllo del payload
    const payload = { id: impiegatoId };
    console.log('Payload inviato:', payload);  // Verifica il payload
  
    // Associa l'impiegato all'ufficio
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
