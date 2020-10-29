import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavigationService {
  private mealNavigate = new BehaviorSubject(false);
  private navbarNavigate = new BehaviorSubject(0);
  constructor() {
  }
  returnMealSubject() {
    return this.mealNavigate;
  }
  changeMealSubject(value) {
    this.mealNavigate.next(value);
  }
  returnNavSubject() {
    return this.navbarNavigate;
  }
  changeNavSubject(value) {
    this.navbarNavigate.next(value);
  }

}
