import { Routes, RouterModule } from '@angular/router';
import { ConfigMainComponent, ConfigMainFatherComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'configuration-list' },
  {
    path: 'configuration-list', component: ConfigMainFatherComponent,
    data: {
      breadcrumb: 'Danh các mục cấu hình'
    }, children: [
      { path: '', component: ConfigMainComponent, },            
    ]
  }, 
];

export const ConfiguarationRoutes = RouterModule.forChild(routes);
