import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CollapseArticle } from '../_models/collapse-article';
import { PagedResponse } from '../_models/paged-response';
import { PageParam } from '../_params/page-param';
import * as fromApp from '../_store/app.reducer';
import * as HomeActions from './store/home.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  isLoading: boolean;
  authSubscription: Subscription;
  isAuthLoading: boolean;
  constructor(private store: Store<fromApp.AppState>) { 
    
  }

  ngOnInit() {
    this.subscription = this.store
      .select('home')
      .subscribe(
        (homeState) => {
          this.isLoading = homeState.isLoading;
        },
        (error) => {
        }
      );
    this.authSubscription = this.store
      .select('auth')
      .subscribe(
        (authState) => {
          this.isAuthLoading = authState.isLoading;
        },
        (error) => {
        }
      );
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
