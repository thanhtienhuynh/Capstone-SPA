import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { WaitingComponent } from '../_sharings/components/waiting/waiting.component';

@Injectable({
  providedIn: 'root'
})
export class GenernalHelperService {

  private dialogWaitingPopupRef: MatDialogRef<WaitingComponent>;

  constructor(private _dialog: MatDialog, private _router: Router,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer) { }

  openWaitingPopup(): void {
    this.dialogWaitingPopupRef = this._dialog.open(WaitingComponent, {
      disableClose: true
    });
  }
  closeWaitingPopup(): void {
    //this.dialogWaitingPopupRef.getState().
    this.dialogWaitingPopupRef.close();
  }
  hasErrorInputValidation(controlName: string, errorName: string, inputFormControl: FormGroup): boolean {
    return inputFormControl.controls[controlName].hasError(errorName);    
  }     

}
