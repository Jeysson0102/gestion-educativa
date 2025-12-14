import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CourseService, Course, Assignment } from '../services/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: false,
  template: `
    <div class="container-fluid" *ngIf="course">
      
      <div class="course-header card mb-4">
        <div class="banner"></div>
        <div class="card-body">
          <div class="flex-between">
            <div>
              <span class="badge semester-badge">{{ course.semestre || '2024-II' }}</span>
              <h1>{{ course.name }}</h1>
              <p class="text-muted">{{ course.description }}</p>
            </div>
            <div class="flex-row gap-2">
              <button *ngIf="isProfessor" class="btn btn-primary" (click)="showAssignmentModal = true">
                <span class="material-icons-round">add</span> Crear Actividad
              </button>
              <button *ngIf="isStudent && !isEnrolled" class="btn btn-primary" (click)="enroll()">
                Matricularme
              </button>
              <span *ngIf="isStudent && isEnrolled" class="badge active-enrollment">
                <span class="material-icons-round fs-xs">check_circle</span> Matriculado
              </span>
            </div>
          </div>

          <div class="course-tabs mt-4" *ngIf="isProfessor || isEnrolled">
            <div class="tab" [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">
              Contenido & Clases
            </div>
            <div class="tab" [class.active]="activeTab === 'assignments'" (click)="activeTab = 'assignments'">
              Evaluaciones
            </div>
            <div class="tab" [class.active]="activeTab === 'people'" (click)="activeTab = 'people'">
              Personas & Asistencia
            </div>
            <div class="tab" [class.active]="activeTab === 'grades'" (click)="activeTab = 'grades'">
              Calificaciones
            </div>
          </div>
        </div>
      </div>

      <div class="tab-content-area" *ngIf="isProfessor || isEnrolled">
        
        <div *ngIf="activeTab === 'content'" class="animate-enter">
          <div class="grid-layout">
            <div class="main-col">
              <div class="card p-4 mb-4">
                <h3 class="flex-between">Sílabo y Generalidades <button class="btn-icon" *ngIf="isProfessor"><span class="material-icons-round">edit</span></button></h3>
                <div class="resource-list">
                  <div class="resource-item pdf">
                    <span class="material-icons-round icon">picture_as_pdf</span>
                    <div class="info"><strong>Plan de Estudios 2024.pdf</strong><br><small>1.2 MB</small></div>
                  </div>
                  <div class="resource-item link">
                    <span class="material-icons-round icon">link</span>
                    <div class="info"><strong>Sala Zoom Recurrente</strong><br><small>Reunión semanal</small></div>
                  </div>
                </div>
              </div>

              <div class="card p-4 mb-4" *ngFor="let week of [1,2]">
                <div class="flex-between mb-3">
                  <h3>Semana {{ week }}: Fundamentos</h3>
                  <button *ngIf="isProfessor" class="btn btn-outline btn-sm">+ Recurso</button>
                </div>
                <p class="text-muted mb-3">Objetivo: Comprender los pilares básicos de la materia.</p>
                <div class="resource-list">
                  <div class="resource-item video">
                    <span class="material-icons-round icon">play_circle</span>
                    <div class="info"><strong>Clase Grabada - Sesión {{ week }}</strong><br><small>45 min</small></div>
                    <button class="btn-sm btn-primary">Ver</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-col">
               <div class="card p-4 mb-4" *ngIf="isProfessor">
                 <h4>Herramientas Docente</h4>
                 <ul class="tool-list">
                   <li><span class="material-icons-round">video_call</span> Programar Videollamada</li>
                   <li><span class="material-icons-round">upload_file</span> Importar SCORM</li>
                   <li><span class="material-icons-round">plagiarism</span> Reporte Antiplagio</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'assignments'" class="animate-enter">
           <div class="flex-between mb-4">
             <h3>Actividades Pendientes</h3>
             <div class="filters">
                <select><option>Todo</option><option>Exámenes</option><option>Tareas</option></select>
             </div>
           </div>

           <div *ngIf="assignments.length === 0" class="empty-state card">
              <span class="material-icons-round icon">assignment_late</span>
              <p>No hay actividades activas.</p>
           </div>

           <div class="card assignment-card mb-4" *ngFor="let task of assignments">
              <div class="card-body flex-between">
                <div class="task-icon">
                  <span class="material-icons-round">assignment</span>
                </div>
                <div style="flex: 1; padding: 0 1rem;">
                  <h4>{{ task.title }}</h4>
                  <p class="text-muted text-sm">{{ task.description }}</p>
                  <div class="meta-tags mt-2">
                    <span class="tag danger">Vence: {{ task.dueDate | date:'mediumDate' }}</span>
                    <span class="tag neutral" *ngIf="isProfessor">{{ task.submissionsCount || 0 }} Entregas</span>
                  </div>
                </div>
                
                <button *ngIf="isStudent" class="btn btn-outline" (click)="submitTask(task)">Subir Entrega</button>
                <button *ngIf="isProfessor" class="btn btn-primary" title="Calificar">Calificar</button>
              </div>
            </div>
        </div>

        <div *ngIf="activeTab === 'grades'" class="animate-enter">
          <div class="card p-0">
            <div class="card-header flex-between">
              <h3>Libro de Calificaciones</h3>
              <button *ngIf="isProfessor" class="btn btn-outline btn-sm">Exportar Acta (PDF)</button>
            </div>
            <table class="w-100 table-custom">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Parcial 1 (30%)</th>
                  <th>Parcial 2 (30%)</th>
                  <th>Final (40%)</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let i of [1,2,3]">
                  <td>
                    <div class="flex-row gap-2 center-y">
                       <div class="avatar-xs">E{{i}}</div> <strong>Estudiante {{i}}</strong>
                    </div>
                  </td>
                  <td>15</td>
                  <td>14</td>
                  <td>-</td>
                  <td><strong>14.5</strong></td>
                  <td><span class="status-dot green"></span> Aprobado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="activeTab === 'people'" class="animate-enter">
           <div class="flex-between mb-4">
             <h3>Lista de Clase</h3>
             <button *ngIf="isProfessor" class="btn btn-primary"><span class="material-icons-round">qr_code</span> Pasar Asistencia (QR)</button>
           </div>
           <div class="card p-4">
             <p class="text-muted">Módulo de gestión de asistencia y perfiles de estudiantes.</p>
           </div>
        </div>

      </div>

      <div *ngIf="isStudent && !isEnrolled" class="locked-state card p-5 mt-4">
         <span class="material-icons-round lock-icon">lock_person</span>
         <h2>Contenido Bloqueado</h2>
         <p>Debes completar tu matrícula para acceder al Aula Virtual.</p>
         <button class="btn btn-primary mt-3" (click)="enroll()">Confirmar Inscripción</button>
      </div>

    </div>
    
    <div class="modal-overlay" *ngIf="showAssignmentModal">
         <div class="modal-content">
            <h2>Crear Evaluación</h2>
            <form (ngSubmit)="saveAssignment()">
               <div class="mb-4">
                    <label>Título</label>
                    <input [(ngModel)]="newAssignment.title" name="title" required placeholder="Ej: Examen Final">
                </div>
                <div class="mb-4">
                    <label>Instrucciones</label>
                    <textarea [(ngModel)]="newAssignment.description" name="desc" rows="3"></textarea>
                </div>
                <div class="flex-row gap-2 mb-4">
                   <div style="flex:1">
                      <label>Fecha Límite</label>
                      <input [(ngModel)]="newAssignment.dueDate" name="date" type="date" required>
                   </div>
                   <div style="flex:1">
                      <label>Ponderación (%)</label>
                      <input type="number" placeholder="20">
                   </div>
                </div>
              <div class="flex-end gap-2" style="display: flex; justify-content: flex-end;">
                <button type="button" class="btn btn-outline" (click)="showAssignmentModal = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Publicar</button>
              </div>
            </form>
          </div>
    </div>
  `,
  styles: [`
    /* Header & Banner */
    .course-header .banner { height: 140px; background: linear-gradient(135deg, #1e293b 0%, #475569 100%); border-radius: 12px 12px 0 0; }
    .semester-badge { background: #e0e7ff; color: #4338ca; margin-bottom: 0.5rem; display: inline-block; }
    .active-enrollment { background: #dcfce7; color: #166534; padding: 0.5rem 1rem; }
    
    /* Tabs System */
    .course-tabs { display: flex; gap: 2rem; border-bottom: 1px solid #e2e8f0; margin-top: 1rem; }
    .tab { padding: 0.8rem 0; cursor: pointer; color: #64748b; font-weight: 500; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab:hover { color: #1e293b; }
    .tab.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }

    /* Layouts */
    .grid-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
    .resource-list { display: flex; flex-direction: column; gap: 1rem; }
    .resource-item { display: flex; gap: 1rem; align-items: center; padding: 0.8rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .resource-item .icon { font-size: 2rem; }
    .resource-item.pdf .icon { color: #ef4444; }
    .resource-item.video .icon { color: #2563eb; }
    .resource-item.link .icon { color: #f59e0b; }
    .info { flex: 1; font-size: 0.9rem; }

    /* Assignments */
    .assignment-card { border-left: 4px solid #2563eb; }
    .task-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 8px; display: grid; place-items: center; color: #2563eb; }
    .tag { font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-weight: 600; }
    .tag.danger { background: #fee2e2; color: #b91c1c; } .tag.neutral { background: #f1f5f9; color: #475569; }

    /* Tables */
    .table-custom { width: 100%; border-collapse: collapse; }
    .table-custom th { text-align: left; padding: 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.85rem; }
    .table-custom td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
    .avatar-xs { width: 24px; height: 24px; background: #cbd5e1; border-radius: 50%; font-size: 0.7rem; display: grid; place-items: center; color: white; }
    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
    .status-dot.green { background: #10b981; }

    /* Side Tools */
    .tool-list { list-style: none; padding: 0; margin: 0; }
    .tool-list li { display: flex; gap: 0.8rem; padding: 0.8rem; cursor: pointer; border-radius: 6px; color: #475569; transition: background 0.2s; }
    .tool-list li:hover { background: #f1f5f9; color: #2563eb; }

    .locked-state { text-align: center; background: #fafafa; border: 1px dashed #cbd5e1; }
    .lock-icon { font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem; }
    
    .animate-enter { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 900px) { .grid-layout { grid-template-columns: 1fr; } }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  assignments: Assignment[] = [];
  
  isEnrolled = false;
  userId = 0;
  activeTab = 'content'; // Control de pestañas

  showAssignmentModal = false;
  newAssignment: any = { title: '', description: '', dueDate: '' };

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  get isProfessor() { return this.auth.userRole === 'profesor' || this.auth.userRole === 'admin'; }
  get isStudent() { return this.auth.userRole === 'estudiante'; }

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id;

    if (courseId) {
      this.courseService.getById(courseId).subscribe(c => this.course = c);
      
      // Si es profe, por defecto ve Contenido.
      if (this.isProfessor) {
        this.loadAssignments(courseId);
        this.activeTab = 'content';
      } else {
        // Si es alumno, verificar matrícula
        this.courseService.checkEnrollment(courseId, this.userId).subscribe(res => {
          if (res.length > 0) {
            this.isEnrolled = true;
            this.loadAssignments(courseId);
          } else {
            this.isEnrolled = false;
          }
        });
      }
    }
  }

  enroll() {
    if (!this.course) return;
    this.courseService.enroll(this.course.id, this.userId).subscribe({
      next: () => {
        this.toast.show('¡Matrícula exitosa!', 'success');
        this.isEnrolled = true;
        this.loadAssignments(this.course!.id);
      },
      error: () => this.toast.show('Error al matricular', 'error')
    });
  }

  loadAssignments(courseId: number) {
    this.courseService.getAssignmentsByCourse(courseId).subscribe(data => this.assignments = data);
  }

  saveAssignment() {
    if(this.course) {
      const payload = { ...this.newAssignment, courseId: this.course.id, submissionsCount: 0 };
      this.courseService.createAssignment(payload).subscribe(() => {
        this.toast.show('Actividad publicada', 'success');
        this.loadAssignments(this.course!.id);
        this.showAssignmentModal = false;
        this.activeTab = 'assignments'; // Cambiar a la pestaña de evaluaciones
        this.newAssignment = { title: '', description: '', dueDate: '' };
      });
    }
  }

  submitTask(task: Assignment) {
    this.toast.show('Simulación: Archivo entregado correctamente', 'info');
  }
}