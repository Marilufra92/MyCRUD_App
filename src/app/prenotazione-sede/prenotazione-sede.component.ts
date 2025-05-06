import { Component } from '@angular/core';

@Component({
  selector: 'app-prenotazione-sede',
  standalone: false,
  templateUrl: './prenotazione-sede.component.html',
  styleUrls: ['./prenotazione-sede.component.css']
})
export class PrenotazioneSedeComponent {
  dataPrenotata: Date | null = null;
  prenotazioneConfermata = false;

  confermaPrenotazione() {
    if (this.dataPrenotata) {
      this.prenotazioneConfermata = true;
      console.log('Prenotazione confermata per:', this.dataPrenotata);
      // implementare chiamata HTTP al backend
    }
  }
}
