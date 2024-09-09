import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    <div class="snackbar" >
      <mat-icon>{{data?.icon}}</mat-icon>
      &nbsp;
      <span>{{data?.message}}</span>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeSnakebar()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles:  [`
    .snackbar { display: flex; align-items: center; }
    .spacer { flex: 1; }
    mat-icon { font-size: 2rem; height: 2rem; width: 2rem; margin-right: .5rem; }
    button mat-icon { font-size: 1.5rem; height: fit-content; width: fit-content; margin-right: .5rem; }
  `]
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBar:SnackbarService
  ) { }

  closeSnakebar(): void {
    this.snackBar.hideSnackBar()
  }
}
