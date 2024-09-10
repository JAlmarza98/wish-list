import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '@shared/material.module';

interface AddToListForm {
  title: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}

@Component({
  selector: 'app-add-to-list',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './add-to-list.component.html',
  styleUrl: './add-to-list.component.css'
})
export class AddToListComponent implements OnInit {

  addToListForm!: FormGroup<AddToListForm>;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.addToListForm = this.fb.group({
      title: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: this.fb.control('', {
        validators: [],
        nonNullable: true,
      }),
      url: this.fb.control('', {
        validators: [],
        nonNullable: true,
      })
    });
  }
}
