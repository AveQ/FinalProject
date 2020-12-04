import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NavigationService} from '../../../services/navigation.service';
import {FoodService} from '../../../services/food.service';

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

  showMoreInfo(data) {
  }

  constructor(private modalService: NgbModal, private navigateService: NavigationService, private foodService: FoodService) {
  }

  ngOnInit(): void {
    this.loadMeals();
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

  addProduct(modal, value) {
    let tempMeal;
    let portion = value.value;
    let name = 'meal_' + (this.objectFromParent.index + 1);
    // this.foodService.loadDataHistoryMeal(this.objectFromParent.id).subscribe(
    //   data => {
    //     tempMeal = data.mealHistory[0][name];
    //   },
    //   error => {
    //   },
    //   () => {
    //     this.editUserMeal();
    //   }
    // );
    // this.modalService.dismissAll();
    this.editUserMeal(name);
  }

  editUserMeal(meal) {
    this.foodService.patchWaterData(this.objectFromParent.id, meal, [
      {
        "idMeal": "5fc0147f03284e4554db7262",
        "mealAmong": 11
      }
    ]).subscribe(
      data => {
        console.log(meal);
      },
      error => {
      },
      () => {
        console.log('juz');
      });
  }

  ngOnDestroy(): void {
    this.meal = [];
  }
}
