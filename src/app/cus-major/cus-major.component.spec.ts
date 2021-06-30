/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CusMajorComponent } from './cus-major.component';

describe('CusMajorComponent', () => {
  let component: CusMajorComponent;
  let fixture: ComponentFixture<CusMajorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusMajorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
