import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { University } from 'src/app/_models/university';
import * as fromApp from '../../../_store/app.reducer';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-detail-university-dialog',
  templateUrl: './detail-university-dialog.component.html',
  styleUrls: ['./detail-university-dialog.component.scss']
})
export class DetailUniversityDialogComponent implements OnInit {

  university: University;
  subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<DetailUniversityDialogComponent>,
            private store: Store<fromApp.AppState>,
            @Inject(MAT_DIALOG_DATA) public data: {university: University}) {
              this.university = data.university;
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
