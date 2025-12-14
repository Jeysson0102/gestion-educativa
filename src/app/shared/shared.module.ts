import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './directives/has-role.directive';
import { ToastComponent } from './components/toast/toast.component'; // Importar

@NgModule({
  declarations: [
    HasRoleDirective,
    ToastComponent // Declarar
  ],
  imports: [CommonModule],
  exports: [
    HasRoleDirective,
    ToastComponent // Exportar
  ]
})
export class SharedModule { }