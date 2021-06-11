/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CaringMajorsComponent } from './caring-majors.component';

describe('CaringMajorsComponent', () => {
  let component: CaringMajorsComponent;
  let fixture: ComponentFixture<CaringMajorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaringMajorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaringMajorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
