import { Routes, RouterModule } from '@angular/router';
import { StepperComponent } from '../major-suggestion-stepper/stepper/stepper.component';
import { AuthGuard } from '../_helper/auth.guard';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, children: [
      { path: '', pathMatch: 'full' ,redirectTo: 'home' },
      { path: 'home', loadChildren: () => import('../home/home.module').then((m) => m.HomeModule)},
      { path: 'stepper', component: StepperComponent},
      { path: 'user',  canActivate: [AuthGuard],  data: { isAdmin: false }, loadChildren: () => import('../user/user.module').then((m) => m.UserModule)},
    ]
  },
  
];

export const CustomerRoutes = RouterModule.forChild(routes);
