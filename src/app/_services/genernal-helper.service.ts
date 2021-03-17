import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GenernalHelperService {

  constructor() { }

  hasErrorInputValidation(controlName: string, errorName: string, inputFormControl: FormGroup): boolean {
    if (inputFormControl == null || inputFormControl.controls[controlName] == null) {
      return false;
    }
    return inputFormControl.controls[controlName].hasError(errorName);    
  }     

}
