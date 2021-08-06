import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import * as fromApp from "./../../_store/app.reducer";
import * as AuthActions from '../../authentication/store/auth.actions';
import * as StepperActions from '../../major-suggestion-stepper/stepper/store/stepper.actions';
import { Store } from '@ngrx/store';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';

@Component({
  selector: 'app-group-mock-test-dialog',
  templateUrl: './group-mock-test-dialog.component.html',
  styleUrls: ['./group-mock-test-dialog.component.scss']
})
export class GroupMockTestDialogComponent implements OnInit {
  
  subscription: Subscription;
  user: User;
  selectedSubjecGroup: number = 0;

  constructor(public dialogRef: MatDialogRef<GroupMockTestDialogComponent>, private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) public data: {suggestedSubjectGroups: SuggestedSubjectsGroup[]}) {
      console.log(data.suggestedSubjectGroups);
     }


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
    });
  }

  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  doTest() {
    this.store.dispatch(new StepperActions.SetSelectedSuggestedSubjectgroup(
      this.data.suggestedSubjectGroups.find(s => s.id === this.selectedSubjecGroup)));
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
