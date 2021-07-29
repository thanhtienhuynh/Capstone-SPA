import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MajorBasedFollowingDetail, TrainingProgramGroupByMajorDataSet, UniversityGroupByTrainingProgramDataSet } from 'src/app/_models/major-based-following-detail';
import { ConfirmDialogComponent } from 'src/app/_sharings/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-caring-majors',
  templateUrl: './caring-majors.component.html',
  styleUrls: ['./caring-majors.component.scss']
})
export class CaringMajorsComponent implements OnInit {


  constructor(private store: Store<fromApp.AppState>, public dialog: MatDialog) { }
  subscription: Subscription;
  majorBasedFollowingDetails: MajorBasedFollowingDetail[];
  errors: string[];
  userActionQueue: UserActions.UserActions[] = [];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadMajorBasedFollowingDetails());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.userActionQueue = userState.actionsQueue;
          this.majorBasedFollowingDetails = userState.majorBasedFollowingDetails;
          this.errors = userState.errors;
          if (this.errors) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new UserActions.ConfirmErrors());
            });
          }
        },
        (error) => {
        }
    );
  }

  onUncaringClick(followingDetailId: number, universityName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '140px',
      disableClose: false,
      data: "Bỏ quan tâm " + universityName + "?"
    });
    dialogRef.afterClosed()
    .subscribe((response) => {
      if (response === 1) {
        this.store.dispatch(new UserActions.UncaringAction({followingDetailId: followingDetailId, uncaringType: 0}));
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
