import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-course.html',
  styleUrl: './select-course.css'
})
export class SelectCourseComponent {

  private supabase = inject(SupabaseService);
  private router = inject(Router);

  courses = [
    'Sistemas para Internet',
    'Engenharia Mecatrônica',
    'Engenharia Mecânica',
    'Engenharia Civil',
    'Não tenho curso'
  ];

  selectedCourse: string = '';

  selectCourse(course: string) {
    this.selectedCourse = course;
  }

  async save() {
   const { data } = await this.supabase.supabase.auth.getUser();
   const user = data?.user;

    if (!user) return;

    await this.supabase.supabase
      .from('profiles')
      .update({
        curso: this.selectedCourse
      })
      .eq('id', user.id);

    this.router.navigate(['/home']);
  }
}
