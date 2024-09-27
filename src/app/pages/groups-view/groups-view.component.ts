import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Group } from '@components/groups/groups.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MATERIAL_MODULES } from '@shared/material.module';
import { ToolbarComponent } from '@shared/toolbar/toolbar.component';
import { GroupsService } from 'src/app/services/groups.service';
import { LoaderService } from '@shared/loader/loader.service';
import { UserService } from 'src/app/services/user.service';
import { ListService } from 'src/app/services/list.service';
import { List } from '@components/list/list.component';
import { TableComponent } from '@shared/table/table.component';
import { takeUntil, switchMap, Subject, shareReplay, catchError, of, finalize, throwError } from 'rxjs';
import { AuthService } from '@auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-groups-view',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterModule, ToolbarComponent, FooterComponent, LoaderComponent, TableComponent],
  templateUrl: './groups-view.component.html',
  styleUrl: './groups-view.component.css'
})
export class GroupsViewComponent implements OnInit, OnDestroy {
  groupID!: string;
  groupInfo!: Group;
  members!: { uid: string, username: string }[];
  groupList!: List[];
  loadReady: boolean = false;
  reloadTable = false;
  nIntervId: any
  me: string
  error!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private loaderService: LoaderService,
    private userService: UserService,
    private listService: ListService,
    private auth: AuthService,
    readonly dialog: MatDialog,
  ) {
    this.loaderService.ShowLoader();
    this.route.url.pipe().subscribe(segments => {
      const segmentList = segments.map(x => x.toString());
      this.groupID = segmentList[1];
    });
    this.me = this.auth.UserData.uid;
  }

  ngOnInit(): void {
    this.groupsService.getGroupInfo(this.groupID).pipe(
      takeUntil(this.destroy$),
      switchMap(groupInfo => {
        if (!groupInfo || !groupInfo[0] || !groupInfo[0].members.includes(this.me)) {
          return throwError(() => new Error('No eres miembro de este grupo.'));
        }
        this.groupInfo = groupInfo[0];
        return this.userService.getuserNameOfGroup(groupInfo[0].members).pipe(
          takeUntil(this.destroy$),
          switchMap(membersWithNames => {
            this.members = membersWithNames;
            return this.listService.getGroupList(membersWithNames.map(m => m.uid)).pipe(
              takeUntil(this.destroy$)
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error al obtener información del grupo:', error);
        this.error = 'Ocurrió un error al cargar los datos del grupo.';
        return of(null);
      }),
      finalize(() => {
        this.loaderService.HideLoader();
      })
    ).pipe(shareReplay(1)).subscribe(groupList => {
      if (groupList) {
        this.groupList = this.mapGroups(groupList);
        this.groupList = this.groupList.filter(list => list.uid !== this.me);

        if (!this.nIntervId) {
          this.nIntervId = setTimeout(() => {
            this.loadReady = true;
            this.reloadTable = true;
            this.loaderService.HideLoader();
          }, 1000);
        }
      } else {
        this.error = 'No eres miembro de este grupo.';
      }
    });
  }

  mapGroups(data: List[]): List[] {
    data.map(item => {
      const user = this.members.find(member => member.uid === item.uid)?.username;
      item.user = user;
    });
    return data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createInvitationLink() {
    console.log('copiar link')
  }
}
