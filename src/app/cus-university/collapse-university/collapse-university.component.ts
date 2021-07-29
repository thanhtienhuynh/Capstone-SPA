import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CusUniversity } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer'
import * as HomeActions from '../../home/store/home.actions';
import { PagedResponse } from 'src/app/_models/paged-response';
import { PageParam } from 'src/app/_params/page-param';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collapse-university',
  templateUrl: './collapse-university.component.html',
  styleUrls: ['./collapse-university.component.scss']
})
export class CollapseUniversityComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  homeActionQueue: HomeActions.HomeActions[] = [];
  universitiesPageResponse: PagedResponse<CusUniversity[]>;

  searchTerm: string = null;

  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;

  errors: string[];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new HomeActions.LoadUniversities({pageParam: new PageParam(1, 10), order: 3, searchTerm: null}));
    this.subscription = this.store.select('home').subscribe((homeState) => {
      if (this.universitiesPageResponse != homeState.universitiesPageResponse) {
        this.universitiesPageResponse = homeState.universitiesPageResponse;
        this.generatePagingButton();
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

  onSubmit() {
    console.log(this.searchTerm);
    // if (this.searchTerm != null && this.searchTerm.trim().length > 0) {
      this.store.dispatch(new HomeActions.LoadUniversities({pageParam: new PageParam(1, 10), order: 3, searchTerm: this.searchTerm}));
    // }
  }

  generatePagingButton() {
    this.firstButtonValue = -1;
    this.secondButtonValue = -1;
    this.thirdButtonValue = -1;
    this.fourthButtonValue = -1;
    this.lastButtonValue = -1;
    if (this.universitiesPageResponse) {
      if (this.universitiesPageResponse.pageNumber == 1) {
        this.secondButtonValue = 1;
        this.thirdButtonValue = this.universitiesPageResponse.totalPages >= 2 ? 2 : -1;
        this.fourthButtonValue = this.universitiesPageResponse.totalPages >= 3 ? 3 : -1;
      } else if (this.universitiesPageResponse.pageNumber > 1 && this.universitiesPageResponse.pageNumber < this.universitiesPageResponse.totalPages) {
        this.secondButtonValue = this.universitiesPageResponse.previousPage;
        this.thirdButtonValue = this.universitiesPageResponse.pageNumber;
        this.fourthButtonValue = this.universitiesPageResponse.nextPage;
      } else if (this.universitiesPageResponse.pageNumber == this.universitiesPageResponse.totalPages) {
        this.fourthButtonValue = this.universitiesPageResponse.pageNumber;
        this.thirdButtonValue = this.universitiesPageResponse.pageNumber - 1;
        this.secondButtonValue = this.universitiesPageResponse.pageNumber - 2;
      }
      if (this.fourthButtonValue != this.universitiesPageResponse.totalPages &&
        this.thirdButtonValue != this.universitiesPageResponse.totalPages &&
        this.secondButtonValue != this.universitiesPageResponse.totalPages) {
        this.lastButtonValue = this.universitiesPageResponse.totalPages;
      }

      if (this.secondButtonValue != 1 && this.thirdButtonValue != 1 && this.fourthButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadUniversities({pageParam: new PageParam(pageNumber), searchTerm: null, order: 3}));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
