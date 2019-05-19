import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BindComponent } from './bind.component';

describe('BindComponent', () => {
  let component: BindComponent;
  let fixture: ComponentFixture<BindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
