import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminarComponent } from './terminar.component';

describe('TerminarComponent', () => {
  let component: TerminarComponent;
  let fixture: ComponentFixture<TerminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
