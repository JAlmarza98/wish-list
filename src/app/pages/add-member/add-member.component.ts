import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenData, TokenService } from 'src/app/services/token.service';
import { GroupsService } from '../../services/groups.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { AuthService } from '@auth/auth.service';
import { catchError, of, shareReplay, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';
import { Group } from '@components/groups/groups.component';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule],
  template: '',
  styles: ''
})
export class AddMemberComponent implements OnInit {

  token!: string;
  payloadData!: TokenData | null;
  groupInfo!: Group;
  me: string;
  errorMsg!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private groupsService: GroupsService,
    private snackbarService: SnackbarService,
    private auth: AuthService
  ) {
    this.route.url.pipe().subscribe(segments => {
      const segmentList = segments.map(x => x.toString());
      this.token = segmentList[1];
    });
    this.me = this.auth.UserData.uid;
  }

  ngOnInit(): void {
    this.payloadData = this.tokenService.desencriptarToken(this.token);

    if (this.payloadData === null) {
      this.snackbarService.showSnackBar('Parace que la url de invitación no es valida', 'error')
      this.router.navigate(['/']);
    } else {
      this.groupsService.getGroupInfo(this.payloadData.groupId).pipe(
        takeUntil(this.destroy$),
        take(1),
        switchMap(groupInfo => {
          if (groupInfo && !groupInfo[0].members.includes(this.payloadData?.invitedBy as string)) {
            this.errorMsg = 'Quien te invito ya no es miembro de este grupo.';
            return throwError(() => new Error(this.errorMsg));
          }
          if (groupInfo && groupInfo[0].members.includes(this.me)) {
            this.errorMsg = 'Ya eres miembro de este grupo.';
            return throwError(() => new Error(this.errorMsg));
          }
          return groupInfo
        }),
        catchError(error => {
          console.error('Error al obtener información del grupo:', error);
          return of(null);
        }),
        shareReplay(1)
      ).subscribe(groupInfo => {
        if (groupInfo === null) {
          this.snackbarService.showSnackBar(this.errorMsg, 'error')
          this.router.navigate(['/']);
        } else {
          this.groupsService.addToGroup(this.auth.UserData.uid, groupInfo).then(action => {
            this.snackbarService.showSnackBar('Has sido añadido al nuevo grupo', 'succes')
            this.router.navigate([`/group/${groupInfo.uid}`]);
          }).catch((err) => {
            this.snackbarService.showSnackBar('Parace que ha ocurrido un error al añadirse al grupo', 'error')
            this.router.navigate(['/']);
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
