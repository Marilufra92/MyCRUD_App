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
  codUff: string = '';

  constructor(
    private impiegatoService: ImpiegatoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelezionaImpiegatoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codUff: string },
    private _impService: ImpiegatoService
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

  salvaAssociazione(codUff: string, impiegatiIds: string[]) {
    impiegatiIds.forEach(id => {
      let successCount = 0;
let total = this.selectedImpiegati.length;

this.selectedImpiegati.forEach((id, index) => {
  this.impiegatoService.associaImpiegatoAUff(this.data.codUff, id).subscribe({
    next: () => {
      successCount++;
      if (successCount === total) {
        this.snackBar.open('Tutti gli impiegati sono stati associati!', 'Chiudi', { duration: 3000 });
        this.dialogRef.close(true);
      }
    },
    error: (err) => {
      console.error(`Errore per impiegato ${id}:`, err);
      if (index === total - 1) {
        this.snackBar.open('Errore durante alcune associazioni.', 'Chiudi', { duration: 3000 });
      }
    }
  });
});

    });
  }




  annulla() {
    this.dialogRef.close();
  }
}
