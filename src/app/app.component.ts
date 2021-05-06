import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import * as fromApp from './_store/app.reducer';
import * as AuthActions from './authentication/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title= '<p>Cho <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi></math> và <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>b</mi></math> là hai số thực dương thỏa mãn <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow class="MJX-TeXAtom-ORD"><msup><mi>a</mi><mn>4</mn></msup></mrow><mi>b</mi><mo>=</mo><mn>16</mn></math>. Giá trị của <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mrow class="MJX-TeXAtom-ORD"><msub><mi>log</mi><mn>2</mn></msub></mrow><mi>a</mi><mo>+</mo><mrow class="MJX-TeXAtom-ORD"><msub><mi>log</mi><mn>2</mn></msub></mrow><mi>b</mi></math>&nbsp;bằng:</p>';
  @ViewChild('hi') p: ElementRef;

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  ngAfterViewInit() {
  }
  constructor(
    private store: Store<fromApp.AppState>
  ) { }
}
  
