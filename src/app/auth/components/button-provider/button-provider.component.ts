import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-button-provider',
  imports: [NgOptimizedImage, MATERIAL_MODULES],
  templateUrl: './button-provider.component.html',
  styleUrl: './button-provider.component.css'
})
export class ButtonProviderComponent {
  @Input() isLogin = false;

  constructor(
    private _auth: AuthService,
    private snackBar: SnackbarService,
    private _router: Router
  ) { }

  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this._auth.signInWithGoogleProvider();
      if(result.user){
        this.snackBar.showSnackBar('Se ha iniciado correctamente', 'succes');
        this._router.navigateByUrl('/');
      }else{
        this.snackBar.showSnackBar('No se ha podido iniciar sesión', 'error');
      }
    } catch (error) {
      console.log(error);
      this.snackBar.showSnackBar('No se ha podido iniciar sesión', 'error');
    }
  }
}
