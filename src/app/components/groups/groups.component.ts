import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@shared/loader/loader.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';
import { GroupsService } from 'src/app/services/groups.service';
import { CreateGroupComponent } from './modals/create-group/create-group.component';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '@auth/auth.service';

export interface Group {
  id: string,
  date: Date,
  members: string[],
  name: String
}
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  groupsList!: any[];
  loadReady: boolean = false;

  constructor(
    private _loader: LoaderService,
    private _service: GroupsService,
    private _snackbar: SnackbarService,
    private auth: AuthService,
    readonly dialog: MatDialog,
  ) {
    this._loader.ShowLoader();
    this.loadReady = false;
  }


  ngOnInit(): void {
    this._service.getMyGroups().subscribe((response: any[]) => {
      if (response.length !== 0) {
        this.groupsList = response;
        this._loader.HideLoader();
      } else {
        this.groupsList = [];
        this._loader.HideLoader();
      }
      this.loadReady = true;
    }, (err: any) => {
      this._loader.HideLoader();
      this.loadReady = true;
      this._snackbar.showSnackBar('No se ha podido recuperar datos', 'error');
      console.log(err);
    });
  }

  createNewGroup(): void {
  this.dialog.open(CreateGroupComponent, {
    width: '500px',
  }).afterClosed().subscribe(result => {
    if (result !== undefined && result !== '') {
      this._loader.ShowLoader();

      const newGroup: Group = {
        id: uuidv4(),
        date: new Date().toLocaleDateString('es-ES', { year: "numeric", month: "short", day: "numeric" }),
        members: [this.auth.UserData.uid],
        ...result
      }
      this._service.createGroup(newGroup).then(action => {
        this._snackbar.showSnackBar('Nuevo grupo creado', 'succes');
      }).catch((err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al Crear tu grupo', 'error');
      }).finally(() => {
        this._loader.HideLoader();
      });
    }
  });
  }
}
