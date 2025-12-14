import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  description: string;
  price: number; 
  semestre?: string;
  image?: string;
  professorId?: number;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  submissionsCount?: number;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  date: string;
  progress?: number;
  status?: 'active' | 'completed' | 'dropped';
}

export interface AdminStats {
  enrollmentCount: number;
  classroomOccupancy: number;
  averageGpa: number;
  pendingPayments: number;
  incidents: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
}

export interface SecurityAlert {
  id: number;
  severity: 'low' | 'medium' | 'critical';
  message: string;
  timestamp: string;
  module: 'finance' | 'auth' | 'academic';
}

export interface ProfessorStats {
  activeCourses: number;
  totalStudents: number;
  averageAttendance: number;
  pendingGrading: number;
  nextClass: {
    courseName: string;
    time: string;
    room: string;
    platform: 'Zoom' | 'Teams' | 'Presencial';
  };
}

export interface StudentDashboard {
  academic: {
    enrolledCredits: number;
    gpa: number;
    programName: string;
    currentSemester: string;
  };
  finance: {
    status: 'solvent' | 'debt';
    debtAmount: number;
    nextPaymentDate: string;
    lastPayment: string;
  };
  upcomingDeadlines: Array<any>;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // --- CRUD Cursos ---
  getAll(): Observable<Course[]> { return this.http.get<Course[]>(`${this.apiUrl}/courses`); }
  getById(id: number): Observable<Course> { return this.http.get<Course>(`${this.apiUrl}/courses/${id}`); }
  create(course: any): Observable<Course> { return this.http.post<Course>(`${this.apiUrl}/courses`, course); }
  update(id: number, course: any) { return this.http.put(`${this.apiUrl}/courses/${id}`, course); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/courses/${id}`); }

  // --- Tareas ---
  getAssignmentsByCourse(courseId: number): Observable<Assignment[]> { return this.http.get<Assignment[]>(`${this.apiUrl}/assignments?courseId=${courseId}`); }
  createAssignment(assignment: any): Observable<Assignment> { return this.http.post<Assignment>(`${this.apiUrl}/assignments`, assignment); }

  // --- Matrículas ---
  checkEnrollment(courseId: number, studentId: number): Observable<Enrollment[]> { return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments?courseId=${courseId}&studentId=${studentId}`); }
  
  enroll(courseId: number, studentId: number): Observable<Enrollment> {
    const enrollment = { courseId, studentId, date: new Date().toISOString(), progress: 0, status: 'active' };
    return this.http.post<Enrollment>(`${this.apiUrl}/enrollments`, enrollment);
  }
  
  getStudentCourses(studentId: number): Observable<Enrollment[]> { return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments?studentId=${studentId}`); }

  // ==========================================
  // === LÓGICA REAL (CALCULADA DESDE DB) ===
  // ==========================================

  // 1. Admin: Calcula estadísticas reales consultando todas las tablas
  getAdminStats(): Observable<AdminStats> {
    return forkJoin({
      enrollments: this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments`),
      courses: this.http.get<Course[]>(`${this.apiUrl}/courses`),
      alerts: this.http.get<SecurityAlert[]>(`${this.apiUrl}/alerts`)
    }).pipe(
      map(data => {
        // Cálculo real de ingresos potenciales basado en matrículas * precio del curso
        let totalRevenue = 0;
        data.enrollments.forEach(enrollment => {
          const course = data.courses.find(c => c.id == enrollment.courseId); // Nota: json-server a veces usa strings en IDs
          if (course) {
            totalRevenue += Number(course.price || 0);
          }
        });
        
        return {
          enrollmentCount: data.enrollments.length,
          classroomOccupancy: 85, // Simulado
          averageGpa: 15.4, // Simulado
          pendingPayments: totalRevenue * 0.3, // Asumimos que el 30% está pendiente de pago
          incidents: data.alerts.length,
          systemStatus: 'healthy'
        };
      })
    );
  }

  getSecurityAlerts(): Observable<SecurityAlert[]> {
    return this.http.get<SecurityAlert[]>(`${this.apiUrl}/alerts`);
  }

  // 2. Profesor: Filtra cursos que le pertenecen y cuenta alumnos reales
  getProfessorStats(professorId: number): Observable<ProfessorStats> {
    return forkJoin({
      myCourses: this.http.get<Course[]>(`${this.apiUrl}/courses?professorId=${professorId}`),
      allEnrollments: this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments`),
      assignments: this.http.get<Assignment[]>(`${this.apiUrl}/assignments`)
    }).pipe(
      map(data => {
        // Filtrar inscripciones solo de mis cursos
        const myCourseIds = data.myCourses.map(c => c.id);
        
        // Contar cuántos alumnos están inscritos en mis cursos
        const myStudentsCount = data.allEnrollments.filter(e => 
          myCourseIds.includes(Number(e.courseId))
        ).length;

        // Tareas pendientes (simulación basada en assignments creados)
        const pending = data.assignments.filter(a => myCourseIds.includes(Number(a.courseId))).length * 5; 

        return {
          activeCourses: data.myCourses.length,
          totalStudents: myStudentsCount,
          averageAttendance: 92,
          pendingGrading: pending,
          nextClass: { 
            courseName: data.myCourses[0]?.name || 'Sin clases hoy', 
            time: '10:00 AM', 
            room: 'Aula Virtual', 
            platform: 'Zoom' 
          }
        };
      })
    );
  }

  // 3. Alumno: Cruza sus matrículas con los precios de los cursos
  getStudentDashboard(studentId: number): Observable<StudentDashboard> {
    return forkJoin({
      myEnrollments: this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments?studentId=${studentId}`),
      allCourses: this.http.get<Course[]>(`${this.apiUrl}/courses`)
    }).pipe(
      map(data => {
        // Obtener detalles completos de los cursos donde estoy inscrito
        const myCourseDetails = data.allCourses.filter(c => 
          data.myEnrollments.some(e => Number(e.courseId) === Number(c.id))
        );
        
        // Sumar el precio de todos mis cursos
        const totalDebt = myCourseDetails.reduce((sum, c) => sum + (c.price || 0), 0);

        return {
          academic: {
            enrolledCredits: myCourseDetails.length * 4, // 4 créditos por curso aprox
            gpa: 16.4,
            programName: 'Ingeniería de Software',
            currentSemester: '2024-1'
          },
          finance: {
            status: totalDebt > 0 ? 'debt' : 'solvent', 
            debtAmount: totalDebt, 
            nextPaymentDate: '2024-12-30',
            lastPayment: '2024-11-15'
          },
          upcomingDeadlines: [], 
          notifications: []
        };
      })
    );
  }
}