import { Routes, RouterModule } from '@angular/router';
import { CusUniversityComponent } from '../cus-university/cus-university.component';
import { StepperComponent } from '../major-suggestion-stepper/stepper/stepper.component';
import { AuthGuard } from '../_helper/auth.guard';
import { CanDeactivateGuard } from '../_helper/can-deactivate-guard.service';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, children: [
      { path: '', pathMatch: 'full' ,redirectTo: 'home' },
      { path: 'home', loadChildren: () => import('../home/home.module').then((m) => m.HomeModule), data: {title: 'Trang chủ'}},
      { path: 'university', loadChildren: () => import('../cus-university/cus-university.module').then((m) => m.CusUniversityModule), data: {title: 'Trường học'}},
      { path: 'test', loadChildren: () => import('../cus-test/cus-test.module').then((m) => m.CusTestModule), data: {title: 'Luyện thi'}},
      { path: 'major', loadChildren: () => import('../cus-major/cus-major.module').then((m) => m.CusMajorModule), data: {title: 'Ngành học'}},
      { path: 'suggestion', component: StepperComponent, canDeactivate: [CanDeactivateGuard], data: {title: 'Gợi ý'}},
      { path: 'user',  canActivate: [AuthGuard],  data: { isStaff: false, title: 'Thông tin cá nhân' }, loadChildren: () => import('../user/user.module').then((m) => m.UserModule)},
    ]
  },

];

export const CustomerRoutes = RouterModule.forChild(routes);
