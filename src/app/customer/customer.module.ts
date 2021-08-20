import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutes } from './customer.routing';
import { HeaderComponent } from '../header/header.component';
import { MaterialModule } from '../_sharings/shared.module';
import { MockTestRulesDialogComponent } from '../major-suggestion-stepper/mock-test-rules-dialog/mock-test-rules-dialog.component';
import { GroupMockTestDialogComponent } from '../major-suggestion-stepper/group-mock-test-dialog/group-mock-test-dialog.component';

const PAGES = [
  CustomerComponent
]
const COMPONENTS = [  
  HeaderComponent,
  MockTestRulesDialogComponent,
  GroupMockTestDialogComponent
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
