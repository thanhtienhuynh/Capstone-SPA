import { Routes, RouterModule } from '@angular/router';
import { UniDetailComponent, UniversityDetailComponent, UniversityMainComponent, UniversityMainFatherComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'university-list' },
  {
    path: 'university-list', component: UniversityMainFatherComponent,
    data: {
      breadcrumb: 'Danh Sách Trường Đại Học'
    }, children: [
      { path: '', component: UniversityMainComponent, },
      {
        path: 'details/:id', component: UniDetailComponent,
        data: {
          breadcrumb: 'Chi Tiết'
        }
      },
    ]
  },  
];

export const UniversityRoutes = RouterModule.forChild(routes);
