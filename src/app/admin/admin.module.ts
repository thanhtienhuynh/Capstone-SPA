import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutes } from './admin.routing';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SharedModule } from './shared/shared.module';



@NgModule({
  imports: [
    SharedModule.forRoot(),    
    // SharedModule.forChild(),    
    AdminRoutes
  ],
  declarations: [AdminComponent],  
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  // ]
})
export class AdminModule { }
