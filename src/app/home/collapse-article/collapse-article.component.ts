import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CollapseArticle, HomeArticle } from 'src/app/_models/collapse-article';
import { PagedResponse } from 'src/app/_models/paged-response';
import { PageParam } from 'src/app/_params/page-param';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from './../store/home.actions';

@Component({
  selector: 'app-collapse-article',
  templateUrl: './collapse-article.component.html',
  styleUrls: ['./collapse-article.component.scss']
})
export class CollapseArticleComponent implements OnInit {
  @ViewChild('viewAllEl', {static: false}) viewAllFrame: ElementRef;
  @ViewChild('hotNewsFrame', {static: false}) hotNewsFrame: ElementRef;
  @ViewChild('todayNewsFrame', {static: false}) todayNewsFrame: ElementRef;
  @ViewChild('pastNewsFrame', {static: false}) pastNewsFrame: ElementRef;

  subscription: Subscription;
  collapseArticlesPageResponse: PagedResponse<CollapseArticle[]>;
  homeArticles: HomeArticle[];
  isViewAll: boolean = false;
  //check view khi chuyển từ tab view all sang các tab còn lại
  type: number = 0;
  homeActionQueue: HomeActions.HomeActions[] = [];
  errors: string[];
  searchTerm: string;
  constructor(private store: Store<fromApp.AppState>) { 
    
  }

  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;

  ngOnInit() {
    this.store.dispatch(new HomeActions.LoadTopArticles());
    this.subscription = this.store
      .select('home')
      .subscribe(
        (homeState) => {
          if (this.collapseArticlesPageResponse != homeState.collapseArticlesPageResponse) {
            this.collapseArticlesPageResponse = homeState.collapseArticlesPageResponse;
            if (this.isViewAll) {
              this.generatePagingButton()
              // this.viewAllEl.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }
          }
          this.homeArticles = homeState.homeArticles;
          this.homeActionQueue = homeState.actionsQueue;
          this.errors = homeState.errors;
          if (this.errors) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new HomeActions.ConfirmErrors());
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

  ngAfterViewChecked(){
    if (this.isViewAll) {
      this.viewAllFrame.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    } else if (this.type == 1) {
      this.hotNewsFrame.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      this.type = 0;
    } else if (this.type == 2) {
      this.todayNewsFrame.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      this.type = 0;
    } else if (this.type == 3) {
      this.pastNewsFrame.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      this.type = 0;
    }
  }
  
  scrollToElement($element, type): void {
    this.isViewAll = false;
    this.type = type;
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  viewAll() {
    this.store.dispatch(new HomeActions.LoadCollapseArticles({pageParam: new PageParam(), searchTerm: this.searchTerm}));
    this.isViewAll = true;
  }

  onSearch() {
    this.store.dispatch(new HomeActions.LoadCollapseArticles({pageParam: new PageParam(1, 10), searchTerm: this.searchTerm}));
    this.isViewAll = true;
  }

  generatePagingButton() {
    this.firstButtonValue = -1;
    this.secondButtonValue = -1;
    this.thirdButtonValue = -1;
    this.fourthButtonValue = -1;
    this.lastButtonValue = -1;
    if (this.collapseArticlesPageResponse) {
      if (this.collapseArticlesPageResponse.pageNumber == 1) {
        this.secondButtonValue = 1;
        this.thirdButtonValue = this.collapseArticlesPageResponse.totalPages >= 2 ? 2 : -1;
        this.fourthButtonValue = this.collapseArticlesPageResponse.totalPages >= 3 ? 3 : -1;
      } else if (this.collapseArticlesPageResponse.pageNumber > 1 && this.collapseArticlesPageResponse.pageNumber < this.collapseArticlesPageResponse.totalPages) {
        this.secondButtonValue = this.collapseArticlesPageResponse.previousPage;
        this.thirdButtonValue = this.collapseArticlesPageResponse.pageNumber;
        this.fourthButtonValue = this.collapseArticlesPageResponse.nextPage;
      } else if (this.collapseArticlesPageResponse.pageNumber == this.collapseArticlesPageResponse.totalPages) {
        this.fourthButtonValue = this.collapseArticlesPageResponse.pageNumber;
        this.thirdButtonValue = this.collapseArticlesPageResponse.pageNumber - 1;
        this.secondButtonValue = this.collapseArticlesPageResponse.pageNumber - 2;
      }
      if (this.fourthButtonValue != this.collapseArticlesPageResponse.totalPages &&
        this.thirdButtonValue != this.collapseArticlesPageResponse.totalPages &&
        this.secondButtonValue != this.collapseArticlesPageResponse.totalPages) {
        this.lastButtonValue = this.collapseArticlesPageResponse.totalPages;
      }

      if (this.secondButtonValue != 1 && this.thirdButtonValue != 1 && this.fourthButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadCollapseArticles({pageParam: new PageParam(pageNumber), searchTerm: this.searchTerm}));
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}