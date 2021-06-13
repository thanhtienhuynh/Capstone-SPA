import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CollapseArticle } from 'src/app/_models/collapse-article';
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
  subscription: Subscription;
  collapseArticlesPageResponse: PagedResponse<CollapseArticle[]>;
  topArticles: CollapseArticle[];
  isLoading: boolean;
  errors: string[];
  constructor(private store: Store<fromApp.AppState>) { 
    
  }

  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;

  ngOnInit() {
    this.store.dispatch(new HomeActions.LoadCollapseArticles(new PageParam()));
    this.store.dispatch(new HomeActions.LoadTopArticles());
    this.subscription = this.store
      .select('home')
      .subscribe(
        (homeState) => {
          this.collapseArticlesPageResponse = homeState.collapseArticlesPageResponse;
          this.topArticles = homeState.topCollapseArticles;
          this.isLoading = homeState.isLoading;
          this.generatePagingButton();
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

      if (this.secondButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadCollapseArticles(new PageParam(pageNumber)));
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}