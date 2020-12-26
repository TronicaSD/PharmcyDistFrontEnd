import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmcyComponent } from './pharmcy.component';

describe('PharmcyComponent', () => {
  let component: PharmcyComponent;
  let fixture: ComponentFixture<PharmcyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmcyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmcyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
