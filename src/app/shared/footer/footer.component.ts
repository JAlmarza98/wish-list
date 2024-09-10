import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    <mat-toolbar>
      <span>developed by Joel Almarza, 2024</span>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar{ display: flex; justify-content:flex-end; align-items: center;}
    span {font-size: 11px; color: rgba(150, 150, 150, 0.75)}
  `]
})
export class FooterComponent {

}
