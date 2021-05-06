import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserDetailTestSubmission } from 'src/app/_models/user-test-submission';
import Swal from 'sweetalert2';
import * as fromApp from '../../../_store/app.reducer';
import * as UserActions from '../../store/user.actions';

@Component({
  selector: 'app-test-review',
  templateUrl: './test-review.component.html',
  styleUrls: ['./test-review.component.scss']
})
export class TestReviewComponent implements OnInit {

  subscription: Subscription;
  detailTestSubmission: UserDetailTestSubmission;
  errors: string[];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.detailTestSubmission = userState.detailTestSubmission;
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

}
