import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from "@angular/cdk/drag-drop";
import {
  AntModule,
  NebularModule,
  NgxModule
} from './modules';
import {
  CustomSelectComponent
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const SHARE_MODULES = [
  AntModule,
  NebularModule,
  NgxModule
];

export const ANGULAR_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  DragDropModule
  // CommonModule,  
];

const COMPONENTS = [CustomSelectComponent];
@NgModule({
  exports: [...SHARE_MODULES, ...ANGULAR_MODULES, ...COMPONENTS],
  declarations: [...COMPONENTS],
  imports: [
    ...ANGULAR_MODULES,
    ...SHARE_MODULES,
  ],
})
export class SharedModule {
  static forRoot(name: string = 'default'): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [        
        ...NebularModule.forRoot().providers,
        ...NgxModule.forRoot().providers,
      ]
    };
  }
  static forChild(name: string = 'default'): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ...NebularModule.forChild().providers,
        ...NgxModule.forChild().providers,        
      ]
    };
  }
}
