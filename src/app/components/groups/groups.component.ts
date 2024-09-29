import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@shared/loader/loader.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';
import { GroupsService } from 'src/app/services/groups.service';
import { CreateGroupComponent } from './modals/create-group/create-group.component';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '@auth/auth.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

export interface AddUserNameForm {
  userName: FormControl<string>;
}
export interface Group {
  id?: string,
  uid: string,
  date: Date,
  members: string[],
  name: String
}
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterLink, ReactiveFormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  groupsList: any[] =[ ];
  loadReady: boolean = false;
  userName!: string | undefined
  addUserNameForm!: FormGroup<AddUserNameForm>;

  constructor(
    private _loader: LoaderService,
    private _service: GroupsService,
    private _snackbar: SnackbarService,
    private auth: AuthService,
    readonly dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this._loader.ShowLoader();
    this.loadReady = false;
  }


  ngOnInit(): void {
    this.userService.getMyUserName().subscribe(response => {
      this.userName = response.length !== 0 ? response[0].username : undefined;
      this.loadReady = true;
    });

    this.getMyGroups()
    this.addUserNameForm = this.fb.group({
      userName: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      })
    });
  }

  getMyGroups(): void {
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
          uid: uuidv4(),
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

  addUserName(): void {
    const formData = this.addUserNameForm.value;
    this.userService.addUserName(formData.userName as string).then(action => {
      this._snackbar.showSnackBar('Nombre establecido', 'succes');
    }).catch((err) => {
      console.log(err);
      this._snackbar.showSnackBar('Error establecer nombre', 'error');
    }).finally(() => {
      this._loader.HideLoader();
    });
  }
}
