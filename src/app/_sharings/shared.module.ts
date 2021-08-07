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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AnswerComponent } from '../major-suggestion-stepper/exam-page/answer/answer.component';
import { ToArrayPipe } from '../_helper/to-array-pipe';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SafeHtmlPipe } from '../_helper/safe-html-pipe';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { ShareButtonsConfig, SharerMethod, SHARE_BUTTONS_CONFIG } from 'ngx-sharebuttons';
import { ShortenPipe } from '../_helper/shorten-pipe';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { SafeUrlPipe } from '../_helper/safe-url-pipe';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';

const customConfig: ShareButtonsConfig = {
  include: ['facebook'],
  exclude: [],
  theme: 'modern-light',
  gaTracking: true,
  autoSetMeta: true,
  prop: {
    facebook: {
      icon: ['fab', 'facebook-square']
    },
  },
  sharerMethod: SharerMethod.Window,
}

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
  RouterModule,
  MatExpansionModule,
  MatTableModule,
  MatCarouselModule,
  MatTooltipModule,
  OverlayModule,
  MatBadgeModule,
  ScrollingModule,
  MatSnackBarModule,
  NzNotificationModule,
  MatChipsModule
];

@NgModule({
  declarations: [
    AnswerComponent,
    ToArrayPipe,
    SafeHtmlPipe,
    ShortenPipe,
    AuthenticationComponent,
    ConfirmDialogComponent,
    LoginDialogComponent,
    ProgressSpinnerComponent,
    ScrollToTopComponent,
    SafeUrlPipe
  ],
  imports: [
    ...materialModules,
    CommonModule,
    ShareButtonModule.withConfig(customConfig),
  ],
  exports: [
    ...materialModules,
    AnswerComponent,
    ToArrayPipe,
    SafeHtmlPipe,
    ShortenPipe,
    AuthenticationComponent,
    ConfirmDialogComponent,
    LoginDialogComponent,
    ProgressSpinnerComponent,
    ScrollToTopComponent,
    ShareButtonModule,
    SafeUrlPipe
  ],
})
export class MaterialModule {
}