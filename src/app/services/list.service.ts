import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, addDoc, collectionData, query, where, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '@auth/auth.service';
import { List, Wish } from '@components/list/list.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listCollection: CollectionReference<DocumentData>;

  constructor(
    private auth: AuthService,
    private readonly firestore: Firestore
  ) {
    this.listCollection = collection(this.firestore, 'user-lists');
  }

  getMyList(): Observable<List[]> {
    const uid = this.auth.UserData.uid;
    return collectionData(query(this.listCollection, where('uid', '==', uid)), {
      idField: 'id',
    }) as Observable<List[]>;
  }

  createList() {
    const list = {
      uid: this.auth.UserData.uid,
      list: []
    }
    return addDoc(this.listCollection, list);
  }

  updateMyList(listId: string, list: Wish[]) {
    const serviceDocumentReference = doc(
      this.firestore,
      `user-lists/${listId}`
    );
    return updateDoc(serviceDocumentReference, { list: list });
  }

  reserveElement(listId: string, modifiedList: Wish[]){
    const serviceDocumentReference = doc(
      this.firestore,
      `user-lists/${listId}`
    );
    return updateDoc(serviceDocumentReference, { list: modifiedList });
  }

  getGroupList(members: string[]) {
    return collectionData(query(this.listCollection, where('uid', 'in', members)), {
      idField: 'id',
    }) as Observable<List[]>;
  }
}
