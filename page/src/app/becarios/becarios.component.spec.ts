import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecariosComponent } from './becarios.component';

describe('BecariosComponent', () => {
  let component: BecariosComponent;
  let fixture: ComponentFixture<BecariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
