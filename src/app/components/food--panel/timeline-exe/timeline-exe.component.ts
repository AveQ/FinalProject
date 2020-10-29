import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';

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

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline-exe.component.html',
  styleUrls: ['./timeline-exe.component.scss']
})
export class TimelineExeComponent implements OnInit, OnDestroy {
  activeMenuCategory = 0;
  updateMeal = false;
  myNavSubject: Subscription;
  exercises = [
    {
      id: 1,
      name: 'bieganie',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 2,
      name: 'rowerek',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 3,
      name: 'kajak',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 4,
      name: 'wyciskanie na ławce skośnej',
      kind: 'Siłowe',
      time: 160,
      burn: 540
    }
  ];
  private counter = 0;
  private maxDays = 30;
  currentDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  nextDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  previousDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  maxDate;
  minDate;

  bars = [
    {
      name: 'Kalorie',
      current: 1245,
      max: 223322,
      value: 80,
      type: 'success'
    },
    {
      name: 'Białko',
      current: 1245,
      max: 2222,
      value: 35,
      type: 'success'
    },
    {
      name: 'Tłuszcze',
      current: 1245,
      max: 2222,
      value: 90,
      type: 'danger'
    },
    {
      name: 'Węglow.',
      current: 1245,
      max: 2222,
      value: 23,
      type: 'success'
    }
  ];
  finalExerciseArray = [];
  stat: boolean = false;
  isOpen = false;

  constructor(private navigateService: NavigationService) {
  }

  setFilter(value) {
    this.finalExerciseArray = [];
    if(value === 'wszystkie') {
      this.finalExerciseArray = this.exercises;
    } else {
      this.exercises.find(element =>{
        if (element.kind === value) {
          this.finalExerciseArray.push(element);
        }
      });
    }
  }

  ngOnInit(): void {
    this.setMaxAndMinDate();
    this.setDate(new Date().getTime());
    this.myNavSubject = this.navigateService.returnMealSubject().subscribe(
      value => {
        this.updateMeal = value;
      }
    );
    this.navigateService.changeNavSubject(2);
    this.finalExerciseArray = this.exercises;
  }

  changeMealStatus(value) {
    this.navigateService.changeMealSubject(value);
  }

  setMaxAndMinDate() {
    this.minDate = new Date(new Date().getTime() - 86400000 * 30).toISOString().substr(0, 10);
    this.maxDate = new Date(new Date().getTime() + 86400000 * 30).toISOString().substr(0, 10);
  }


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
  }

  calcDate(time) {
    return new Date(time).toISOString().substr(8, 2)
      + '.' +
      new Date(time).toISOString().substr(5, 2);
  }

  changeDate(date, status: boolean) { // false - previous date, true - next date
    if (this.counter < this.maxDays && status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    } else if (this.counter > (-this.maxDays) && !status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    }
  }


  ngOnDestroy(): void {
    this.changeMealStatus(false);
    this.myNavSubject.unsubscribe();
  }
}
