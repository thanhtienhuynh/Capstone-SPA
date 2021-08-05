import { NgModule } from '@angular/core';
import { UsersRoutes } from './users.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { UserMainComponent, UserMainFatherComponent } from './pages';
import { UpdateUserModalComponent } from './components';


const PAGES = [
  UserMainFatherComponent,
  UserMainComponent
];

const COMPONENTS = [
  UpdateUserModalComponent
];

@NgModule({
  imports: [    
    SharedModule.forChild(),
    UsersRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class UsersModule { }
