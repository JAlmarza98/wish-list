import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    <mat-toolbar>
      <!-- <button mat-icon-button aria-label="Example icon-button with menu icon">
        <mat-icon>menu</mat-icon>
      </button> -->
      <span>Wish list</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Cerrar sesión"  matTooltip="Cerrar sesión" (click)="logOut()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
  `]
})
export class ToolbarComponent {

  private _router = inject(Router);
  private auth = inject(AuthService)

  async logOut(): Promise<void> {
    try {
      await this.auth.logOut();
      this._router.navigateByUrl('/auth/log-in');
    } catch (error) {
      console.log(error);
    }
  }
}