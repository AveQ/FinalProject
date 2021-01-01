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
      request;
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {
  }

  // dane podstawowe do obsługi komponentu - szablon
  private meal = [
    {
      name: 'śniadnie',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-breakfast',
      ids: []
    },
    {
      name: 'II śniadanie',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-sec',
      ids: []
    },
    {
      name: 'Obiad',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-din',
      ids: []
    },
    {
      name: 'Podwieczorek',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-br',
      ids: []
    },
    {
      name: 'Kolacja',
      kcal: 0,
      carb: 0,
      proteins: 0,
      fats: 0,
      classForMeal: 'imageMeal-sup',
      ids: []
    },
    {
      name: 'Dodatkowe',
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
    return this.http.get<MealResponseData>('https://localhost:3000/meals/' + id);
  }

  loadData(id) {
    return this.http.get<FoodResponseData>('https://localhost:3000/mealsHistory/users/' + id);
  }

  loadDataHistoryMeal(id) {
    return this.http.get<FoodResponseData>('https://localhost:3000/mealsHistory/meals/' + id);
  }

  postMeal(value) {
    return this.http.post('https://localhost:3000/meals/', value);
  }

  patchWaterData(id, toChange, newValue) {
    return this.http.patch('https://localhost:3000/mealsHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  getAllMeals() {
    return this.http.get<MealResponseAllData>('https://localhost:3000/meals/');
  }

  postUserHistory(value) {
    return this.http.post<{ createdExercise, id, message }>('https://localhost:3000/mealsHistory/', value);
  }

  isDecrease(idUser) {
    this.http.get('https://localhost:3000/mealsHistory/users/' + idUser).subscribe(
      data => {
        console.log(data);
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
}
