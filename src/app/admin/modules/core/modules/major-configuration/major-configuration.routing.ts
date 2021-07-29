import { Routes, RouterModule } from '@angular/router';
import { MajorConfigCreateComponent, MajorConfigDetailComponent, MajorConfigFatherComponent, MajorConfigMainComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'major-list'},
  {
    path: 'major-list', component: MajorConfigFatherComponent,    
    data: {
      breadcrumb: 'Danh Sách Ngành Học'
    },
    children: [
      {path: '', component: MajorConfigMainComponent},
      {path: 'new-major', component: MajorConfigCreateComponent, data: {breadcrumb: 'Thêm Mới Ngành Vào Hệ Thống'}},
      {path: 'detail/:id', component: MajorConfigDetailComponent, data: {breadcrumb: 'Thông Tin Chi Tiết Ngành Học'}}       
    ],    
  },  
];

export const MajorConfigurationRoutes = RouterModule.forChild(routes);
