/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CusTestComponent } from './cus-test.component';

describe('CusTestComponent', () => {
  let component: CusTestComponent;
  let fixture: ComponentFixture<CusTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
