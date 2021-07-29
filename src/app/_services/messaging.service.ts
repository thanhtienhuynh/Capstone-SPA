import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import * as fromApp from '../_store/app.reducer';
import * as UserActions from '../user/store/user.actions';
import * as AuthActions from '../authentication/store/auth.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging,
    private store: Store<fromApp.AppState>,
    private notification: NzNotificationService,
    private router: Router) {
  }

  openSnackBar(payload: any) {
    this.notification.info(
      payload.notification.title,
      payload.notification.body,
      { nzPlacement: 'bottomRight',
        nzDuration: 100000,
      },
    ).onClick.subscribe((data) => {
      switch(payload.data.type) {
        case '2':
          this.router.navigate(['/customer/user/caring-majors/' + payload.data.data]);
          break;
        case '1':
          this.router.navigate(['/customer/home/' + payload.data.data]);
          break;
        case '3':
          this.router.navigate(['/customer/university/' + payload.data.data]);
          break;
        default:
          return;
      }
    });
  }

  requestPermission(topic: string) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.subscribeTokenToTopic(token, topic);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      this.currentMessage.next(payload);
      this.store.dispatch(new UserActions.LoadNumberOfUnreadNotifications());
      this.openSnackBar(payload);
    });
  }

  subscribeTokenToTopic(token, topic) {
    this.store.dispatch(new AuthActions.SetRegisterToken(token));
    // fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
    //   method: 'POST',
    //   headers: new Headers({
    //     'Authorization': 'key='+ 'AAAAE_JqN24:APA91bGgRVJXDsnc3cD70Wfi9iznOCqjlB-3v1ZjbS1fg_Ld3LarGo4JHopQLRlYvaWk0eWBe_SfrL7jiPhYzoQf20FJVX0mhon_9aoiXfNUnZzfnAlmg3MZIDmgucPUNrO3Q7jyyxjV'
    //   })
    // }).then(response => {
    //   if (response.status < 200 || response.status >= 400) {
    //     throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
    //   }
    //   console.log('Subscribed to "'+topic+'"');
    // }).catch(error => {
    //   console.error(error);
    // })
  }

}
