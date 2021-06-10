import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SelectedUserMajorDetail } from 'src/app/_models/selected-user-major-detail';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-user-major-detail',
  templateUrl: './user-major-detail.component.html',
  styleUrls: ['./user-major-detail.component.scss']
})
export class UserMajorDetailComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  selectedUserMajorDetail: SelectedUserMajorDetail;
  errors: string[];
  isLoading: boolean;

  ngOnInit() {
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.selectedUserMajorDetail = userState.selectedUserMajorDetail;
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
