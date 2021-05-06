import { Routes, RouterModule } from '@angular/router';
import { StepperComponent } from '../major-suggestion-stepper/stepper/stepper.component';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, children: [
      { path: '', pathMatch: 'full' ,redirectTo: 'home' },
      { path: 'home', loadChildren: () => import('../home/home.module').then((m) => m.HomeModule)},
      { path: 'stepper', component: StepperComponent},
      { path: 'user', loadChildren: () => import('../user/user.module').then((m) => m.UserModule)},
    ]
  },
  
];

export const CustomerRoutes = RouterModule.forChild(routes);
