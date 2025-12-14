import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const current = this.toastsSubject.value;
    const toast: Toast = { message, type, id: Date.now() };
    this.toastsSubject.next([...current, toast]);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => this.remove(toast.id), 3000);
  }

  remove(id: number) {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}