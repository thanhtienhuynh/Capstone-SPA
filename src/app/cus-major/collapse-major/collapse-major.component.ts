import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as fromApp from '../../_store/app.reducer'
import * as HomeActions from '../../home/store/home.actions';
import { PagedResponse } from 'src/app/_models/paged-response';
import { PageParam } from 'src/app/_params/page-param';
import { Store } from '@ngrx/store';
import { CusMajor, CusMajorParam } from 'src/app/_models/major';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collapse-major',
  templateUrl: './collapse-major.component.html',
  styleUrls: ['./collapse-major.component.scss']
})
export class CollapseMajorComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  homeActionQueue: HomeActions.HomeActions[] = [];
  majorPageResponse: PagedResponse<CusMajor[]>;

  searchTerm: string = null;

  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;
  errors: string[];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new HomeActions.LoadMajors({pageParam: new PageParam(1, 10), queryParam: {code: null, order: 3, name: null}}));
    this.subscription = this.store.select('home').subscribe(homeState => {
      if (this.majorPageResponse != homeState.cusMajorPageResponse) {
        this.majorPageResponse = homeState.cusMajorPageResponse;
        if (this.majorPageResponse != null && this.majorPageResponse.data != null && this.majorPageResponse.data.length > 0) {
          this.generatePagingButton();
        }
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
    this.store.dispatch(new HomeActions.LoadMajors({pageParam: new PageParam(1, 10), queryParam: {code: null, order: 3, name: this.searchTerm}}));
  }

  generatePagingButton() {
    this.firstButtonValue = -1;
    this.secondButtonValue = -1;
    this.thirdButtonValue = -1;
    this.fourthButtonValue = -1;
    this.lastButtonValue = -1;
    if (this.majorPageResponse) {
      if (this.majorPageResponse.pageNumber == 1) {
        this.secondButtonValue = 1;
        this.thirdButtonValue = this.majorPageResponse.totalPages >= 2 ? 2 : -1;
        this.fourthButtonValue = this.majorPageResponse.totalPages >= 3 ? 3 : -1;
      } else if (this.majorPageResponse.pageNumber > 1 && this.majorPageResponse.pageNumber < this.majorPageResponse.totalPages) {
        this.secondButtonValue = this.majorPageResponse.previousPage;
        this.thirdButtonValue = this.majorPageResponse.pageNumber;
        this.fourthButtonValue = this.majorPageResponse.nextPage;
      } else if (this.majorPageResponse.pageNumber == this.majorPageResponse.totalPages) {
        this.fourthButtonValue = this.majorPageResponse.pageNumber;
        this.thirdButtonValue = this.majorPageResponse.pageNumber - 1;
        this.secondButtonValue = this.majorPageResponse.pageNumber - 2;
      }
      if (this.fourthButtonValue != this.majorPageResponse.totalPages &&
        this.thirdButtonValue != this.majorPageResponse.totalPages &&
        this.secondButtonValue != this.majorPageResponse.totalPages) {
        this.lastButtonValue = this.majorPageResponse.totalPages;
      }

      if (this.secondButtonValue != 1 && this.thirdButtonValue != 1 && this.fourthButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadMajors({pageParam: new PageParam(pageNumber, 10), queryParam: {code: null, order: 3, name: this.searchTerm}}));
  }

  ngOnDestroy() {
    
    this.store.dispatch(new HomeActions.SetMajors(null));
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
