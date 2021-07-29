import { Routes, RouterModule } from '@angular/router';
import { SeasonMainComponent, SeasonMainFatherComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'season-list' },
  {
    path: 'season-list', component: SeasonMainFatherComponent,
    data: {
      breadcrumb: 'Danh Sách Các Mùa'
    }, children: [
      { path: '', component: SeasonMainComponent, }
    ]
  }, 
];

export const SeasonRoutes = RouterModule.forChild(routes);
