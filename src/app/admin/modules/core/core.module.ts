import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NavComponent, ContentComponent, IdentificationComponent } from './components';
import { CoreRoutes } from './core.routing';
import { LayoutComponent } from './pages';

const COMPONENTS = [
  NavComponent,
  ContentComponent,
  IdentificationComponent
];
const PAGES = [
  LayoutComponent
];

@NgModule({
  imports: [
    SharedModule.forChild(),
    CoreRoutes
  ],
  declarations: [
    ...PAGES,
    ...COMPONENTS
  ]
})
export class CoreModule { }
