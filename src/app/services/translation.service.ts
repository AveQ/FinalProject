import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translation = new BehaviorSubject('PL');

  constructor() {
  }

  returnTranslationStatus() {
    return this.translation.getValue();
  }
  changeTranslationStatus(value) {
    console.log(value);
    this.translation.next(value);
  }
}
