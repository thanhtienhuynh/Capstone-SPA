import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GenernalHelperService {

  constructor() { }

  hasErrorInputValidation(controlName: string, errorName: string, inputFormGroup: FormGroup): boolean {
    if (inputFormGroup == null || inputFormGroup.controls[controlName] == null) {
      return false;
    }
    return inputFormGroup.controls[controlName].hasError(errorName);    
  }     

}
