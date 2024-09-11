import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-delete-from-list',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
  <h2 mat-dialog-title>Eliminar de la lista</h2>
  <mat-dialog-content>
    <p>
      Se va a eliminar este elemento de la lista. Esta acción no se puede deshacer
    </p>
    <p>¿Desea continuar?</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cancelar</button>
    <button mat-flat-button [mat-dialog-close]="true">Eliminar</button>
  </mat-dialog-actions>
  `,
  styles: []
})
export class DeleteFromListComponent {

}
