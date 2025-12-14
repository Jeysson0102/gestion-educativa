import { Component, OnInit } from '@angular/core';
import { User } from '../../../../core/models/auth.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  template: `
    <div class="page-header flex-between mb-4">
      <div>
        <h2 class="page-title">Directorio de Usuarios</h2>
        <p class="text-muted">Gestión de accesos, profesores y estudiantes.</p>
      </div>
      <button class="btn btn-primary" (click)="openModal()">
        <span class="material-icons-round">person_add</span> Nuevo Usuario
      </button>
    </div>

    <div class="card p-3 mb-4">
      <div class="search-box">
        <span class="material-icons-round icon">search</span>
        <input [(ngModel)]="searchTerm" (input)="filterUsers()" placeholder="Buscar por nombre, email o rol..." class="search-input">
      </div>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>
                <div class="user-info">
                  <div class="avatar-circle" [ngClass]="user.role">{{ user.fullName | slice:0:1 }}</div>
                  <div class="details">
                    <span class="name">{{ user.fullName }}</span>
                    <span class="id">ID: #{{ user.id }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="getRoleBadgeClass(user.role)">
                  {{ user.role | titlecase }}
                </span>
              </td>
              <td class="text-muted">{{ user.email }}</td>
              <td>
                <div class="actions">
                  <button class="icon-btn" (click)="openModal(user)" title="Editar">
                    <span class="material-icons-round">edit</span>
                  </button>
                  <button class="icon-btn delete" (click)="deleteUser(user)" title="Eliminar">
                    <span class="material-icons-round">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="isLoading" class="p-4 text-center">
          <span class="material-icons-round spin">autorenew</span> Cargando directorio...
        </div>
        
        <div *ngIf="!isLoading && filteredUsers.length === 0" class="p-4 text-center text-muted">
          No se encontraron usuarios con "{{searchTerm}}".
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Perfil' : 'Registrar Usuario' }}</h2>
        <form (ngSubmit)="saveUser()">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input [(ngModel)]="currentUser.fullName" name="fullName" required>
          </div>
          <div class="form-group">
            <label>Correo</label>
            <input [(ngModel)]="currentUser.email" name="email" required>
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select [(ngModel)]="currentUser.role" name="role" required class="form-select">
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group" *ngIf="!isEditing">
            <label>Contraseña</label>
            <input [(ngModel)]="currentUser.password" name="password" type="password">
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
    /* Estilos de búsqueda */
    .search-box { position: relative; }
    .search-box .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input { padding-left: 2.5rem; width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; height: 45px; }
    
    .table-responsive { overflow-x: auto; }
    .custom-table { width: 100%; border-collapse: collapse; }
    .custom-table th, .custom-table td { padding: 1rem 1.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .user-info { display: flex; align-items: center; gap: 1rem; }
    .avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; background: #64748b; }
    .avatar-circle.admin { background: #ef4444; }
    .avatar-circle.profesor { background: #3b82f6; }
    .avatar-circle.estudiante { background: #10b981; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge-admin { background: #fee2e2; color: #991b1b; }
    .badge-profesor { background: #e0e7ff; color: #3730a3; }
    .badge-estudiante { background: #dcfce7; color: #166534; }
    .form-select { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .icon-btn { border:none; background:transparent; cursor:pointer; color:#64748b; }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // Lista filtrada
  searchTerm: string = ''; // Texto del buscador
  isLoading = true;
  showModal = false;
  isEditing = false;
  
  currentUser: any = { fullName: '', email: '', role: 'estudiante', password: '' };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAll().subscribe(data => {
      this.users = data;
      this.filteredUsers = data; // Inicialmente mostramos todos
      this.isLoading = false;
    });
  }

  // Función de filtrado en tiempo real
  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u => 
      u.fullName.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }

  getRoleBadgeClass(role: string): string {
    return `badge-${role}`;
  }

  openModal(user?: User) {
    this.isEditing = !!user;
    if (user) {
      this.currentUser = { ...user };
    } else {
      this.currentUser = { fullName: '', email: '', role: 'estudiante', password: '' };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveUser() {
    if (this.isEditing) {
      this.userService.update(this.currentUser.id, this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.userService.create(this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`¿Eliminar acceso al usuario ${user.fullName}?`)) {
      this.userService.delete(user.id).subscribe(() => this.loadUsers());
    }
  }
}