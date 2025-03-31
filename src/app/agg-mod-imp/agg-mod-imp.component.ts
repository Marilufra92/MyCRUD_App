import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImpiegatoService } from '../services/impiegato.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-agg-mod-imp',
  standalone: false,
  templateUrl: './agg-mod-imp.component.html',
  styleUrls: ['./agg-mod-imp.component.css'],
})
export class AggModImpComponent implements OnInit {
  impForm: FormGroup;
  impiegati: any[] = [];

  education: string[] = [
    'Matricola',
    'Diploma',
    'Laurea Triennale',
    'Laurea Magistrale',
    'Dottorato',
  ];
  ufficio: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _impiegatoService: ImpiegatoService,
    private _dialogRef: MatDialogRef<AggModImpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
  ) {
    this.impForm = this._fb.group({
      id: 0,
      nome: '',
      cognome: '',
      email: '',
      datadinascita: '',
      genere: '',
      istruzione: '',
      azienda: '',
      esperienza: '',
      ral: 0,
  
    });
  }

  ngOnInit(): void {
    if (this.data) {
      const parsedDate = this.correctDateForInput(this.data.datadinascita);
      this.impForm.patchValue({
        ...this.data,
        datadinascita: parsedDate
      });
    }

    this._impiegatoService.getMenuUffici().subscribe({
      next: (res) => {
        console.log("Uffici ricevuti:", res);
        this.ufficio = Array.isArray(res.data) ? res.data : [];
      },
      error: (err) => console.error("Errore nel recupero degli uffici:", err)
    });
  }


  getListaImpiegati() {
    this._impiegatoService.getListaImpiegatiTot().subscribe((res) => {
      this.impiegati = Array.isArray(res) ? res : res.data || [];
    });
  }

  correctDateForBackend(date: any): string {
    if (!date) return '';
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.error("Errore: Data non valida", date);
      return '';
    }

    parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
    return parsedDate.toISOString().split('T')[0];
  }

  correctDateForInput(date: string | null): Date | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  onFormSubmit() {
    if (this.impForm.valid) {
      const formData = {
        ...this.impForm.value,
        datadinascita: this.correctDateForBackend(this.impForm.value.datadinascita)
      };

      if (this.data) {
        this._impiegatoService.updateImpiegato(this.data.id, formData).subscribe({
          next: () => {
            this._coreService.openSnackBar('Impiegato aggiornato!');
            this._dialogRef.close(true);
          },
          error: (err) => console.error(err),
        });
      } else {
        this._impiegatoService.addImpiegato(formData).subscribe({
          next: () => {
            this._coreService.openSnackBar('Impiegato aggiunto correttamente!');
            this._dialogRef.close(true);
          },
          error: (err) => console.error(err),
        });
      }
    }
  }
}
