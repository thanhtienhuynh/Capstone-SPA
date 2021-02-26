import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepperComponent } from './major-suggestion-stepper/stepper/stepper.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromApp from './_store/app.reducer';
import { StepperEffects } from './major-suggestion-stepper/stepper/store/stepper.effects';
import { environment } from 'src/environments/environment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MathModule } from './_helper/math/math.module';
import { AppRoutingModule } from './app-routing.module';
import { ExamPageComponent } from './major-suggestion-stepper/exam-page/exam-page.component';


@NgModule({
  declarations: [	
    AppComponent,
    StepperComponent,
    ExamPageComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDividerModule,
    MatGridListModule,
    MatCardModule,
    CommonModule,
    HttpClientModule,
    MatListModule,
    StoreModule.forRoot(fromApp.appReducer),
    MathModule,
    EffectsModule.forRoot([StepperEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
