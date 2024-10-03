import { Component, OnInit } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@shared/loader/loader.service';
import { ListService } from 'src/app/services/list.service';
import { SnackbarService } from '@shared/snackbar/snackbar.service';
import { TableAction, TableComponent } from '@shared/table/table.component';
import { AddToListComponent, DeleteFromListComponent, UpdateOfListComponent } from './modals';
import { v4 as uuidv4 } from 'uuid';

export interface Wish {
  title: string;
  descripton: string;
  url: string;
  date: Date;
  id: string;
  reserved?: Reserved
}

export interface List {
  uid: string;
  user?: string
  id: string;
  list: Wish[];
}

export interface Reserved {
  reservedBy: string,
  date: Date
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MATERIAL_MODULES,TableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  wishList: Wish[] = [];
  wishListExist:boolean = false;
  listID!: string;
  loadData = false;
  reloadTable= false;

  constructor(
    private _loader: LoaderService,
    private _service: ListService,
    private _snackbar: SnackbarService,
    readonly dialog: MatDialog,
  ) {
    this._loader.ShowLoader();
  }


  ngOnInit(): void {
    this._service.getMyList().subscribe((response: List[]) => {
      if(response.length !== 0){
        this.wishListExist = true;
        this.wishList = response[0].list;
        this.listID = response[0].id;
        this.loadData = true;
        this.reloadTable = true;
        this._loader.HideLoader();
      } else {
        this.wishListExist = false;
        this.loadData = true;
        this._loader.HideLoader();
      }
    }, (err: any) => {
      this.wishListExist = true;
      this.wishList = [];
      this.loadData = true;
      this._loader.HideLoader();
      this._snackbar.showSnackBar('No se ha podido recuperar datos', 'error');
      console.log(err);
    });
  }

  createYourList(): void {
    this._loader.ShowLoader();
    this._service.createList().then(action => {
      this.reloadTable = false;
      this.wishList = [];
      this.reloadTable = true;
      this._snackbar.showSnackBar('Lista creada', 'succes');
    }).catch((err) => {
      console.log(err);
      this._snackbar.showSnackBar('Error al crear tu lista', 'error');
    }).finally(() => {
      this._loader.HideLoader();
    });
  }

  tableAction(event:TableAction){
    switch (event.action) {
      case 'update':
        this.openUpdateDialog(event.row)
        break;

      case 'delete':
        this.openDeleteDialog(event.row);
        break;
    }
  }

  openInsertDialog(): void {
    this.dialog.open(AddToListComponent, {
      width: '500px',
    }).afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        this._loader.ShowLoader();
        this.reloadTable = false;

        const newItem = {
          id: uuidv4(),
          date: new Date().toLocaleDateString('es-ES', { year:"numeric", month:"short", day:"numeric"}) ,
          ...result
        }
        this._service.updateMyList(this.listID, this.wishList.concat(newItem)).then(action => {
          this._snackbar.showSnackBar('Nuevo elemento añadido', 'succes');
        }).catch((err) => {
          console.log(err);
          this._snackbar.showSnackBar('Error al añadir a tu lista', 'error');
        }).finally(() => {
          this.reloadTable = true;
          this._loader.HideLoader();
        });
      }
    });
  }

  openUpdateDialog(row: Wish): void {
    this.dialog.open(UpdateOfListComponent, {
      width: '500px',
      data: {row},
    }).afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        this._loader.ShowLoader();
        this.reloadTable = false;

        const newElement: Wish = {
          id:row.id,
          date: row.date,
          ...result
        }

        let updatedList = this.wishList.map(item => {
          if (item.id === row.id) {
            return newElement
          }
          return item;
        });

        this._service.updateMyList(this.listID, updatedList).then(action => {
          this._snackbar.showSnackBar('Elemento actualizado', 'succes');
        }).catch((err) => {
          console.log(err);
          this._snackbar.showSnackBar('Error al actualizar tu lista', 'error');
        }).finally(() => {
          this.reloadTable = true;
          this._loader.HideLoader();
        });
      }
    });
  }

  openDeleteDialog(row: Wish): void {
    this.dialog.open(DeleteFromListComponent, {
      width: '500px'
    }).afterClosed().subscribe(result => {
      if (result === true) {
        this._loader.ShowLoader();
        this.reloadTable = false;

        const listWithOutItem = this.wishList.filter(item => item !== row);
        this._service.updateMyList(this.listID, listWithOutItem).then(action => {
          this._snackbar.showSnackBar('Elemento eliminado', 'succes');
        }).catch((err) => {
          console.log(err);
          this._snackbar.showSnackBar('Error al eliminar a tu lista', 'error');
        }).finally(() => {
          this.reloadTable = true;
          this._loader.HideLoader();
        });
      }
    });
  }
}
