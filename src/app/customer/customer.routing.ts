import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { StepperComponent } from '../major-suggestion-stepper/stepper/stepper.component';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  // { path: '', redirectTo: 'main' },
  { path: '', component: CustomerComponent, children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: HomeComponent},
      { path: 'stepper', component: StepperComponent},
      { path: 'user', loadChildren: () => import('../user/user.module').then((m) => m.UserModule)},
    ]
  },
  
];

export const CustomerRoutes = RouterModule.forChild(routes);
