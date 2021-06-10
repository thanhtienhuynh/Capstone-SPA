import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailComponent, ArticleMainComponent, PublishedComponent } from './pages';
import { CensorshipComponent } from './pages/censorship/censorship.component';

const routes: Routes = [
  { path: '', component: ArticleMainComponent},
  { path: 'details/:id', component: ArticleDetailComponent},  
  { path: 'censor', component: CensorshipComponent},
  { path: 'published', component: PublishedComponent},
];

export const ArticleRoutes = RouterModule.forChild(routes);
