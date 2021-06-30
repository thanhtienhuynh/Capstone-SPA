import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutes } from './customer.routing';
import { HeaderComponent } from '../header/header.component';
import { MaterialModule } from '../_sharings/shared.module';

const PAGES = [
  CustomerComponent
]
const COMPONENTS = [  
  HeaderComponent  
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
