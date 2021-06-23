import { Routes, RouterModule } from '@angular/router';
import { MajorConfigMainComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'major-list'},
  {
    path: 'major-list', component: MajorConfigMainComponent,
    data: {
      breadcrumb: 'Danh Sách Ngành Học'
    }
  },  
];

export const MajorConfigurationRoutes = RouterModule.forChild(routes);
