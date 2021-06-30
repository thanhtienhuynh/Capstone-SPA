import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RankingUserInformationGroupByTranscriptType } from 'src/app/_models/ranking-user-information';
import { SelectedFollowingDetail } from 'src/app/_models/selected-following-detail';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-following-detail',
  templateUrl: './following-detail.component.html',
  styleUrls: ['./following-detail.component.scss']
})
export class FollowingDetailComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  authSubscription: Subscription;
  selectedFollowingDetail: SelectedFollowingDetail;
  rankingUserInformationGroupByRankTypes: RankingUserInformationGroupByTranscriptType[];
  errors: string[];
  isLoading: boolean;
  userId: number;

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadRankingUserInformation());
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.selectedFollowingDetail = userState.selectedFollowingDetail;
          this.rankingUserInformationGroupByRankTypes = userState.rankingUserInformationGroupByRankTypes;
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
          Swal.fire({title: 'Lỗi', text: error.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
            });
        }
    );

    this.subscription = this.store
      .select('auth')
      .subscribe(
        (authState) => {
          if (authState.user) {
            this.userId = authState.user.id;
          }
          if (this.errors) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new UserActions.ConfirmErrors());
            });
          }
        },
        (error) => {
          Swal.fire({title: 'Lỗi', text: error.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
            });
        }
    );
  }

  
  count(index: number) {
    let count = 0;
    for (let i = 0; i < this.rankingUserInformationGroupByRankTypes.length; i++) {
      if (i == index) {
        break;
      }
      count += this.rankingUserInformationGroupByRankTypes[i].rankingUserInformations.length;
    }
    return count;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
