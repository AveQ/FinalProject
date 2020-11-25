import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {NavigationService} from '../../services/navigation.service';
import {Subscription} from 'rxjs';

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
  selector: 'app-food--panel',
  templateUrl: './food-panel.component.html',
  styleUrls: ['./food-panel.component.scss']
})
export class FoodPanelNewComponent implements OnInit, OnDestroy {

  activeMenuCategory = 0;
  updateMeal = false;
  myNavSubject: Subscription;
  meals = [
    {
      name: 'śniadnie',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-breakfast'
    },
    {
      name: 'II śniadanie',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-sec'
    },
    {
      name: 'Obiad',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-din'
    },
    {
      name: 'Podwieczorek',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-br'
    },
    {
      name: 'Kolacja',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-sup'
    },
    {
      name: 'Dodatkowe',
      kcal: '231kcal',
      carb: '1000g',
      proteins: '1010g',
      fats: '1032g',
      classForMeal: 'imageMeal-add'
    }
  ];

  currentDate = '27.07.20 - wtorek';
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
  stat: boolean = false;
  isOpen = false;

  constructor(private navigateService: NavigationService) {

  }

  ngOnInit(): void {
    this.setMaxAndMinDate();
    this.setDate(new Date().getTime());
    this.myNavSubject  = this.navigateService.returnMealSubject().subscribe(
      value => {
        this.updateMeal = value;
      }
    );
    this.navigateService.changeNavSubject(1);
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
