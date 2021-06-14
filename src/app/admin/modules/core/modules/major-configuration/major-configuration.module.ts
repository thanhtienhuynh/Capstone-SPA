import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { MajorConfigurationRoutes } from './major-configuration.routing';
import { MajorConfigMainComponent } from './pages';

const COMPONENTS = [
  
];

const PAGES = [
  MajorConfigMainComponent
] ;

@NgModule({
  imports: [
    SharedModule.forChild(),
    MajorConfigurationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class MajorConfigurationModule { }
