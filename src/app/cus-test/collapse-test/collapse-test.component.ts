import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../../home/store/home.actions';
import { PageParam } from 'src/app/_params/page-param';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import { PagedResponse } from 'src/app/_models/paged-response';

@Component({
  selector: 'app-collapse-test',
  templateUrl: './collapse-test.component.html',
  styleUrls: ['./collapse-test.component.scss']
})
export class CollapseTestComponent implements OnInit, OnDestroy {
  subjectMap = new Map([
    ["math", "TOÁN",],
    ["english", "ANH VĂN"],
    ["physics", "VẬT LÝ"],
    ["chemistry", "HÓA HỌC"],
    ["biography", "SINH HỌC"],
    ["history", "LỊCH SỬ"],
    ["geography", "ĐỊA LÝ"],
    ["civic-education", "GDCD"],
  ]); 
  subjecIdtMap = new Map<string, number>([
    ["math", 1,],
    ["english", 5],
    ["physics", 3],
    ["chemistry", 4],
    ["biography", 6],
    ["history", 8],
    ["geography", 7],
    ["civic-education", 10],
  ]); 
  subscription: Subscription;
  testsPagedResponse: PagedResponse<Test[]>;
  subject: string;
  subjectName: string;
  isLoading: boolean;
    
  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;
  constructor(private store: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subject = this.activatedRoute.snapshot.params['subject-name'];
    this.subjectName = this.subjectMap.get(this.subject);
    this.store.dispatch(new HomeActions.ResetState());
    this.store.dispatch(new HomeActions.LoadCollapseTests({pageParam: new PageParam(1, 10), searchTerm: null, subjectId:  this.subjecIdtMap.get(this.subject)}));
    this.subscription = this.store.select('home').subscribe(homeState => {
      this.isLoading = homeState.isLoading;
      if (this.testsPagedResponse != homeState.collapseTestsPageResponse) {
        this.testsPagedResponse = homeState.collapseTestsPageResponse;
        if (this.testsPagedResponse) {
          this.generatePagingButton();
        }
      }
    });
  }

  
  generatePagingButton() {
    this.firstButtonValue = -1;
    this.secondButtonValue = -1;
    this.thirdButtonValue = -1;
    this.fourthButtonValue = -1;
    this.lastButtonValue = -1;
    if (this.testsPagedResponse) {
      if (this.testsPagedResponse.pageNumber == 1) {
        this.secondButtonValue = 1;
        this.thirdButtonValue = this.testsPagedResponse.totalPages >= 2 ? 2 : -1;
        this.fourthButtonValue = this.testsPagedResponse.totalPages >= 3 ? 3 : -1;
      } else if (this.testsPagedResponse.pageNumber > 1 && this.testsPagedResponse.pageNumber < this.testsPagedResponse.totalPages) {
        this.secondButtonValue = this.testsPagedResponse.previousPage;
        this.thirdButtonValue = this.testsPagedResponse.pageNumber;
        this.fourthButtonValue = this.testsPagedResponse.nextPage;
      } else if (this.testsPagedResponse.pageNumber == this.testsPagedResponse.totalPages) {
        this.fourthButtonValue = this.testsPagedResponse.pageNumber;
        this.thirdButtonValue = this.testsPagedResponse.pageNumber - 1;
        this.secondButtonValue = this.testsPagedResponse.pageNumber - 2;
      }
      if (this.fourthButtonValue != this.testsPagedResponse.totalPages &&
        this.thirdButtonValue != this.testsPagedResponse.totalPages &&
        this.secondButtonValue != this.testsPagedResponse.totalPages) {
        this.lastButtonValue = this.testsPagedResponse.totalPages;
      }

      if (this.secondButtonValue != 1 && this.thirdButtonValue != 1 && this.fourthButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadCollapseTests({pageParam: new PageParam(pageNumber), searchTerm: null, subjectId:  this.subjecIdtMap.get(this.subject)}));
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
