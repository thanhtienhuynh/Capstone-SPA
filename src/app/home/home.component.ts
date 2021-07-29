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
  authSubscription: Subscription;
  isAuthLoading: boolean;
  constructor(private store: Store<fromApp.AppState>) { 
    
  }

  ngOnInit() {
    this.subscription = this.store
      .select('home')
      .subscribe(
        (homeState) => {
        },
        (error) => {
        }
      );
    this.authSubscription = this.store
      .select('auth')
      .subscribe(
        (authState) => {
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
