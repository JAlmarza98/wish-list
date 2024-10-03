import { AfterViewInit, Component, Input, OnInit, output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_MODULES } from '@shared/material.module';
import { MyCustomPaginatorIntl } from './custom-paginator-intl';
import { Wish } from '@components/list/list.component';

export interface TableAction {
  row: Wish,
  action: 'update' | 'delete' | 'reserve' | 'remove'
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() data!: Wish[];
  @Input() isGroup!: boolean;
  @Input() columnStructure: any;

  tableActionEvent = output<TableAction>()

  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    if (this.isGroup) {
      this.displayedColumns = ['title', 'description', 'date', 'reserved', 'star'];
    } else {
      this.displayedColumns = ['title', 'description', 'date', 'star'];
    }

    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  tableAction(row: Wish, action: 'update' | 'delete' | 'reserve' | 'remove') {
    this.tableActionEvent.emit(({ row, action }));
  }
}
