import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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
import { CountdownModule } from 'ngx-countdown';
import { TestCardComponent } from './major-suggestion-stepper/exam-page/test-card/test-card.component';
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
import { AuthService } from './admin/services';
import { AuthEffects } from './authentication/store/auth.affects';
import { AuthInterceptorService } from './_helper/auth-interceptor.service';
import { MaterialModule } from './_sharings/shared.module';
import { UserEffects } from './user/store/user.effects';
import { SafeUrlPipe } from './_helper/safe-url-pipe';
import { SubmitDialogComponent } from './major-suggestion-stepper/exam-page/submit-dialog/submit-dialog.component';
import { HomeEffects } from './home/store/home.effects';
import { FinishTestDialogComponent } from './major-suggestion-stepper/exam-page/finish-test-dialog/finish-test-dialog.component';
import { GlobalErrorHandler } from './_helper/global-error-handler';
import { MessagingService } from './_services/messaging.service';
import { CusUniversityComponent } from './cus-university/cus-university.component';
import { CusMajorComponent } from './cus-major/cus-major.component';
import { CusTestComponent } from './cus-test/cus-test.component';
import { CanDeactivateGuard } from './_helper/can-deactivate-guard.service';
import { NgxEchartsModule } from "ngx-echarts";
import { SpectrumDialogComponent } from './major-suggestion-stepper/spectrum-dialog/spectrum-dialog.component';


registerLocaleData(vi);
@NgModule({
  declarations: [												
    AppComponent,
    StepperComponent,
    ExamPageComponent,
    FinishTestDialogComponent,
    SpectrumDialogComponent,
    TestCardComponent,
    HomeComponent,
    SubmitDialogComponent,
    CusUniversityComponent,
    CusMajorComponent,
    CusTestComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,        
    FlexLayoutModule,           
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([StepperEffects, AuthEffects, UserEffects, HomeEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AppRoutingModule,
    CountdownModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireMessagingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,  
    MaterialModule,

  ],  
  providers: [AuthService, MessagingService, { provide: NZ_I18N, useValue: vi_VN },    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
