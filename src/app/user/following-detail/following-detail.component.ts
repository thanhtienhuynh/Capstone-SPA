import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RankingUserInformationGroupByTranscriptType, UserFollowingDetail } from 'src/app/_models/ranking-user-information';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Component({
  selector: 'app-following-detail',
  templateUrl: './following-detail.component.html',
  styleUrls: ['./following-detail.component.scss']
})
export class FollowingDetailComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute) { }
  subscription: Subscription;
  authSubscription: Subscription;
  userFollowingDetail: UserFollowingDetail;
  errors: string[];
  userId: number;
  followingDetailId: number;
  userActionQueue: UserActions.UserActions[] = [];

  ngOnInit() {
    this.followingDetailId = this.activatedRoute.snapshot.params['id'];
    this.activatedRoute.params.subscribe((params: Params) => {
      this.store.dispatch(new UserActions.LoadUserFollowingDetail(params['id']));
    });
    // this.store.dispatch(new UserActions.LoadUserFollowingDetail(this.followingDetailId));
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.userActionQueue = userState.actionsQueue;
          if (this.userFollowingDetail != userState.userFollowingDetail) {
            this.userFollowingDetail = userState.userFollowingDetail;
          }
          this.errors = userState.errors;
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

  getScoreType(typeId: number) {
    switch (typeId) {
      case 1:
        return "Điểm THPT QG";
      case 2:
        return "Điểm học bạ";
      case 3:
        return "Điểm thi thử";
      default:
        return "Không đủ điều kiện";
    }
  }
  
  count(index: number) {
    let count = 0;
    for (let i = 0; i < this.userFollowingDetail.rankingUserInformationsGroupByTranscriptType.length; i++) {
      if (i == index) {
        break;
      }
      count += this.userFollowingDetail.rankingUserInformationsGroupByTranscriptType[i].rankingUserInformations.length;
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
