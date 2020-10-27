import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavigationService {
  private navigate = new BehaviorSubject(false);
  constructor() {
  }
  returnSubject() {
    return this.navigate;
  }
  changeSubject(value) {
    this.navigate.next(value);
  }

}
