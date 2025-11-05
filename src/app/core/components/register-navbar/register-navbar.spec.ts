import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNavbar } from './register-navbar';

describe('RegisterNavbar', () => {
  let component: RegisterNavbar;
  let fixture: ComponentFixture<RegisterNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
