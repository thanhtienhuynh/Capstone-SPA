import { Routes, RouterModule } from '@angular/router';
import { CusUniversityComponent } from '../cus-university/cus-university.component';
import { StepperComponent } from '../major-suggestion-stepper/stepper/stepper.component';
import { AuthGuard } from '../_helper/auth.guard';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, children: [
      { path: '', pathMatch: 'full' ,redirectTo: 'home' },
      { path: 'home', loadChildren: () => import('../home/home.module').then((m) => m.HomeModule)},
      { path: 'university', loadChildren: () => import('../cus-university/cus-university.module').then((m) => m.CusUniversityModule)},
      { path: 'test', loadChildren: () => import('../cus-test/cus-test.module').then((m) => m.CusTestModule)},
      { path: 'major', loadChildren: () => import('../cus-major/cus-major.module').then((m) => m.CusMajorModule)},
      { path: 'stepper', component: StepperComponent},
      { path: 'user',  canActivate: [AuthGuard],  data: { isAdmin: false }, loadChildren: () => import('../user/user.module').then((m) => m.UserModule)},
    ]
  },
  
];

export const CustomerRoutes = RouterModule.forChild(routes);
