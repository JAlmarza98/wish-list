import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { ToolbarComponent } from '@shared/toolbar/toolbar.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { ListComponent } from '@components/list/list.component';
import { GroupsComponent } from '@components/groups/groups.component';
import { LoaderComponent } from '@shared/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MATERIAL_MODULES, ToolbarComponent, FooterComponent, ListComponent, GroupsComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
