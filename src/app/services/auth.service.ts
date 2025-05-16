import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public ruoloCorrente: string = 'VIEWER'; // ruolo di default

  constructor() {
    if (this.isBrowser()) {
      const ruoloSalvato = sessionStorage.getItem('ruolo');
      if (ruoloSalvato) {
        this.ruoloCorrente = ruoloSalvato;
      }
    }
  }

  setRuolo(ruolo: string): void {
    this.ruoloCorrente = ruolo;
    if (this.isBrowser()) {
      sessionStorage.setItem('ruolo', ruolo);
    }
  }

  getRuolo(): string {
    return this.ruoloCorrente;
  }

  canRead(): boolean {
    return ['ADMIN', 'USER', 'VIEWER'].includes(this.ruoloCorrente);
  }

  canWrite(): boolean {
    return this.ruoloCorrente === 'ADMIN';
  }

  canEdit(): boolean {
    return ['ADMIN', 'USER'].includes(this.ruoloCorrente);
  }

  canDelete(): boolean {
    return this.ruoloCorrente === 'ADMIN';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  canAccessImpiegati(): boolean {
  return this.ruoloCorrente != "VIEWER";
}

}
