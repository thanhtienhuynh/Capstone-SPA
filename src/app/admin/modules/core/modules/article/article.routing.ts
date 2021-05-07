import { Routes, RouterModule } from '@angular/router';
import { UniversityMainComponent } from '../university/pages';
import { ArticleDetailComponent, ArticleMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: ArticleMainComponent},
  { path: 'details/:id', component: ArticleDetailComponent},
];

export const ArticleRoutes = RouterModule.forChild(routes);
