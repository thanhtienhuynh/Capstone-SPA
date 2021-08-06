import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../_store/app.reducer';
import { Subscription } from 'rxjs';
import * as AuthActions from '../authentication/store/auth.actions';
import * as UserActions from '../user/store/user.actions';
import { User } from '../_models/user';
import { CollapseArticle } from '../_models/collapse-article';
import { Router } from '@angular/router';
import { PagedResponse } from '../_models/paged-response';
import { NotificationDataSet } from '../_models/notification';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { ROLE_STUDENT } from '../_common/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport)
  viewPort: CdkVirtualScrollViewport;

  constructor(private store: Store<fromApp.AppState>, private router: Router,
    private scrollDispatcher: ScrollDispatcher,) { }

  subscription: Subscription;
  userSubscription: Subscription;
  user: User;
  isOpen = false;
  caringArticles: CollapseArticle[];
  pagedNotifications: PagedResponse<NotificationDataSet[]>;
  notifications: NotificationDataSet[];
  notiArticleIds: number[];
  countUnread: number = 0;

  ngOnInit() {
    // const channel = new BroadcastChannel('sw-messages');
    // channel.addEventListener('message', event => {
    //   this.store.dispatch(new UserActions.LoadNotifications());
    // });
    this.subscription = this.store.select('auth').subscribe((authState) => {
        if (this.user != authState.user) {
          this.user = authState.user;
          // if (this.user) {
          //   this.store.dispatch(new UserActions.LoadCaringArticles());
          // }
          if (this.user && this.user.roleId == ROLE_STUDENT) {
            this.store.dispatch(new UserActions.LoadNumberOfUnreadNotifications());
          }
        }
    });
    this.userSubscription = this.store.select('user').subscribe((userState) => {
      if (this.caringArticles != userState.caringArticles) {
        this.caringArticles = userState.caringArticles;
      }
      if (this.countUnread != userState.countUnread) {
        this.countUnread = userState.countUnread;
      }
      this.notifications = userState.notifcationtions;
      if (this.pagedNotifications != userState.pagedNotifications) {
        this.pagedNotifications = userState.pagedNotifications;
      }
      if (this.notiArticleIds != userState.notiArticleIds) {
        this.notiArticleIds = userState.notiArticleIds;
      }
    });
  }


  // ngAfterViewInit(): void {
  //   this.scrollDispatcher.scrolled().pipe(
  //     filter(event => this.viewPort.getRenderedRange().end === this.viewPort.getDataLength())
  //   ).subscribe(event => {
  //     this.store.dispatch(new UserActions.LoadMoreNotifications());

  //   })
  // }

  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  notiClick(noti: NotificationDataSet) {
    this.isOpen = false;
    if (!noti.isRead) {
      this.store.dispatch(new UserActions.MarkAsRead(noti.id));
    }
    switch(noti.type) {
      case 2:
        this.router.navigate(['/customer/user/caring-majors/' + noti.data.toString()]);
        break;
      case 1:
        this.router.navigate(['/customer/home/' +  noti.data.toString()]);
        break;
      default:
        return;
    }
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
      this.store.dispatch(new UserActions.LoadNotifications());
    }
  }

  handler(e) {
    var endData = this.viewPort.getRenderedRange().end;
    console.log("End Data: ", endData);
    const total = this.viewPort.getDataLength();
    console.log("Data Length: ", total);
    console.log(e);
    if (e == (total - 5) && this.pagedNotifications.pageNumber < this.pagedNotifications.totalPages ) {
      this.store.dispatch(new UserActions.LoadMoreNotifications());
    }
  }

  markAsAllRead() {
    this.store.dispatch(new UserActions.MarkAsAllRead());
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
