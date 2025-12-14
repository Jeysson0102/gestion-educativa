import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo-box"><span class="material-icons-round">school</span></div>
          <div class="brand-text">
            <span class="brand-font">NovaTech</span>
            <small>STUDENT PORTAL</small>
          </div>
        </div>
        
        <nav class="nav-links">
          <div class="nav-label">GENERAL</div>
          <a routerLink="/dashboard/home" routerLinkActive="active" class="nav-item">
            <span class="material-icons-round">dashboard</span> Mi Panel
          </a>

          <ng-container *ngIf="userRole === 'admin'">
            <div class="nav-label">GESTIÓN</div>
            <a routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">
              <span class="material-icons-round">account_tree</span> Académico
            </a>
            <a routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">
              <span class="material-icons-round">group</span> Usuarios
            </a>
            <a class="nav-item"><span class="material-icons-round">security</span> Auditoría</a>
          </ng-container>

          <ng-container *ngIf="userRole === 'estudiante'">
            <div class="nav-label">APRENDIZAJE</div>
            <a routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">
              <span class="material-icons-round">auto_stories</span> Mis Cursos
            </a>
            <a class="nav-item">
              <span class="material-icons-round">assignment</span> Entregas
            </a>
            <a class="nav-item">
              <span class="material-icons-round">insights</span> Historial & Notas
            </a>

            <div class="nav-label">TRÁMITES & FINANZAS</div>
            <a class="nav-item">
              <span class="material-icons-round">account_balance_wallet</span> Pagos
            </a>
            <a class="nav-item">
              <span class="material-icons-round">description</span> Certificados
            </a>
            <a class="nav-item">
              <span class="material-icons-round">how_to_reg</span> Matrícula Online
            </a>

            <div class="nav-label">SERVICIOS</div>
            <a class="nav-item">
              <span class="material-icons-round">support_agent</span> Soporte / Tickets
            </a>
            <a class="nav-item">
              <span class="material-icons-round">work</span> Bolsa de Trabajo
            </a>
          </ng-container>

          <ng-container *ngIf="userRole === 'profesor'">
            <div class="nav-label">DOCENCIA</div>
            <a routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">
              <span class="material-icons-round">class</span> Mis Clases
            </a>
            <a class="nav-item">
              <span class="material-icons-round">fact_check</span> Evaluaciones
            </a>
          </ng-container>
        </nav>

        <div class="user-profile">
          <img src="https://ui-avatars.com/api/?name={{userRole}}&background=random&color=fff" class="avatar">
          <div class="info">
            <span class="name">{{ userRole | titlecase }}</span>
            <span class="role-badge">Conectado</span>
          </div>
          <button (click)="logout()" class="btn-logout" title="Salir"><span class="material-icons-round">logout</span></button>
        </div>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; height: 100vh; background: #f8fafc; }
    
    .sidebar {
      width: 280px; background: #0f172a; color: white;
      display: flex; flex-direction: column; padding: 1.5rem;
      box-shadow: 4px 0 24px rgba(0,0,0,0.05); z-index: 10; overflow-y: auto;
    }
    
    .brand {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;
    }
    .logo-box { width: 48px; height: 48px; background: #fff; color: #0f172a; border-radius: 12px; display: grid; place-items: center; }
    .brand-text { display: flex; flex-direction: column; }
    .brand-font { font-size: 1.4rem; font-weight: 700; color: white; line-height: 1; }
    small { opacity: 0.6; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    
    .nav-links { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .nav-label {
      font-size: 0.65rem; font-weight: 800; color: #64748b; margin: 1.5rem 0 0.5rem; letter-spacing: 0.08em;
    }
    
    .nav-item {
      display: flex; align-items: center; gap: 0.8rem; padding: 0.7rem 1rem;
      color: #94a3b8; text-decoration: none; border-radius: 8px; transition: all 0.2s;
      font-weight: 500; font-size: 0.9rem; cursor: pointer;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
    .nav-item.active { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
    
    .user-profile {
      margin-top: 1rem; display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0;
      padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;
    }
    .avatar { width: 36px; height: 36px; border-radius: 50%; }
    .info { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
    .role-badge { font-size: 0.7rem; color: #10b981; }
    .btn-logout { background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; }
    .btn-logout:hover { color: #ef4444; }

    .main-content { flex: 1; overflow-y: auto; position: relative; }
    .content-wrapper { padding: 2rem; max-width: 1600px; margin: 0 auto; }
  `]
})
export class LayoutComponent {
  get userRole() { return this.authService.userRole; }
  constructor(public authService: AuthService) {}
  logout() { this.authService.logout(); }
}