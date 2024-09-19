import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { AuthService } from '@auth/auth.service';
import { Group } from '@components/groups/groups.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private listCollection: CollectionReference<DocumentData>;

  constructor(
    private auth: AuthService,
    private readonly firestore: Firestore
  ) {
    this.listCollection = collection(this.firestore, 'groups');
  }

  getMyGroups(): Observable<Group[]> {
    const uid = this.auth.UserData.uid;
    return collectionData(query(this.listCollection, where('members','array-contains', uid)), {
      idField: 'id',
    }) as Observable<Group[]>;
  }

  createGroup(group:Group) {
    return addDoc(this.listCollection, group);
  }

}
