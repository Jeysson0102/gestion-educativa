import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService, AdminStats, SecurityAlert, ProfessorStats, StudentDashboard } from '../courses/services/course.service';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <div class="hero-header mb-4">
      <div class="hero-content">
        <h1 class="brand-font">Hola, {{ authService.userRole | titlecase }}</h1>
        <p>{{ getWelcomeMessage() }}</p>
      </div>
      <div class="hero-decoration">
        <span class="material-icons-round icon-bg">school</span>
      </div>
    </div>

    <div [ngSwitch]="authService.userRole">
      
      <div *ngSwitchCase="'admin'" class="animate-enter">
        <h3 class="section-title">Centro de Comando</h3>
        <div class="stats-grid mb-4" *ngIf="adminStats as stats">
           <div class="card stat-card interactive">
            <div class="icon-box blue"><span class="material-icons-round">how_to_reg</span></div>
            <div><div class="val">{{ stats.enrollmentCount | number }}</div><div class="lbl">Matrículas</div></div>
          </div>
           <div class="card stat-card interactive">
            <div class="icon-box green"><span class="material-icons-round">attach_money</span></div>
            <div><div class="val">S/ {{ stats.pendingPayments | number:'1.0-2' }}</div><div class="lbl">Deuda Pendiente</div></div>
          </div>
           <div class="card stat-card interactive">
            <div class="icon-box orange"><span class="material-icons-round">meeting_room</span></div>
            <div><div class="val">{{ stats.classroomOccupancy }}%</div><div class="lbl">Ocupación</div></div>
          </div>
           <div class="card stat-card interactive">
            <div class="icon-box purple"><span class="material-icons-round">school</span></div>
            <div><div class="val">{{ stats.averageGpa }}</div><div class="lbl">Promedio</div></div>
          </div>
        </div>

        <div class="grid-2-1">
          <div class="card p-0 h-100">
            <div class="card-header flex-between">
              <h3><span class="material-icons-round text-danger" style="vertical-align: bottom;">gpp_maybe</span> Alertas</h3>
              <button class="btn btn-outline btn-sm">Ver Logs</button>
            </div>
            <div class="alert-list">
              <div class="alert-item" *ngFor="let alert of alerts" [ngClass]="alert.severity">
                <div class="severity-indicator"></div>
                <div class="alert-content">
                  <div class="flex-between">
                    <strong>{{ alert.module | uppercase }}</strong>
                    <small>{{ alert.timestamp }}</small>
                  </div>
                  <p>{{ alert.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngSwitchCase="'estudiante'" class="animate-enter">
        <div class="stats-grid mb-4" *ngIf="studentData as data">
          <div class="card stat-card interactive">
            <div class="icon-box blue"><span class="material-icons-round">auto_stories</span></div>
            <div>
              <div class="val">{{ myCoursesCount }}</div>
              <div class="lbl">Cursos Matriculados</div>
              <small class="trend neutral">{{ data.academic.enrolledCredits }} Créditos</small>
            </div>
          </div>

          <div class="card stat-card interactive">
            <div class="icon-box purple"><span class="material-icons-round">emoji_events</span></div>
            <div>
              <div class="val">{{ data.academic.gpa }}</div>
              <div class="lbl">Promedio Ponderado</div>
              <small class="trend up">Ciclo: {{ data.academic.currentSemester }}</small>
            </div>
          </div>

          <div class="card stat-card interactive" [style.border-left]="data.finance.status === 'debt' ? '4px solid #ef4444' : '4px solid #10b981'">
            <div class="icon-box" [ngClass]="data.finance.status === 'debt' ? 'red' : 'green'">
              <span class="material-icons-round">attach_money</span>
            </div>
            <div>
              <div class="val" [class.text-danger]="data.finance.status === 'debt'">
                {{ data.finance.status === 'debt' ? 'S/ ' + data.finance.debtAmount : 'Solvente' }}
              </div>
              <div class="lbl">Estado Financiero</div>
              <small class="trend" [ngClass]="data.finance.status === 'debt' ? 'down' : 'up'">
                {{ data.finance.status === 'debt' ? 'Venció: ' + data.finance.nextPaymentDate : 'Al día' }}
              </small>
            </div>
          </div>
        </div>

        <div class="grid-2-1" *ngIf="studentData as data">
          <div class="flex-column gap-4">
            <div class="card p-4">
              <h3 class="mb-3">Mis Asignaturas</h3>
              <div class="course-list-vertical">
                <div class="card course-row interactive" *ngFor="let i of [1,2,3]">
                  <div class="course-img-sm"></div>
                  <div class="course-info">
                    <div class="flex-between">
                      <h4>Ingeniería de Software II</h4>
                      <span class="badge semester-badge">Semana 12</span>
                    </div>
                    <div class="progress-bar"><div class="fill" style="width: 75%"></div></div>
                    <div class="flex-between mt-1">
                      <small class="text-muted">Avance: 75%</small>
                      <small class="text-primary">3 Tareas pendientes</small>
                    </div>
                  </div>
                  <button class="btn-icon"><span class="material-icons-round">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-column gap-4">
            <div class="card p-4 bg-soft-red" *ngIf="data.finance.status === 'debt'">
              <div class="flex-row gap-2 center-y mb-2">
                <span class="material-icons-round text-danger">error</span>
                <strong class="text-danger">Pago Pendiente</strong>
              </div>
              <p class="text-sm mb-3">Tienes una cuota vencida de <strong>S/ {{ data.finance.debtAmount }}</strong>. Regulariza tu situación para evitar bloqueos.</p>
              <button class="btn btn-primary w-100">Pagar Ahora</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngSwitchCase="'profesor'" class="animate-enter">
        <h3 class="mb-4">Panel Docente</h3>
        
        <div class="stats-grid mb-4" *ngIf="profStats as stats">
          <div class="card stat-card interactive">
            <div class="icon-box green"><span class="material-icons-round">rule</span></div>
            <div>
              <div class="val">{{ stats.averageAttendance }}%</div>
              <div class="lbl">Asistencia Promedio</div>
              <small class="trend up">Alta participación</small>
            </div>
          </div>

          <div class="card stat-card interactive">
            <div class="icon-box blue"><span class="material-icons-round">groups</span></div>
            <div>
              <div class="val">{{ stats.totalStudents }}</div>
              <div class="lbl">Estudiantes Activos</div>
              <small class="trend neutral">{{ stats.activeCourses }} Cursos asignados</small>
            </div>
          </div>

           <div class="card stat-card interactive">
            <div class="icon-box purple"><span class="material-icons-round">assignment</span></div>
            <div><div class="val">{{ stats.pendingGrading }}</div><div class="lbl">Por Calificar</div></div>
          </div>
        </div>

        <div class="grid-2-1">
          <div class="flex-column gap-4">
            <div class="card p-0 highlight-card" *ngIf="profStats?.nextClass as nextClass">
              <div class="card-header bg-primary text-white flex-between">
                <span><span class="material-icons-round" style="vertical-align: bottom">videocam</span> En vivo ahora</span>
                <span class="badge bg-white text-primary">Síncrono</span>
              </div>
              <div class="card-body">
                <h2 class="mb-2">{{ nextClass.courseName }}</h2>
                <div class="meta-row text-muted mb-4">
                  <span><span class="material-icons-round fs-sm">schedule</span> {{ nextClass.time }}</span>
                  <span><span class="material-icons-round fs-sm">room</span> {{ nextClass.room }}</span>
                </div>
                <div class="actions">
                  <button class="btn btn-primary w-100">
                    <span class="material-icons-round">launch</span> Iniciar Clase en {{ nextClass.platform }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* (Mismos estilos que antes) */
    .hero-header { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border-radius: 16px; padding: 2.5rem; color: white; position: relative; overflow: hidden; margin-bottom: 2rem; }
    .brand-font { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem; }
    .section-title { margin-bottom: 1.5rem; font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #1e293b; }
    .hero-decoration .icon-bg { font-size: 15rem; color: white; opacity: 0.03; position: absolute; right: -2rem; bottom: -4rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    .stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; }
    .icon-box { width: 56px; height: 56px; border-radius: 12px; display: grid; place-items: center; color: white; font-size: 1.5rem; }
    .blue { background: #3b82f6; } .green { background: #10b981; } .orange { background: #f59e0b; } .purple { background: #8b5cf6; } .red { background: #ef4444; }
    .val { font-size: 1.8rem; font-weight: 700; color: #0f172a; line-height: 1; }
    .lbl { color: #64748b; font-size: 0.85rem; text-transform: uppercase; margin-top: 4px; }
    .trend { font-size: 0.75rem; font-weight: 600; margin-top: 4px; display: block; }
    .trend.up { color: #10b981; } .trend.down { color: #ef4444; } .trend.neutral { color: #64748b; }
    .text-danger { color: #ef4444; } .text-primary { color: #3b82f6; }
    .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
    .flex-column { display: flex; flex-direction: column; }
    .gap-4 { gap: 1.5rem; }
    .alert-list { display: flex; flex-direction: column; }
    .alert-item { padding: 1rem; border-bottom: 1px solid #f1f5f9; display: flex; gap: 1rem; }
    .alert-item.critical { border-left: 4px solid #ef4444; background: #fef2f2; }
    .alert-item.medium { border-left: 4px solid #f59e0b; }
    .alert-item.low { border-left: 4px solid #3b82f6; }
    .alert-content { flex: 1; }
    .alert-content p { margin: 4px 0 0; color: #0f172a; font-size: 0.9rem; }
    .course-list-vertical { display: flex; flex-direction: column; gap: 1rem; }
    .course-row { padding: 1rem; display: flex; align-items: center; gap: 1rem; }
    .course-img-sm { width: 60px; height: 60px; background: #e2e8f0; border-radius: 8px; }
    .course-info { flex: 1; }
    .course-info h4 { margin: 0 0 0.5rem 0; font-size: 1rem; }
    .progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; margin-bottom: 0.5rem; overflow: hidden; }
    .progress-bar .fill { height: 100%; background: #0f172a; }
    .btn-icon { background: none; border: none; cursor: pointer; color: #cbd5e1; }
    .semester-badge { background: #e0e7ff; color: #3b82f6; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .bg-soft-red { background: #fef2f2; border: 1px solid #fee2e2; }
    .highlight-card { border: 2px solid #3b82f6; overflow: hidden; }
    .bg-primary { background: #3b82f6; } .text-white { color: white; } .text-primary { color: #3b82f6; }
    .meta-row { display: flex; gap: 1.5rem; font-size: 0.95rem; }
    .fs-sm { font-size: 1.1rem; vertical-align: middle; margin-right: 4px; }
    .animate-enter { animation: fadeUp 0.5s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 1024px) { .grid-2-1 { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements OnInit {
  adminStats: AdminStats | null = null;
  profStats: ProfessorStats | null = null;
  studentData: StudentDashboard | null = null;
  alerts: SecurityAlert[] = []; // Se usa en el template
  myCoursesCount = 0;

  constructor(public authService: AuthService, private courseService: CourseService) {}
  
  ngOnInit() {
    const role = this.authService.userRole;
    // Obtener usuario del almacenamiento local para el ID
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (role === 'admin') {
      this.courseService.getAdminStats().subscribe(data => this.adminStats = data);
      this.courseService.getSecurityAlerts().subscribe(data => this.alerts = data);
    } 
    else if (role === 'profesor') {
      // Pasamos el ID real del profesor logueado
      if (user.id) {
        this.courseService.getProfessorStats(user.id).subscribe(data => this.profStats = data);
      }
    }
    else if (role === 'estudiante') {
       // Pasamos el ID real del alumno logueado
       if (user.id) {
         this.courseService.getStudentCourses(user.id).subscribe(data => this.myCoursesCount = data.length);
         this.courseService.getStudentDashboard(user.id).subscribe(data => this.studentData = data);
       }
    }
  }

  getWelcomeMessage(): string {
    const role = this.authService.userRole;
    if (role === 'estudiante') return 'Revisa tus entregas pendientes y tu estado financiero.';
    if (role === 'admin') return 'Estado del Campus: OPERATIVO.';
    return 'Bienvenido al Portal.';
  }
}