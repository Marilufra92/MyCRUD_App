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

    const impiegatoId = this.selectedImpiegati[0]; 

    if (!impiegatoId) {
      console.error("ID impiegato non valido:", impiegatoId);
      this.snackBar.open("Errore nell'associazione: ID impiegato non valido", 'OK', { duration: 3000 });
      return;
    }

    if (!this.data.codUff) {
      console.error("Codice ufficio non valido:", this.data.codUff);
      this.snackBar.open("Errore nell'associazione: Codice ufficio non valido", 'OK', { duration: 3000 });
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
    this.dialogRef.close();
  }
}
