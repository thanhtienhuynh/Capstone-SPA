import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MajorGroupByTrainingProgramDataSet, UniversityBasedFollowingDetail } from 'src/app/_models/university-based-following-detail';
import { ConfirmDialogComponent } from 'src/app/_sharings/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-caring-universities',
  templateUrl: './caring-universities.component.html',
  styleUrls: ['./caring-universities.component.scss']
})
export class CaringUniversitiesComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>, public dialog: MatDialog) { }
  subscription: Subscription;
  universityBasedFollowingDetails: UniversityBasedFollowingDetail[];
  errors: string[];
  userActionQueue: UserActions.UserActions[] = [];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadUniversityBasedFollowingDetails());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.userActionQueue = userState.actionsQueue;
          this.universityBasedFollowingDetails = userState.universityBasedFollowingDetails;
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

  getFollowingSubjectGroups(major: MajorGroupByTrainingProgramDataSet) {
    let result = major.subjectGroupCode;
    if (major.otherSubjectGroups) {
      major.otherSubjectGroups.forEach(subjectGroup => {
        result += ", " + subjectGroup.name;
      });
    }
    return result;
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
        this.store.dispatch(new UserActions.UncaringAction({followingDetailId: followingDetailId, uncaringType: 1}));
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
