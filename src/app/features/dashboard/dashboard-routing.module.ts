import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { 
        path: 'courses', 
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'profesor', 'estudiante'] } // Todos ven cursos
      },
      { 
        path: 'users', 
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [roleGuard],
        data: { roles: ['admin'] } // SOLO ADMIN ve usuarios
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }