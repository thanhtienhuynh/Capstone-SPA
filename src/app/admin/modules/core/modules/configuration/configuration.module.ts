import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ConfiguarationRoutes } from './configuaration.routing';
import { ConfigMainComponent, ConfigMainFatherComponent } from './pages';

const PAGES = [
  ConfigMainFatherComponent,
  ConfigMainComponent
];
const COMPONENTS = [];
@NgModule({
  imports: [
    SharedModule.forChild(),
    ConfiguarationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class ConfigurationModule { }
