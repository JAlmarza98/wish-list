import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { ToolbarComponent } from "../../shared/toolbar/toolbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MATERIAL_MODULES, ToolbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
