import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UfficioService } from '../services/ufficio.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dettaglio-impiegati-dialog',
  standalone: false,
  templateUrl: './dettaglio-impiegati-dialog.component.html',
  styleUrls: ['./dettaglio-impiegati-dialog.component.scss']
})
export class DettaglioImpiegatiDialogComponent implements OnInit {
  impiegati: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ufficioService: UfficioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DettaglioImpiegatiDialogComponent>
  ) { }

  ngOnInit(): void {
    this.loadImpiegati();
  }

  loadImpiegati(): void {
    this.ufficioService.getImpiegatiByUfficio(this.data.codUff).subscribe({
      next: (res) => this.impiegati = res.data,
      error: (err) => console.error('Errore nel recupero degli impiegati:', err)
    });
  }

  disassociaImpiegato(idImpiegato: string): void {
    this.ufficioService.disassociaImpiegatoDaUfficio(idImpiegato).subscribe({
      next: () => {
        this.impiegati = this.impiegati.filter(imp => imp.id !== idImpiegato);
        this.snackBar.open('Impiegato disassociato con successo.', 'Chiudi', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Errore durante la disassociazione.', 'Chiudi', { duration: 3000 });
      }
    });
  }
}
