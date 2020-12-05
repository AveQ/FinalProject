import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

class Day {
  name: string;
  date: string;
  time: number;
}

enum Days {
  'Niedziela' = 0,
  'Poniedziałek' = 1,
  'Wtorek' = 2,
  'Środa' = 3,
  'Czwartek' = 4,
  'Piątek' = 5,
  'Sobota' = 6
}

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private counter = 0;
  private maxDays = 30;
  // objekt na ktorym operuje linia czasu w aplikacji dla komponentow
  private currentDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  private nextDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  private previousDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  maxDate;
  minDate;

  constructor(private http: HttpClient) {
  }

  // ustaw date maksymalna do odtworzenia - 30 dni w lewo i 30 w prawo
  setMaxAndMinDate() {
    this.minDate = new Date(new Date().getTime() - 86400000 * 30).toISOString().substr(0, 10);
    this.maxDate = new Date(new Date().getTime() + 86400000 * 30).toISOString().substr(0, 10);
  }

  // stwórz objekt który przechowuje date jako - getTime(), nazwe dnia tygodnia oraz pelna date dla dnia
  // dzisiejszego, wczorajszego i nastepnego. Gdy uzytkownik zmieni date to w currentDay jest przechowywany inny dzien
  setDate(date) {
    // if date is not bigger or smaller than current date do it
    // enum
    const days = Days;
    // time
    this.currentDay.time = new Date(date).getTime();
    this.nextDay.time = this.currentDay.time + 86400000;
    this.previousDay.time = this.currentDay.time - 86400000;
    // date
    this.currentDay.date = this.calcDate(this.currentDay.time);
    this.nextDay.date = this.calcDate(this.nextDay.time);
    this.previousDay.date = this.calcDate(this.previousDay.time);
    // name
    this.currentDay.name = days[(new Date(this.currentDay.time).getDay())];
    this.nextDay.name = days[(new Date(this.nextDay.time).getDay())];
    this.previousDay.name = days[(new Date(this.previousDay.time).getDay())];
    return [this.currentDay, this.previousDay, this.nextDay];
  }

  // stworz odpowiednia date - sam dzien z miesiacem
  calcDate(time) {
    return new Date(time).toISOString().substr(8, 2)
      + '.' +
      new Date(time).toISOString().substr(5, 2);
  }

  // przesun dzien
  changeDate(date, status: boolean) {
    // false - previous date, true - next date
    if (this.counter < this.maxDays && status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    } else if (this.counter > (-this.maxDays) && !status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    }
    return [this.currentDay, this.previousDay, this.nextDay];
  }
}
