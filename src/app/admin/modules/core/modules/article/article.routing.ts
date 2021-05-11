import { Routes, RouterModule } from '@angular/router';
import { UniversityMainComponent } from '../university/pages';
import { ArticleDetailComponent, ArticleMainComponent } from './pages';
import { CensorshipComponent } from './pages/censorship/censorship.component';

const routes: Routes = [
  { path: '', component: ArticleMainComponent},
  { path: 'details/:id', component: ArticleDetailComponent},  
  { path: 'censor', component: CensorshipComponent},
];

export const ArticleRoutes = RouterModule.forChild(routes);
