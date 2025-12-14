import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service'; // Usar nuevo servicio

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="split-layout">
      <div class="brand-section">
        <div class="overlay">
          <div class="brand-content">
            <span class="material-icons-round logo-xl">account_balance</span>
            <h1>NovaTech Portal</h1>
            <p>La excelencia académica comienza aquí. Gestiona tus cursos, notas y comunidad en un solo lugar.</p>
          </div>
          <div class="brand-footer">
            <small>© 2025 Education Systems Inc.</small>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="login-card">
          <div class="mb-4">
            <h2>Bienvenido de nuevo</h2>
            <p class="text-muted">Ingresa tus credenciales institucionales</p>
          </div>

          <div class="form-group">
            <label>Correo Institucional</label>
            <div class="input-icon">
              <span class="material-icons-round">email</span>
              <input [(ngModel)]="email" type="email" placeholder="usuario&#64;edu.com">
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-icon">
              <span class="material-icons-round">lock</span>
              <input [(ngModel)]="password" type="password" placeholder="••••••••">
            </div>
          </div>

          <button class="btn btn-primary w-100 mb-3" (click)="onLogin()" [disabled]="isLoading">
            {{ isLoading ? 'Autenticando...' : 'Iniciar Sesión' }}
            <span *ngIf="!isLoading" class="material-icons-round">arrow_forward</span>
          </button>

          <div class="demo-credentials">
            <p><strong>Accesos Demo (Click para copiar):</strong></p>
            <div class="badges">
              <span class="badge admin" (click)="fill('admin&#64;edu.com')">Admin</span>
              <span class="badge profesor" (click)="fill('alan&#64;edu.com')">Profe</span>
              <span class="badge estudiante" (click)="fill('ana&#64;edu.com')">Alumno</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .split-layout { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; width: 100vw; }
    
    .brand-section {
      background: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop');
      background-size: cover; position: relative;
    }
    .overlay {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%);
      position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 4rem; color: white;
    }
    .logo-xl { font-size: 4rem; margin-bottom: 1rem; color: #fbbf24; }
    .brand-content h1 { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; font-family: 'Playfair Display', serif; }
    .brand-content p { font-size: 1.1rem; color: #cbd5e1; max-width: 500px; line-height: 1.6; }
    
    .form-section { display: flex; align-items: center; justify-content: center; background: white; }
    .login-card { width: 100%; max-width: 420px; padding: 2rem; }
    
    .input-icon { position: relative; }
    .input-icon span { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .input-icon input { padding-left: 3rem; }
    
    .w-100 { width: 100%; justify-content: center; padding: 0.8rem; font-size: 1rem; }
    .demo-credentials { margin-top: 2rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
    .badges { display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; }
    .badge { cursor: pointer; transition: transform 0.2s; } .badge:hover { transform: scale(1.1); }

    @media (max-width: 900px) { .split-layout { grid-template-columns: 1fr; } .brand-section { display: none; } }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: ToastService
  ) {}

  onLogin() {
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.toast.show('¡Bienvenido a NovaTech Portal!', 'success');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.show(err.message || 'Credenciales inválidas', 'error');
        }
      });
  }

  fill(email: string) {
    this.email = email;
    this.password = '123';
  }
}