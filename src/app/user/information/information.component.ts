import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../../user/store/user.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TranscriptType } from 'src/app/_models/transcript';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  authSubscription: Subscription;

  transcriptTypes: TranscriptType[];
  user: User;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadTranscripts());
    this.subscription = this.store.select('user').subscribe((userState) => {
      if (this.transcriptTypes != userState.transcripts) {
        this.transcriptTypes = userState.transcripts;
      }
    })

    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      if (this.user != authState.user) {
        this.user = authState.user;
      }
    })
  }

  getMark(typeId: number, subjectId: number) {
    if (this.transcriptTypes) {
      let type = this.transcriptTypes.find(t => t.id == typeId);
      if (type) {
        let detail = type.transcriptDetails.find(d => d.subjectId == subjectId);
        if (detail) {
          return detail.mark;
        }
      }
    }
    return null;
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
