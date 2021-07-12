import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { AddSubjectGroupModalComponent, MajorConfigurationModalComponent } from './components';
import { MajorConfigurationRoutes } from './major-configuration.routing';
import { MajorConfigCreateComponent, MajorConfigDetailComponent, MajorConfigFatherComponent, MajorConfigMainComponent } from './pages';

const COMPONENTS = [
  MajorConfigurationModalComponent,
  AddSubjectGroupModalComponent
];

const PAGES = [
  MajorConfigFatherComponent,
  MajorConfigMainComponent,
  MajorConfigCreateComponent,
  MajorConfigDetailComponent
] ;

@NgModule({
  imports: [
    SharedModule.forChild(),
    MajorConfigurationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class MajorConfigurationModule { }
