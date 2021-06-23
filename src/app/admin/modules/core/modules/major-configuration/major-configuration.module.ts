import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { AddSubjectGroupModalComponent, MajorConfigurationModalComponent } from './components';
import { MajorConfigurationRoutes } from './major-configuration.routing';
import { MajorConfigMainComponent } from './pages';

const COMPONENTS = [
  MajorConfigurationModalComponent
];

const PAGES = [
  MajorConfigMainComponent,
  AddSubjectGroupModalComponent
] ;

@NgModule({
  imports: [
    SharedModule.forChild(),
    MajorConfigurationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class MajorConfigurationModule { }
