import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Credential } from '@auth/auth.service';
import { ButtonProviderComponent } from '@auth/components';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-singin',
  standalone: true,
  imports: [
    ButtonProviderComponent,
    MATERIAL_MODULES,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent {
  hide: boolean = true;
  registerForm!: FormGroup<RegisterForm>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackbarService,
    private _router: Router
  ) {
    this.registerForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  async signUp(): Promise<void> {
    if (this.registerForm.invalid) return;

    const credential: Credential = {
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
    };

    try {
      const response = await this.auth.signUpWithEmailAndPassword(credential);
      this.snackBar.showSnackBar('Se ha registrado correctamente', 'succes');
      this._router.navigateByUrl('/');
    } catch (error) {
      console.error(error);
      this.snackBar.showSnackBar('Ese email ya esta registrado', 'error');
    }
  }
}
