import { Routes, RouterModule } from '@angular/router';
import { MajorConfigMainComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: MajorConfigMainComponent
  },  
];

export const MajorConfigurationRoutes = RouterModule.forChild(routes);
