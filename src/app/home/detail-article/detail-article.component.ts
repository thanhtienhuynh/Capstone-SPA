import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DetailArticle } from 'src/app/_models/detail-article';
import Swal from 'sweetalert2';
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from './../store/home.actions';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent implements OnInit {
  subscription: Subscription;
  detailAricle: DetailArticle;
  isLoading: boolean;
  errors: string[];

  constructor(private store: Store<fromApp.AppState>, private meta: Meta) { }

  ngOnInit() {
    this.subscription = this.store
      .select('home')
      .subscribe(
        (homeState) => {
          this.detailAricle = homeState.detailSelectedArticle;
          this.isLoading = homeState.isLoading;
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

}
