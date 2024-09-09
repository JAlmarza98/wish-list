import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loadState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  ShowLoader() {
    this.loadState.next(true);
  }

  HideLoader() {
    this.loadState.next(false);
  }
}
