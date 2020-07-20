import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavigationService {
  isOpenSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  changeSidebar(value) {
    this.isOpenSidebar.next(value);
  }
}
