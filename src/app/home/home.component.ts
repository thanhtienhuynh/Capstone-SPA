import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../_store/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  isLoading: boolean = false;
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
