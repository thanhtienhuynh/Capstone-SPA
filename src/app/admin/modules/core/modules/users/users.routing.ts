import { Routes, RouterModule } from '@angular/router';
import { UserMainFatherComponent } from './pages/user-main-father/user-main-father.component';
import { UserMainComponent } from './pages/user-main/user-main.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-list' },
  {
    path: 'user-list', component: UserMainFatherComponent,
    data: {
      breadcrumb: 'Danh Sách Người Dùng'
    }, children: [
      { path: '', component: UserMainComponent, },            
      {
        path: 'details/:id', component: UserMainComponent,
        data: {
          breadcrumb: 'Chi Tiết'
        }
      },
    ]
  }, 
];

export const UsersRoutes = RouterModule.forChild(routes);
