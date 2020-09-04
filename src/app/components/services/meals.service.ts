import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class MealsService {
  isMealOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  changeSidebar(value) {
    this.isMealOpen.next(value);
  }

}
