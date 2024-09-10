import { Component, OnInit } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { AddToListComponent } from '@components/modals/add-to-list/add-to-list.component';
import { LoaderService } from '@shared/loader/loader.service';
import { ListService } from 'src/app/services/list.service';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

export interface Wish {
  title: string;
  descripton: string;
  url: string;
}

export interface List {
  uid: string;
  id: string;
  list: Wish[];
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'url'];
  wishList!: Wish[];
  listID!: string;

  constructor(
    private _loader: LoaderService,
    private _service: ListService,
    private _snackbar: SnackbarService,
    readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._loader.ShowLoader();
    this._service.getMyList().subscribe((response: List[]) => {
      console.log("🚀 ~ ListComponent ~ this._service.getMyList ~ response:", response)
      this.wishList = response[0].list;
      this.listID = response[0].id;
      console.log("🚀 ~ ListComponent ~ this._service.getMyList ~ this.wishList:", this.wishList)
      this._loader.HideLoader();
    }, (err: any) => {
      this.wishList = [];
      this._snackbar.showSnackBar('No se ha podido recuperar datos', 'error');
      this._loader.HideLoader();
    });
  }

  createYourList(): void {
    this._loader.ShowLoader();
    this._service.createList().then(action => {
      this.wishList = [];
      this._snackbar.showSnackBar('Lista creada', 'succes');
    }).catch((err) => {
      console.log(err);
      this._snackbar.showSnackBar('Error al crear tu lista', 'error');
    }).finally(() => {
      this._loader.HideLoader();
    });
  }

  openInsertDialog(): void {
    this.dialog.open(AddToListComponent, {
      width: '500px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined && result !== '') {
        this._loader.ShowLoader();
        this._service.updateMyList(this.listID, this.wishList.concat(result)).then(action => {
          this._snackbar.showSnackBar('Nuevo elemento añadido', 'succes');
        }).catch((err) => {
          console.log(err);
          this._snackbar.showSnackBar('Error al añadir a tu lista', 'error');
        }).finally(() => {
          this._loader.HideLoader();
        });
      }
    });
  }
}
