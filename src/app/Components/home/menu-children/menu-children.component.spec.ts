import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuChildrenComponent } from './menu-children.component';

describe('MenuChildrenComponent', () => {
  let component: MenuChildrenComponent;
  let fixture: ComponentFixture<MenuChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuChildrenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
