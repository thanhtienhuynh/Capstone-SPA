import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './_helper/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'customer', pathMatch: 'full' },
  { path: 'customer', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule)},
  // { path: 'stepper', component: StepperComponent},
  // { path: 'user', loadChildren: () => import('./user/user.module').then((m) => m.UserModule)},
  // { path: 'home', component: HomeComponent},
  { path: 'admin', canActivate: [AuthGuard] ,loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)}  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
