import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UfficioService } from '../services/ufficio.service'; //  import corretto

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
    private ufficioService: UfficioService
  ) { }

  ngOnInit(): void {
    this.ufficioService.getImpiegatiByUfficio(this.data.codUff).subscribe(
      (res) => this.impiegati = res.data,
      (err) => console.error('Errore nel recupero degli impiegati:', err)
    );
  }
}
