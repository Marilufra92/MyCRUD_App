import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private _snakBar: MatSnackBar) { }

  openSnackBar(message: any, action: string = 'OK') {
    this._snakBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
}

