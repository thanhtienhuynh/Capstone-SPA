import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../_store/app.reducer';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import * as AuthActions from '../authentication/store/auth.actions';
import * as UserActions from '../user/store/user.actions';
import { User } from '../_models/user';
import { CollapseArticle } from '../_models/collapse-article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  subscription: Subscription;
  userSubscription: Subscription;
  user: User;
  isOpen = false;
  caringArticles: CollapseArticle[];
  notiArticleIds: number[];

  ngOnInit() {
    const channel = new BroadcastChannel('sw-messages');
    channel.addEventListener('message', event => {
      this.store.dispatch(new UserActions.LoadCaringArticles());
      this.store.dispatch(new UserActions.SetNotificationArticleIds(parseInt(event.data)));
    });
    this.subscription = this.store.select('auth').subscribe((authState) => {
        if (this.user != authState.user) {
          this.user = authState.user;
          // if (this.user) {
          //   this.store.dispatch(new UserActions.LoadCaringArticles());
          // }
        }
    });
    this.userSubscription = this.store.select('user').subscribe((userState) => {
      if (this.caringArticles != userState.caringArticles) {
        this.caringArticles = userState.caringArticles;
      }
      if (this.notiArticleIds != userState.notiArticleIds) {
        this.notiArticleIds = userState.notiArticleIds;
      }
    });
  }

  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  articleClick(id: number) {
    this.router.navigate(['/customer/home/' + id.toString()]);
  }

  isNew(id: number) {
    let isNew = false;
    if (this.notiArticleIds && this.notiArticleIds.length > 0) {
      isNew =  this.notiArticleIds.includes(id);
    }
    return isNew;
  }

  viewNoti() {
    this.isOpen = !this.isOpen;
    if (this.user && this.isOpen) {
      this.store.dispatch(new UserActions.LoadCaringArticles());
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
