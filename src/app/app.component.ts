import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import * as fromApp from './_store/app.reducer';
import * as AuthActions from './authentication/store/auth.actions';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.setupTitleListener();
  }

  ngAfterViewInit() {
  }
  constructor(
    private store: Store<fromApp.AppState>,
    private readonly title: Title,
    private readonly router: Router
  ) { }

  private setupTitleListener() {
    this.router.events.pipe(
      filter(ev => ev instanceof ResolveEnd)
    ).subscribe((ev: ResolveEnd) => {
      console.log(ev)
      const { data } = this.getDeepestChildSnapshot(ev.state.root);
      console.log(data.title, 'this is data');
      if(data && data.title){
        this.title.setTitle(data.title)
      }
    })
  }

  private getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild !== null) {
      console.log(deepestChild, 'deepestChild');
      deepestChild = deepestChild.firstChild;
    }
    return deepestChild || snapshot;
  }
}


