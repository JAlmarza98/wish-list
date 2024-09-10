import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    @if (isLoading) {
      <div class="loaderMask">
        <mat-spinner class="spinner" mode="indeterminate" color="primary"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    .loaderMask { position: fixed; display: block; width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; }
    .spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  `]
})
export class LoaderComponent implements OnInit {

  isLoading!: boolean;

  constructor(private _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.loadState.subscribe((res: any) => {
      this.isLoading = res;
    });
  }
}
