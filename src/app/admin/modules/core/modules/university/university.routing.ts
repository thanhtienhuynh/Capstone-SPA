import { Routes, RouterModule } from '@angular/router';
import { UniversityDetailComponent, UniversityMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: UniversityMainComponent},
  { path: 'university/:id', component: UniversityDetailComponent},  
];

export const UniversityRoutes = RouterModule.forChild(routes);
