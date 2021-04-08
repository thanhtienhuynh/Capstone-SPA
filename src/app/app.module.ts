import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperComponent } from './major-suggestion-stepper/stepper/stepper.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromApp from './_store/app.reducer';
import { StepperEffects } from './major-suggestion-stepper/stepper/store/stepper.effects';
import { environment } from 'src/environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { ExamPageComponent } from './major-suggestion-stepper/exam-page/exam-page.component';
import { ResultDialogComponent } from './major-suggestion-stepper/exam-page/result-dialog/result-dialog.component';
import { CountdownModule } from 'ngx-countdown';
import { TestCardComponent } from './major-suggestion-stepper/exam-page/test-card/test-card.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SafeHtmlPipe } from './_helper/safe-html-pipe';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
import { AuthService } from './admin/services';
import { ShortenPipe } from './_helper/shorten-pipe';
import { ProgressSpinnerComponent } from './_sharings/components/progress-spinner/progress-spinner.component';
import { AuthEffects } from './authentication/store/auth.affects';
import { AuthInterceptorService } from './_helper/auth-interceptor.service';
import { MaterialModule } from './_sharings/shared.module';
import { UserEffects } from './user/store/user.effects';
import { SafeUrlPipe } from './_helper/safe-url-pipe';
import { SubmitDialogComponent } from './major-suggestion-stepper/exam-page/submit-dialog/submit-dialog.component';
import { ToArrayPipe } from './_helper/to-array-pipe';
import { RouterModule } from '@angular/router';


registerLocaleData(vi);
@NgModule({
  declarations: [								
    AppComponent,
    StepperComponent,
    ExamPageComponent,
    ResultDialogComponent,
    TestCardComponent,
    HomeComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    ShortenPipe,
    ProgressSpinnerComponent,
    SubmitDialogComponent,
    HeaderComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,        
    FlexLayoutModule,           
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([StepperEffects, AuthEffects, UserEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    
    AppRoutingModule,
    CountdownModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,

    FormsModule,
    ReactiveFormsModule,
    CommonModule,  
    MaterialModule,
    // RouterModule 
  ],
  providers: [AuthService, { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
