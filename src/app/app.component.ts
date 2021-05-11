import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import * as fromApp from './_store/app.reducer';
import * as AuthActions from './authentication/store/auth.actions';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  ngAfterViewInit() {
  }
  constructor(
    private store: Store<fromApp.AppState>
  ) { }
}
  
