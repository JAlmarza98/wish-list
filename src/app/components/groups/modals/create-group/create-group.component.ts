import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '@shared/material.module';

export interface CreateGroupForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './create-group.component.html',
  styles: [`
    mat-form-field {width: 100%;}
  `]
})
export class CreateGroupComponent {
  createGroupForm!: FormGroup<CreateGroupForm>;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createGroupForm = this.fb.group({
      name: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      })
    });
  }
}
