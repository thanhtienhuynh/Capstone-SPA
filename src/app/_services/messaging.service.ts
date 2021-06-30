import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import * as fromApp from '../_store/app.reducer';
import * as UserActions from '../user/store/user.actions';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private store: Store<fromApp.AppState>) {
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
    this.angularFireMessaging.messages.subscribe((payload: {data: {id}}) => {
      this.currentMessage.next(payload);
      this.store.dispatch(new UserActions.LoadCaringArticles());
      this.store.dispatch(new UserActions.SetNotificationArticleIds(parseInt(payload.data.id)));
    });
  }

  subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key='+ 'AAAAE_JqN24:APA91bGgRVJXDsnc3cD70Wfi9iznOCqjlB-3v1ZjbS1fg_Ld3LarGo4JHopQLRlYvaWk0eWBe_SfrL7jiPhYzoQf20FJVX0mhon_9aoiXfNUnZzfnAlmg3MZIDmgucPUNrO3Q7jyyxjV'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
      }
      console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }
}
