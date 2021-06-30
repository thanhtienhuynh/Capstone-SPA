import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../../_store/app.reducer';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-detail-university-dialog',
  templateUrl: './detail-university-dialog.component.html',
  styleUrls: ['./detail-university-dialog.component.scss']
})
export class DetailUniversityDialogComponent implements OnInit {

  subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<DetailUniversityDialogComponent>,
            private store: Store<fromApp.AppState>,
            @Inject(MAT_DIALOG_DATA) public data: {}) {
  }


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
    });
  }


  onOkClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
