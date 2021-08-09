import { Routes, RouterModule } from '@angular/router';
import { MajorConfigCreateComponent, MajorConfigDetailComponent, MajorConfigFatherComponent, MajorConfigMainComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'major-list'},
  {
    path: 'major-list', component: MajorConfigFatherComponent,
    data: {
      breadcrumb: 'Danh sách ngành học'
    },
    children: [
      {path: '', component: MajorConfigMainComponent},
      {path: 'new-major', component: MajorConfigCreateComponent, data: {breadcrumb: 'Thêm mới ngành vào hệ thống'}},
      {path: 'detail/:id', component: MajorConfigDetailComponent, data: {breadcrumb: 'Thông tin chi tiết ngành học'}}
    ],
  },
];

export const MajorConfigurationRoutes = RouterModule.forChild(routes);
