import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly _snackBar = inject(MatSnackBar);

  showSnackBar(message: string, type: 'succes' | 'error'): void {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data:{
        message,
        type,
        icon: this.getIcon(type)
      },
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  hideSnackBar(): void {
    this._snackBar.dismiss();
  }

  private getIcon(type:'succes' | 'error'): string {
    switch (type) {
      case 'succes':
        return 'done';
      case 'error':
        return 'error_outline';
      default:
        return 'done';
    }
  }
}
