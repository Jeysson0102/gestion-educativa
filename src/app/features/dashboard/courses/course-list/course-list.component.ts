import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: false,
  template: `
    <div class="page-header flex-between mb-4">
      <div>
        <h2 class="page-title">Catálogo de Cursos</h2>
        <p class="text-muted">Gestiona la oferta académica ({{ courses.length }} cursos activos)</p>
      </div>
      <button class="btn btn-primary" (click)="openModal()" *appHasRole="['admin']">
        <span class="material-icons-round">add</span> Nuevo Curso
      </button>
    </div>

    <div *ngIf="isLoading" style="text-align: center; padding: 3rem;">
      <span class="material-icons-round spin">autorenew</span>
      <p class="text-muted">Cargando cursos...</p>
    </div>

    <div class="courses-grid" *ngIf="!isLoading">
      <div class="card course-card" *ngFor="let c of courses">
        <div class="card-image-placeholder">
          <span class="material-icons-round">school</span>
        </div>
        <div class="card-body">
          <div class="flex-between">
            <h3>{{ c.name }}</h3>
            <span class="price-tag">S/ {{ c.price || 0 }}</span>
          </div>
          <p>{{ c.description }}</p>
          
          <div class="mt-2 text-sm text-muted">
             <span class="material-icons-round fs-xs">calendar_today</span> {{ c.semestre }}
          </div>
        </div>
        <div class="card-footer">
          <span class="badge active">Publicado</span>
          <div class="actions">
            
            <button class="icon-btn" (click)="openModal(c)" *appHasRole="['admin']" title="Editar">
              <span class="material-icons-round">edit</span>
            </button>
            <button class="icon-btn delete" (click)="deleteCourse(c)" *appHasRole="['admin']" title="Eliminar">
              <span class="material-icons-round">delete</span>
            </button>

            <button class="icon-btn" [routerLink]="['/dashboard/courses', c.id]" title="Entrar al Aula">
              <span class="material-icons-round">visibility</span>
            </button>

          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}</h2>
        <form (ngSubmit)="saveCourse()">
          <div class="form-group">
            <label>Nombre del Curso</label>
            <input [(ngModel)]="currentCourse.name" name="name" required placeholder="Ej: Angular Avanzado">
          </div>
          <div class="form-group">
            <label>Precio (S/)</label>
            <input [(ngModel)]="currentCourse.price" name="price" type="number" required placeholder="0.00">
          </div>
          <div class="form-group">
            <label>Semestre</label>
            <input [(ngModel)]="currentCourse.semestre" name="semestre" required placeholder="2024-1">
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea [(ngModel)]="currentCourse.description" name="description" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card-image-placeholder { 
      height: 120px; background: #e0e7ff; display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius-md) var(--radius-md) 0 0; margin-bottom: 0; color: var(--primary);
    }
    .card-image-placeholder span { font-size: 3rem; opacity: 0.5; }
    .card-body { padding: 1.5rem; }
    .card-body h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); }
    .price-tag { font-weight: 700; color: #2563eb; font-size: 1.1rem; }
    .card-body p { color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-footer { margin-top: auto; padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge.active { background: #dcfce7; color: #166534; }
    .actions { display: flex; gap: 0.5rem; }
    .icon-btn { background: white; border: 1px solid var(--border); border-radius: 0.5rem; cursor: pointer; color: #94a3b8; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .icon-btn:hover { color: var(--primary); border-color: var(--primary); }
    .icon-btn.delete:hover { color: var(--danger); border-color: var(--danger); }
    .fs-xs { font-size: 14px; vertical-align: text-bottom; }
    .spin { animation: spin 1s infinite linear; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  showModal = false;
  isEditing = false;
  
  currentCourse: any = { name: '', description: '', price: 0, semestre: '' };

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openModal(course?: Course) {
    this.isEditing = !!course;
    if (course) {
      this.currentCourse = { ...course };
    } else {
      this.currentCourse = { name: '', description: '', price: 0, semestre: '2024-1' };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveCourse() {
    if (this.isEditing) {
      this.courseService.update(this.currentCourse.id, this.currentCourse).subscribe(() => {
        this.loadCourses();
        this.closeModal();
      });
    } else {
      this.courseService.create(this.currentCourse).subscribe(() => {
        this.loadCourses();
        this.closeModal();
      });
    }
  }

  deleteCourse(course: Course) {
    if (confirm(`¿Eliminar curso "${course.name}"?`)) {
      this.courseService.delete(course.id).subscribe(() => this.loadCourses());
    }
  }
}