import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {AuthService} from '../../services/auth.service';
import {FoodResponseData, FoodService} from '../../services/food.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {TimeService} from '../../services/time.service';
import {MealHistory} from '../../model/mealHistory.model';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-food--panel',
  templateUrl: './food-panel.component.html',
  styleUrls: ['./food-panel.component.scss']
})
export class FoodPanelNewComponent implements OnInit, OnDestroy {

  private userSubscription;
  private myNavSubject: Subscription;
  // szablon kategorii - sniadanie, kolacja itp
  private userId;
  // wszystkie dni użytkownika
  private userMealHistory: FoodResponseData;
  // aktualny dzien uzytkownika - posilki
  private todayHistory;
  // uzytkownik
  private user;
  private newUserHistory = {
    idUser: '',
    date: 0,
    meal_1: [],
    meal_2: [],
    meal_3: [],
    meal_4: [],
    meal_5: [],
    meal_6: []
  };
  // dzien aktualnie wybrany
  currentDay;
  // dzien nastepny od aktualnie wybranego
  nextDay;
  // dzien poprzedni od aktualnie wybranego
  previousDay;
  meals;
  userWater = 0;
  arrayWithId;
  objectToChild;
  activeMenuCategory = 0;
  loading = true;
  updateMeal = false;
  historyId;
  summ = [
    {name: 'kcal', max: 0, today: 0},
    {name: 'proteins', max: 0, today: 0},
    {name: 'fats', max: 0, today: 0},
    {name: 'carbs', max: 0, today: 0}
  ];
  cpm;
  ppm;
  mealPDF = [];
  counterPDF = 1;
  language = 'pl';

  constructor(private navigateService: NavigationService,
              private authService: AuthService,
              private foodService: FoodService,
              private router: Router,
              private route: ActivatedRoute,
              private timeService: TimeService,
              private userService: UserService,
              private translate: TranslateService,
              private titleService: Title) {

  }

  ngOnInit(): void {
    this.titleService.setTitle('Meal | NFL-Center');
    this.language = this.translate.currentLang;
    this.userService.summ.subscribe(
      data => {
        if (data) {
          this.summ = data;
        }
      }
    );
    // serwisy i ustalanie sciezki
    this.meals = this.foodService.getMeal();
    this.setRoute();
    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
          this.userId = user.user.id;
        }
      }
    );
    // inicjacja daty
    this.timeService.setMaxAndMinDate();
    const createDate = this.timeService.setDate(new Date().getTime());
    this.currentDay = createDate[0];
    this.previousDay = createDate[1];
    this.nextDay = createDate[2];
    this.initFoodComponent();
    if (this.user) {
      this.ppm = this.userService.setPPM(this.user.user.gender,
        this.user.user.weight,
        this.user.user.height,
        this.user.user.age);
      this.cpm = this.userService.setCPM(this.user.user.physicalActivity, this.ppm) + (this.user.user.weeklyChange * 1000);
    }
  }

  initFoodComponent() {
    this.myNavSubject = this.navigateService.returnMealSubject().subscribe(
      value => {
        this.updateMeal = value;
      }
    );
    this.navigateService.changeNavSubject(1);
    if (this.user) {
      this.loadMealHistory();
    }
  }

  // załaduj historie do tablicy
  loadMealHistory() {
    this.loading = true;
    this.todayHistory = [];
    this.foodService.loadData(this.userId).subscribe(
      data => {
        this.userMealHistory = data;
      },
      err => {
      },
      () => {
        this.setTodayHistory();
      }
    );
  }

  // zmien date
  changeDate(date, status: boolean) {
    const createDate = this.timeService.changeDate(date, status);
    this.currentDay = createDate[0];
    this.previousDay = createDate[1];
    this.nextDay = createDate[2];
    this.initFoodComponent();
  }

  // znajdz dzisiejsza historie i pobierz ja do zmiennej oraz ustaw wszsytkie posilki w jedna tablice
  setTodayHistory() {
    this.mealPDF = [];
    this.summ[0].max = this.cpm;
    this.summ[1].max = this.userService.returnMacro(this.cpm)[0];
    this.summ[2].max = this.userService.returnMacro(this.cpm)[1];
    this.summ[3].max = this.userService.returnMacro(this.cpm)[2];
    this.summ[0].today = 0;
    this.summ[2].today = 0;
    this.summ[1].today = 0;
    this.summ[3].today = 0;
    this.meals = this.foodService.getMeal();
    this.todayHistory = _.find(this.userMealHistory, data => {
        // ustaw nawodnienie
        this.userWater = data.water;
        // zapisz id historii
        this.historyId = data._id;
        // ustaw posilki
        if (new Date(this.currentDay.time).getDate() === new Date(data.date).getDate() &&
          new Date(this.currentDay.time).getMonth() === new Date(data.date).getMonth()) {

          // przejdz przez wszystkie 6 posilkow
          for (let i = 1; i < 7; i++) {
            this.meals[i - 1].carb = 0;
            this.meals[i - 1].fats = 0;
            this.meals[i - 1].ids = 0;
            this.meals[i - 1].proteins = 0;
            this.meals[i - 1].kcal = 0;
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
                    _id.push({id: infoMeal._id, amount: data['meal_' + i][element].mealAmong});
                    tempMeal = infoMeal;
                    this.loadToPDF(infoMeal._id, data['meal_' + i][element].mealAmong);
                  },
                  error => {
                  },
                  () => {

                    this.meals[i - 1].carb = carbs;
                    this.meals[i - 1].fats = fats;
                    this.meals[i - 1].ids = _id;
                    this.meals[i - 1].proteins = proteins;
                    this.meals[i - 1].kcal = kcal;
                    this.summ[0].today += kcal;
                    this.summ[2].today += fats;
                    this.summ[1].today += proteins;
                    this.summ[3].today += carbs;
                    this.userService.summ.next(this.summ);
                    this.loading = false;
                  }
                );
              }
            }
          }
          return data;
        }
      }
    );
    if (this.todayHistory === undefined) {
      this.newUserHistory.date = this.currentDay.time;
      this.newUserHistory.idUser = this.userId;
      this.foodService.postUserHistory(this.newUserHistory).subscribe(
        history => {
          this.todayHistory = history.createdExercise;
          // ustaw nawodnienie
          this.userWater = 0;
          // zapisz id historii
          this.historyId = history.id;
        },
        error => {
        },
        () => {
          this.loading = false;
        }
      );
      for (let i = 1; i < 7; i++) {
        this.meals[i - 1].carb = 0;
        this.meals[i - 1].fats = 0;
        this.meals[i - 1].ids = 0;
        this.meals[i - 1].proteins = 0;
        this.meals[i - 1].kcal = 0;
      }
    }

    this.loading = false;
    this.userService.summ.next(
      this.summ
    );
  }

  loadToPDF(id, amount) {
    this.counterPDF = 1;
    // load pdf
    this.foodService.getInfoMeal(id).subscribe(info => {
        this.mealPDF.push(this.counterPDF + '. ' +
          info.name + ', ilosc: ' + (amount * 100).toFixed(0) + 'g');
        this.counterPDF++;
      }, error => {
      },
      () => {
      });
  }

  // sprawdz params i ustaw podstronke. jezeli inna od dozwolonych przekieruj na glowna
  setRoute() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      switch (params.get('active')) {
        case'meals': {
          this.activeMenuCategory = 0;
          break;
        }
        case'water': {
          this.activeMenuCategory = 1;
          break;
        }
        case'summary': {
          this.activeMenuCategory = 3;
          break;
        }
        case'exercises': {
          this.activeMenuCategory = 2;
          break;
        }
        default: {
          this.router.navigateByUrl(this.router.url.replace(params.get('active'), 'meals'));
          break;
        }
      }
    });
  }


  changeMealStatus(value, numberValue?) {

    this.navigateService.changeMealSubject(value);
    if (numberValue !== null) {
      this.loadMeals(numberValue);
    }
    if (this.user) {
      this.objectToChild = {
        index: numberValue,
        id: this.todayHistory._id
      };
    }

  }

  ngOnDestroy(): void {
    this.changeMealStatus(false);
    this.myNavSubject.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  loadMeals(value) {
    this.arrayWithId = this.meals[value];
  }


  // zwroc true-  jezeli uzytkownik jest zalogowany w przeciwnym wypadku false
  isThereUser() {
    return !!this.user;
  }
}
