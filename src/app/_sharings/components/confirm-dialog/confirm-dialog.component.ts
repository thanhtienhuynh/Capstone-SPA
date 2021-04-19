import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { University } from 'src/app/_models/university';
import * as fromApp from '../../../_store/app.reducer';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as Consts from '../../../_common/constants';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close(Consts.DIALOG_CANCEL_OPTION);
  }

  onConfirmClick(): void {
    this.dialogRef.close(Consts.DIALOG_CONFIRM_OPTION);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
