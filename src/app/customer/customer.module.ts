import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutes } from './customer.routing';
import { HeaderComponent } from '../header/header.component';
import { MaterialModule } from '../_sharings/shared.module';
import { MockTestRulesDialogComponent } from '../major-suggestion-stepper/mock-test-rules-dialog/mock-test-rules-dialog.component';

const PAGES = [
  CustomerComponent
]
const COMPONENTS = [  
  HeaderComponent,
  MockTestRulesDialogComponent
]
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CustomerRoutes
  ],
  declarations: [
    ...PAGES,
    ...COMPONENTS
   ]
})
export class CustomerModule { }
