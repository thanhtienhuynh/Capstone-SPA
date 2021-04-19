import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AnswerComponent } from '../major-suggestion-stepper/exam-page/answer/answer.component';
import { ToArrayPipe } from '../_helper/to-array-pipe';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

const materialModules = [
  MatNativeDateModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatStepperModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatButtonModule,
  MatRadioModule,
  MatDividerModule,
  MatGridListModule,
  MatCardModule,
  MatDialogModule,  
  MatSelectModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  RouterModule
];

@NgModule({
  declarations: [
    AnswerComponent,
    ToArrayPipe,
    AuthenticationComponent,
    ConfirmDialogComponent,
    LoginDialogComponent
  ],
  imports: [
    ...materialModules,
    CommonModule
  ],
  exports: [
    ...materialModules,
    AnswerComponent,
    ToArrayPipe,
    AuthenticationComponent,
    ConfirmDialogComponent,
    LoginDialogComponent
  ],
})
export class MaterialModule {
}