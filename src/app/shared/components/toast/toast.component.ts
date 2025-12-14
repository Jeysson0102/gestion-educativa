import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           class="toast" [ngClass]="toast.type" (click)="toastService.remove(toast.id)">
        <span class="material-icons-round icon">
          {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast {
      min-width: 300px; padding: 1rem; border-radius: 8px; background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px;
      animation: slideIn 0.3s ease-out; cursor: pointer; border-left: 4px solid #ccc;
    }
    .toast.success { border-left-color: #10b981; } .toast.success .icon { color: #10b981; }
    .toast.error { border-left-color: #ef4444; } .toast.error .icon { color: #ef4444; }
    .toast.info { border-left-color: #3b82f6; } .toast.info .icon { color: #3b82f6; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}