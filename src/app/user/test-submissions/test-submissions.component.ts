import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';
import { UserTestSubmission } from '../../_models/user-test-submission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-submissions',
  templateUrl: './test-submissions.component.html',
  styleUrls: ['./test-submissions.component.scss']
})
export class TestSubmissionsComponent implements OnInit, OnDestroy {
  dateStart = new FormControl(new Date((new Date().getTime() - 3888000000)))
  dateEnd = new FormControl(new Date())
  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  testSubmissions: UserTestSubmission[];
  errors: string[];
  isLoading: boolean;

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadSubmissions());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.testSubmissions = userState.testSubmissions;
          this.errors = userState.errors;
          this.isLoading = userState.isLoading;
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

  testReviewClick(id: number) {
    this.store.dispatch(new UserActions.LoadDetailSubmission(id));
  }

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
