import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UniversityBasedFollowingDetail } from 'src/app/_models/university-based-following-detail';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-caring-universities',
  templateUrl: './caring-universities.component.html',
  styleUrls: ['./caring-universities.component.scss']
})
export class CaringUniversitiesComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  universityBasedFollowingDetails: UniversityBasedFollowingDetail[];
  errors: string[];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadUniversityBasedFollowingDetails());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
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
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
