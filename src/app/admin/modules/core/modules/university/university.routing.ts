import { Routes, RouterModule } from '@angular/router';
import { UniDetailComponent, UniversityDetailComponent, UniversityMainComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: UniversityMainComponent
  },  
  { path: 'details/:id', component: UniDetailComponent },
];

export const UniversityRoutes = RouterModule.forChild(routes);
