import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NavigationService} from '../../../services/navigation.service';
import {FoodService} from '../../../services/food.service';
import * as _ from 'lodash';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

interface Meal {
  carbs: number;
  fats: number;
  fiber: number;
  kcal: number;
  name: string;
  namePL: string;
  proteins: number;
  salt: number;
  id: string;
  amount: string;
}

interface MealDB {
  _id: string;
  carbs: number;
  kcal: number;
  fiber: number;
  oneServing: number;
  proteins: number;
  salt: number;
  fats: number;
  name: string;
  namePL: string;
  request;
}


@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss']
})
export class MealComponent implements OnInit, OnDestroy {

  nameOfMeal = 'śniadnie';
  myMealProp: Meal;
  meal: Meal[] = [];
  mealDB: MealDB[] = [];
  page = 0;
  typeOfDB = null;
  @Input() arrayWithId;
  @Input() objectFromParent;
  // zaladuj ponownie
  @Output() loadMealsAgain = new EventEmitter<void>();
  paramsSubscription: Subscription;
  private userSubscription;
  private user;
  private arrayMealName = [
    'śniadanie',
    'II śniadanie',
    'obiad',
    'podwieczorek',
    'kolacja',
    'dodatkowe'
  ];
  private arrayMealNameEN = [
    'breakfast',
    'II breakfast',
    'dinner',
    'snack',
    'supper',
    'extra meal'
  ];
  emptyFlag = true;
  tempArray = [];
  paginationArray = [];
  language = 'PL';

  constructor(
    private modalService: NgbModal,
    private navigateService: NavigationService,
    private foodService: FoodService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
        }
      }
    );

    this.loadMeals();

    this.router.navigate(
      ['/food-panel/meals'],
      {
        queryParams: {active: this.objectFromParent.index},
        queryParamsHandling: 'merge'
      });

    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.setMealName(params.active);
      }
    );
  }

  searchMeal(name) {
    this.page = 0;
    this.tempArray = this.mealDB.filter(mel => {
      if (mel.name.toUpperCase().includes(name.value.toUpperCase())) {
        return mel;
      }
    });
    this.createTable();
    name.value === '' ? this.emptyFlag = true : this.emptyFlag = false;
  }

  createTable() {
    this.paginationArray = [];
    const firstElement = this.page * 5;
    if (firstElement < this.tempArray.length) {
      this.paginationArray = this.tempArray.slice(this.page * 5, this.page * 5 + 5);
    }
  }

  isNext() {
    return (this.page * 5 + 6) <= this.tempArray.length;
  }

  otherPage(value) {
    if (value && this.isNext()) {
      this.page++;
      this.createTable();
    } else if (!value) { // poprzednia strona
      this.page--;
      this.createTable();
    }
  }

  setMealName(param) {
    if (this.language === 'PL') {
      this.nameOfMeal = this.arrayMealName[param];
    } else {
      this.nameOfMeal = this.arrayMealNameEN[param];
    }
  }

  isThereUser() {
    return !!this.user;
  }

  // zmienic tylko na 1 tryb
  changeTypeOfDataBase(value) {
    this.typeOfDB = value;
    switch (value) {
      case'application':
        this.loadDBData();
        break;
      case'wlasna':
        break;
    }
  }

  navigate() {
    this.navigateService.changeMealSubject(false);
    this.router.navigate(['/food-panel/meals'], {queryParams: null});
    this.loadMealsAgain.emit();
  }

  openSm(content, value) {
    this.modalService.open(content, {size: 'sm'});
    this.myMealProp = value;
  }

  async loadMeals() {

    this.meal = await this.foodService.loadMeals(this.arrayWithId, this.meal);
  }


  loadDBData() {
    this.foodService.getAllMeals().subscribe(
      data => {
        this.mealDB = data.meals;
        console.log(this.mealDB);
      },
      error => {
      },
      () => {
        this.tempArray = this.mealDB;
        this.createTable();
      }
    );
  }

  // pobierz meal_x zeby zmodyfikowac
  addProduct(modal, value, mealObject) {
    const portion = +value.value / 100;
    if (portion !== null && portion >= 0) {
      console.log(mealObject._id);
      const name = 'meal_' + (this.objectFromParent.index + 1);
      console.log(mealObject);
      const tempMeal: Meal = {
        amount: value.value + '',
        carbs: mealObject.carbs * portion,
        fats: mealObject.fats * portion,
        fiber: mealObject.fiber * portion,
        id: mealObject._id,
        kcal: mealObject.kcal * portion,
        name: mealObject.name,
        namePL: mealObject.namePL,
        proteins: mealObject.proteins * portion,
        salt: mealObject.salt * portion
      };
      this.meal.push(tempMeal);
      console.log(this.meal);
      let tempEditMeal;
      this.foodService.loadDataHistoryMeal(this.objectFromParent.id).subscribe(
        data => {
          tempEditMeal = data[name];
        },
        error => {
        },
        () => {
          tempEditMeal.push({
            idMeal: mealObject._id,
            mealAmong: portion
          });
          this.editUserMeal(name, tempEditMeal);
        }
      );
    } else {
      console.log('Incorrect input value');
    }
    this.modalService.dismissAll();
  }

  editUserMeal(name, newValue) {
    this.foodService.patchWaterData(this.objectFromParent.id, name, newValue).subscribe(
      data => {
        console.log(data);
      },
      error => {
      },
      () => {
      });
  }

  deleteUserMeal(objectMeal) {
    let tempMeal;
    const name = 'meal_' + (this.objectFromParent.index + 1);
    this.foodService.loadDataHistoryMeal(this.objectFromParent.id).subscribe(
      data => {
        tempMeal = data[name];
      },
      error => {
      },
      () => {
        const index = _.findLastIndex(tempMeal, {
          idMeal: objectMeal.id, mealAmong: objectMeal.amount / 100
        });
        const indexMealArray = _.findLastIndex(this.meal, {
          id: objectMeal.id, amount: objectMeal.amount
        });
        console.log(indexMealArray);
        this.meal = this.meal.slice(0, indexMealArray).concat(this.meal.slice(indexMealArray + 1));
        tempMeal = tempMeal.slice(0, index).concat(tempMeal.slice(index + 1));
        this.editUserMeal(name, tempMeal);
      }
    );
    console.log(objectMeal);
  }

  ngOnDestroy(): void {
    this.meal = [];
  }
}
