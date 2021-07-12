import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './_helper/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'customer', pathMatch: 'full' },
  { path: 'customer', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule)},
  { path: 'admin',  data: { isAdmin: true }, loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)}  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
