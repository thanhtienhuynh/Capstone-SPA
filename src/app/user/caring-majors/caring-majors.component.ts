import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MajorBasedUserMajorDetail, TrainingProgramGroupByMajorDataSet, UniversityGroupByTrainingProgramDataSet } from 'src/app/_models/major-based-user-major-detail';
import { SelectedUserMajorDetail } from 'src/app/_models/selected-user-major-detail';
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
  majorBasedUserMajorDetails: MajorBasedUserMajorDetail[];
  errors: string[];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadMajorBasedUserMajorDetails());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.majorBasedUserMajorDetails = userState.majorBasedUserMajorDetails;
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
    console.log(majorId);
  }

  onDetailClick( majorBasedUserMajorDetail: MajorBasedUserMajorDetail,
                trainingProgramGroupByMajorDataSet: TrainingProgramGroupByMajorDataSet,
                universityGroupByTrainingProgramDataSet: UniversityGroupByTrainingProgramDataSet) {
    this.store.dispatch(new UserActions.SetDetailUserMajorDetail(new SelectedUserMajorDetail({
      majorBasedUserMajorDetail: majorBasedUserMajorDetail,
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
