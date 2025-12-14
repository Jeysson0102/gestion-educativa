import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
// CORRECCIÓN: Usamos auth.model en lugar de user.model
import { AuthResponse, User } from '../models/auth.model'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) this.currentUserSubject.next(JSON.parse(savedUser));
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}&password=${credentials.password}`)
      .pipe(map(users => {
        if (users.length > 0) {
          const user = users[0];
          const token = 'fake-jwt-token-' + user.id;
          const response = { token, user };
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return response;
        } else {
          throw new Error('Credenciales inválidas');
        }
      }));
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken() { return localStorage.getItem('token'); }
  
  get userRole() { return this.currentUserSubject.value?.role; }
}