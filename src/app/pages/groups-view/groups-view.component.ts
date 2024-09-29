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
import { TokenData, TokenService } from 'src/app/services/token.service';
import { environment } from '@envs/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-groups-view',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterModule, ToolbarComponent, FooterComponent, LoaderComponent, TableComponent],
  templateUrl: './groups-view.component.html',
  styleUrl: './groups-view.component.css'
})
export class GroupsViewComponent implements OnInit, OnDestroy {
  error!: string;
  groupID!: string;
  groupInfo!: Group;
  groupList!: List[];
  loadReady: boolean = false;
  me: string
  members!: { uid: string, username: string }[];
  nIntervId: any
  reloadTable = false;

  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private groupsService: GroupsService,
    private listService: ListService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private token: TokenService,
    private userService: UserService,
    private clipboard: Clipboard,
    private snackbar: SnackbarService,
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

      console.log("🚀 ~ GroupsViewComponent ~ ngOnInit ~ groupInfo:", groupInfo)
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
    const payload: TokenData = { groupId: this.groupID, invitedBy: this.me, invitationDate: new Date() };
    const token = this.token.generarToken(payload);
    const url = `${environment.url}/addMember/${token}`

    this.clipboard.copy(url);
    this.snackbar.showSnackBar('El Link de invitación se te ha copiado en el porta papeles', 'succes');
  }
}
