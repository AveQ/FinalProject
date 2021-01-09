import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MealHistory} from '../model/mealHistory.model';
import {async} from 'rxjs/internal/scheduler/async';

export interface FoodResponseData {
  count: number;
  mealHistory: [
    {
      id: string;
      idUser: string;
      date: string;
      meal_1: MealHistory;
      meal_2: MealHistory;
      meal_3: MealHistory;
      meal_4: MealHistory;
      meal_5: MealHistory;
      meal_6: MealHistory;
    }
  ];
}

export interface MealResponseData {
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

export interface MealResponseAllData {
  count: number;
  meals: [
    {
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
  ];
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private urlLocal = 'https://nfl-center-api.herokuapp.com';

  constructor(private http: HttpClient) {
  }

  // dane podstawowe do obsługi komponentu - szablon
  private meal = [
    {
      name: 'śniadnie',
      nameEN: 'Breakfast',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-breakfast',
      ids: []
    },
    {
      name: 'II śniadanie',
      nameEN: 'II Breakfast',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-sec',
      ids: []
    },
    {
      name: 'Obiad',
      nameEN: 'Dinner',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-din',
      ids: []
    },
    {
      name: 'Podwieczorek',
      nameEN: 'Snack',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-br',
      ids: []
    },
    {
      name: 'Kolacja',
      nameEN: 'Supper',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-sup',
      ids: []
    },
    {
      name: 'Dodatkowe',
      nameEN: 'Extra meal',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-add',
      ids: []
    }
  ];

  // metody do serwera

  getInfoMeal(id) {
    return this.http.get<MealResponseData>(this.urlLocal + '/api/meals/' + id);
  }

  loadData(id) {
    return this.http.get<FoodResponseData>(this.urlLocal + '/api/mealsHistory/users/' + id);
  }

  loadDataHistoryMeal(id) {
    return this.http.get<FoodResponseData>(this.urlLocal + '/api/mealsHistory/meals/' + id);
  }

  postMeal(value) {
    return this.http.post(this.urlLocal + '/api/meals/', value);
  }

  patchWaterData(id, toChange, newValue) {
    return this.http.patch(this.urlLocal + '/api/mealsHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  getAllMeals() {
    return this.http.get<MealResponseAllData>(this.urlLocal + '/api/meals/');
  }

  postUserHistory(value) {
    return this.http.post<{ createdExercise, id, message }>(this.urlLocal + '/api/mealsHistory/', value);
  }

  isDecrease(idUser) {
    this.http.get(this.urlLocal + '/api/mealsHistory/users/' + idUser).subscribe(
      data => {
      }, error => {
      },
      () => {
      }
    );
  }

  // logika

  getMeal() {
    return this.meal;
  }

  async loadMeals(arrayWithId, meal) {
    meal = [];
    const ids = arrayWithId.ids;
    let mealTemp;
    for (const element in ids) {
      if (ids.hasOwnProperty(element)) {
        const amountTemp = ids[element].amount;
        await this.getInfoMeal(ids[element].id).subscribe(
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
              amount: (100 * amountTemp).toFixed(1),
            };
            meal.push(mealTemp);
          }, error => {
          }, () => {

          }
        );
      }
    }
    return meal;
  }

  // sumowanie wszystkich posilkow



}
