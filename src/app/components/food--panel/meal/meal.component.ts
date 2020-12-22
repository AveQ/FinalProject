import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NavigationService} from '../../../services/navigation.service';
import {FoodService} from '../../../services/food.service';
import * as _ from 'lodash';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';

interface Meal {
  carbs: number;
  fats: number;
  fiber: number;
  kcal: number;
  name: string;
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
  page = 1;
  typeOfDB = null;
  @Input() arrayWithId;
  @Input() objectFromParent;
  // zaladuj ponownie
  @Output() loadMealsAgain = new EventEmitter<void>();
  paramsSubscription: Subscription;
  private userSubscription;
  private user;

  constructor(
    private modalService: NgbModal,
    private navigateService: NavigationService,
    private foodService: FoodService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
        }
      }
    );
    this.loadMeals();
    console.log(this.objectFromParent);
    this.router.navigate(
      ['/food-panel/meals'],
      {
        queryParams: {active: this.objectFromParent.index},
        queryParamsHandling: 'merge'
      });

    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        console.log(params.active);
      }
    );
  }

  isThereUser() {
    return !!this.user;
  }

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

  loadMeals() {
    const ids = this.arrayWithId.ids;
    let mealTemp;
    for (const element in ids) {
      if (ids.hasOwnProperty(element)) {
        const amountTemp = ids[element].amount;
        this.foodService.getInfoMeal(ids[element].id).subscribe(
          data => {
            mealTemp = {
              carbs: data.carbs * amountTemp,
              fats: data.fats * amountTemp,
              fiber: data.fiber * amountTemp,
              kcal: data.kcal * amountTemp,
              name: data.name,
              proteins: data.proteins * amountTemp,
              salt: data.salt * amountTemp,
              id: data._id,
              amount: 100 * amountTemp,
            };
            this.meal.push(mealTemp);
          }, error => {
          }, () => {
          }
        );
      }
    }
  }

  loadDBData() {
    this.foodService.getAllMeals().subscribe(
      data => {
        this.mealDB = data.meals;
      },
      error => {
      },
      () => {
      }
    );
  }

  // pobierz meal_x zeby zmodyfikowac
  addProduct(modal, value, mealObject) {
    const portion = +value.value / 100;
    if (portion !== null && portion >= 0) {
      console.log(mealObject._id);
      let tempMeal;
      const name = 'meal_' + (this.objectFromParent.index + 1);
      this.foodService.loadDataHistoryMeal(this.objectFromParent.id).subscribe(
        data => {
          tempMeal = data[name];
        },
        error => {
        },
        () => {
          tempMeal.push({
            idMeal: mealObject._id,
            mealAmong: portion
          });
          this.editUserMeal(name, tempMeal);
          console.log(tempMeal);
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
          idMeal:
          objectMeal.id, mealAmong: objectMeal.amount / 100
        });
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
