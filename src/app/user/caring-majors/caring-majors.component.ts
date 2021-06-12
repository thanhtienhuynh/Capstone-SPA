import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MajorBasedFollowingDetail, TrainingProgramGroupByMajorDataSet, UniversityGroupByTrainingProgramDataSet } from 'src/app/_models/major-based-following-detail';
import { SelectedFollowingDetail } from 'src/app/_models/selected-following-detail';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-caring-majors',
  templateUrl: './caring-majors.component.html',
  styleUrls: ['./caring-majors.component.scss']
})
export class CaringMajorsComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  majorBasedFollowingDetails: MajorBasedFollowingDetail[];
  errors: string[];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadMajorBasedFollowingDetails());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
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

  onUncaringClick(majorId: number, universityId: number, trainingProramId: number) {
  }

  onDetailClick( majorBasedFollowingDetail: MajorBasedFollowingDetail,
                trainingProgramGroupByMajorDataSet: TrainingProgramGroupByMajorDataSet,
                universityGroupByTrainingProgramDataSet: UniversityGroupByTrainingProgramDataSet) {
    this.store.dispatch(new UserActions.SetDetailFollowingDetail(new SelectedFollowingDetail({
      majorBasedFollowingDetail: majorBasedFollowingDetail,
      trainingProgramGroupByMajorDataSet: trainingProgramGroupByMajorDataSet,
      universityGroupByTrainingProgramDataSet: universityGroupByTrainingProgramDataSet
    })))
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
