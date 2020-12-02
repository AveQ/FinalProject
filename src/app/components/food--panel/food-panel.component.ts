import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {NavigationService} from '../../services/navigation.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {AuthService} from '../../services/auth.service';
import {FoodService} from '../../services/food.service';

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

  userSubscription;
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
      classForMeal: 'imageMeal-breakfast',
      ids: []
    },
    {
      name: 'II śniadanie',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-sec',
      ids: []
    },
    {
      name: 'Obiad',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-din',
      ids: []
    },
    {
      name: 'Podwieczorek',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-br',
      ids: []
    },
    {
      name: 'Kolacja',
      kcal: '1000kcal',
      carb: '1000g',
      proteins: '1000g',
      fats: '1000g',
      classForMeal: 'imageMeal-sup',
      ids: []
    },
    {
      name: 'Dodatkowe',
      kcal: '231kcal',
      carb: '1000g',
      proteins: '1010g',
      fats: '1032g',
      classForMeal: 'imageMeal-add',
      ids: []
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

  userWater = 0;

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

  user;
  userId;

  // wszystkie dni użytkownika
  userMealHistory = [];
  // aktualny dzien uzytkownika - posilki
  todayHistory;

  constructor(private navigateService: NavigationService,
              private authService: AuthService,
              private foodService: FoodService) {

  }

  // załaduj historie do tablicy
  loadMealHistory() {
    this.foodService.loadData(this.userId).subscribe(
      data => {

        this.userMealHistory = data.mealHistory;
      },
      err => {
      },
      () => {
          this.setTodayHistory();
      }
    );
  }

  // znajdz dzisiejsza historie i pobierz ja do zmiennej oraz ustaw wszsytkie posilki w jedna tablice
  setTodayHistory() {
    this.todayHistory = _.find(this.userMealHistory, data => {
      if (new Date(this.currentDay.time).getDate() === new Date(data.date).getDate() &&
        new Date(this.currentDay.time).getMonth() === new Date(data.date).getMonth()) {
        // przejdz przez wszystkie 6 posilkow
        for (let i = 1; i < 7; i++) {
          // sprawdz wszystkie elementy dodane do posilku
          let _id = [];
          let carbs = 0;
          let kcal = 0;
          let fiber = 0;
          let proteins = 0;
          let salt = 0;
          let fats = 0;
          let name = '';
          for (const element in data['meal_' + i]) {
            if (data['meal_' + i].hasOwnProperty(element)) {
              let tempMeal;
              // pobierz dane o elemencie posilku
              this.foodService.getInfoMeal(data['meal_' + i][element].idMeal).subscribe(
                infoMeal => {
                  // valueTemp = valueTemp + valueMeal * portionMeal;
                  name = infoMeal.name;
                  fats = fats + (infoMeal.fats) * data['meal_' + i][element].mealAmong;
                  salt += infoMeal.salt * data['meal_' + i][element].mealAmong;
                  proteins += infoMeal.proteins * data['meal_' + i][element].mealAmong;
                  carbs += infoMeal.carbs * data['meal_' + i][element].mealAmong;
                  kcal += infoMeal.kcal * data['meal_' + i][element].mealAmong;
                  fiber += infoMeal.fiber * data['meal_' + i][element].mealAmong;
                  _id.push(infoMeal._id);
                  tempMeal = infoMeal;
                },
                error => {
                },
                () => {
                  this.meals[i - 1].carb = carbs + 'g';
                  this.meals[i - 1].fats = fats + 'g';
                  this.meals[i - 1].ids = _id;
                  this.meals[i - 1].proteins = proteins + 'g';
                  this.meals[i - 1].kcal = kcal + 'kcal';
                }
              );
            }
          }
        }

        return data;
      }
    });
    this.setInfoMeals();
  }

  // pobierz informacje o jedzeniu w posilkach
  setInfoMeals() {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.userId = user.user.id;
        }
      }
    );

    this.setMaxAndMinDate();
    this.setDate(new Date().getTime());
    this.myNavSubject = this.navigateService.returnMealSubject().subscribe(
      value => {
        this.updateMeal = value;
      }
    );
    this.navigateService.changeNavSubject(1);
    this.loadMealHistory();
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
    this.userSubscription.unsubscribe();
  }
}
