import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ruoli: any[] = [];  
  ufficio: any[] = [];

  education: string[] = [
    'Matricola',
    'Diploma',
    'Laurea Triennale',
    'Laurea Magistrale',
    'Dottorato',
  ];

  constructor(
    private _fb: FormBuilder,
    private _impiegatoService: ImpiegatoService,
    private _dialogRef: MatDialogRef<AggModImpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
  ) {
    this.impForm = this._fb.group({
      id: 0,
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      datadinascita: ['', Validators.required],
      genere: ['', Validators.required],
      istruzione: ['', Validators.required],
      azienda: [''],
      esperienza: [''],
      ral: [0],
      ruolo_id: [null, Validators.required], 
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
        this.ufficio = Array.isArray(res.data) ? res.data : [];
      },
      error: (err) => console.error("Errore nel recupero degli uffici:", err)
    });

    this._impiegatoService.getRuoli().subscribe({
      next: (res) => {
        this.ruoli = Array.isArray(res.data) ? res.data : [];
      },
      error: (err) => console.error("Errore nel recupero dei ruoli:", err)
    });
  }

  onFormSubmit() {
    if (this.impForm.valid) {
      const formData = {
        ...this.impForm.value,
        datadinascita: this.correctDateForBackend(this.impForm.value.datadinascita)
      };

      const request = this.data
        ? this._impiegatoService.updateImpiegato(this.data.id, formData)
        : this._impiegatoService.addImpiegato(formData);

      request.subscribe({
        next: () => {
          this._coreService.openSnackBar(this.data ? 'Impiegato aggiornato!' : 'Impiegato aggiunto correttamente!');
          this.closeDialogSafely();
        },
        error: (err) => console.error(err),
      });
    }
  }

  closeDialogSafely() {
    setTimeout(() => {
      this._dialogRef.close(true);
    }, 100);
  }

  correctDateForBackend(date: any): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
    return parsedDate.toISOString().split('T')[0];
  }

  correctDateForInput(date: string | null): Date | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
}
