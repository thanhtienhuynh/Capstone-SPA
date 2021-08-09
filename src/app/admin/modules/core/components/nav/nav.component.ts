import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/admin/services/data/shared-data.service';
import * as fromApp from '../../../../../_store/app.reducer';
import * as AuthActions from '../../../../../authentication/store/auth.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  subscription: Subscription;
  user: User;
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private _sharedDataService: SharedDataService
  ) { }

  url: string;

  ngOnInit() {
    this.url = this.router.url;
    // this._sharedDataService.currentMessage.subscribe(message => this.url = message)
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
    });
  }


  useUpdate(link?: string): void {
    if(link){
      this.router.navigate(['admin/core/' + link]);
    }
  }
}
