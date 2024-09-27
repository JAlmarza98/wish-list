import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { AuthService } from '@auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private listCollection: CollectionReference<DocumentData>;

  constructor(
    private auth: AuthService,
    private readonly firestore: Firestore
  ) {
    this.listCollection = collection(this.firestore, 'user-name');
  }

  addUserName(username: string) {
    const uid = this.auth.UserData.uid;
    return addDoc(this.listCollection, {username, uid});
  }

  getMyUserName(): Observable<any[]> {
    const uid = this.auth.UserData.uid;
    return collectionData(query(this.listCollection, where('uid', '==', uid)), ) as Observable<any[]>;
  }

  getuserNameOfGroup(list: string[]): Observable<any[]> {
    return collectionData(query(this.listCollection, where('uid', 'in', list)), ) as Observable<any[]>;
  }
}
