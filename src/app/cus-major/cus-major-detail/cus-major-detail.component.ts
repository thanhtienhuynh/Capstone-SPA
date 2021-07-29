import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../../home/store/home.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CusSingleMajorDetail } from 'src/app/_models/major';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-major-detail',
  templateUrl: './cus-major-detail.component.html',
  styleUrls: ['./cus-major-detail.component.scss']
})
export class CusMajorDetailComponent implements OnInit, OnDestroy {
  subsription: Subscription;
  majorDetail: CusSingleMajorDetail;
  homeActionQueue: HomeActions.HomeActions[] = [];
  errors: string[];
  constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute) { }

  ngOnInit() {

    this.store.dispatch(new HomeActions.LoadMajor(this.route.snapshot.params['id']));
    this.subsription = this.store.select('home').subscribe(homeState => {
      if (this.majorDetail != homeState.cusMajorDetail) {
        this.majorDetail = homeState.cusMajorDetail;
      }
      this.homeActionQueue = homeState.actionsQueue;
      this.errors = this.errors;
      if (this.errors && this.errors.length > 0) {
        Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
          .then(() => {
            this.store.dispatch(new HomeActions.ConfirmErrors());
          });
      }
    });
  }

  getSubjects(subjects: string[]) {
    let result = ""
    subjects.forEach((subject, index) => {
      if (index != 0) {
        result += " - "
      }
      result += subject;
    });
    return result;
  }

  ngOnDestroy() {
    this.store.dispatch(new HomeActions.SetMajor(null));
    if (this.subsription) {
      this.subsription.unsubscribe();
    }
  }

}
