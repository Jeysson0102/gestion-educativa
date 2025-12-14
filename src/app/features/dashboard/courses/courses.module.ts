import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { CoursesRoutingModule } from './courses-routing.module';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component'; // Importar
import { SharedModule } from '../../../shared/shared.module'; 

@NgModule({
  declarations: [
    CourseListComponent,
    CourseDetailComponent // Declarar
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class CoursesModule { }