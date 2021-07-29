import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NavComponent, ContentComponent, IdentificationComponent, MohsLogoComponent, ResizerComponent, MoshBreadscrumbComponent } from './components';
import { CoreRoutes } from './core.routing';
import { LayoutComponent } from './pages';

const COMPONENTS = [
  NavComponent,
  ContentComponent,
  IdentificationComponent,
  MohsLogoComponent,
  ResizerComponent,
  MoshBreadscrumbComponent
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
