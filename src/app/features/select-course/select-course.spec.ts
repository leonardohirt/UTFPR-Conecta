import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCourse } from './select-course';

describe('SelectCourse', () => {
  let component: SelectCourse;
  let fixture: ComponentFixture<SelectCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
