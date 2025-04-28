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
    this.caricaImpiegatiDisponibili();
  }

  caricaImpiegatiDisponibili() {
    // Recupera tutti gli impiegati
    this.impiegatoService.getListaImpiegatiTot().subscribe(
      (response) => {
        const tuttiImpiegati = response.data;

        // Recupera la lista di impiegati già associati a un ufficio
        this.impiegatoService.getImpiegatiSedi().subscribe(
          (res) => {
            const impiegatiAssociati = res.data.map((i: any) => i.id); // Ottiene solo gli ID

            // Filtra solo quelli che NON sono già associati a un ufficio
            this.impiegati = tuttiImpiegati.filter((imp: any) => !impiegatiAssociati.includes(imp.id));

            console.log("Impiegati disponibili per l'associazione:", this.impiegati);
          },
          (error) => console.error("Errore nel recupero degli impiegati associati:", error)
        );
      },
      (error) => console.error("Errore nel recupero degli impiegati:", error)
    );
  }

  salvaAssociazione() {
    if (this.selectedImpiegati.length === 0) {
      this.snackBar.open('Seleziona almeno un impiegato', 'OK', { duration: 3000 });
      return;
    }
  
    const impiegatiSelezionati = this.selectedImpiegati;  // array di impiegati
  
    if (!impiegatiSelezionati || !this.data.codUff) {
      this.snackBar.open("Errore nell'associazione: dati non validi", 'OK', { duration: 3000 });
      return;
    }
  
    this.impiegatoService.associaImpiegatiAUff(this.data.codUff, impiegatiSelezionati).subscribe(
      () => {
        this.snackBar.open('Impiegati associati con successo!', 'OK', { duration: 3000 });
  
        // Rimuove gli impiegati associati dalla lista
        this.impiegati = this.impiegati.filter((impiegato) => !impiegatiSelezionati.includes(impiegato.id));
  
        this.dialogRef.close(impiegatiSelezionati);
      },
      (error) => {
        console.error("Errore nell'associazione:", error);
        this.snackBar.open("Errore nell'associazione", 'OK', { duration: 3000 });
      }
    );
  }
  
  

  annulla() {
    this.dialogRef.close();
  }
}
