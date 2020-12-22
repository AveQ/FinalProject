import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MealHistory} from '../model/mealHistory.model';

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
    return this.http.get<MealResponseData>('http://localhost:3000/meals/' + id);
  }

  loadData(id) {
    return this.http.get<FoodResponseData>('http://localhost:3000/mealsHistory/users/' + id);
  }

  loadDataHistoryMeal(id) {
    return this.http.get<FoodResponseData>('http://localhost:3000/mealsHistory/meals/' + id);
  }

  patchWaterData(id, toChange, newValue) {
    return this.http.patch('http://localhost:3000/mealsHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  getAllMeals() {
    return this.http.get<MealResponseAllData>('http://localhost:3000/meals/');
  }

  postUserHistory(value) {
    return this.http.post<{createdExercise, id, message}>('http://localhost:3000/mealsHistory/', value);
  }

  isDecrease(idUser) {
    this.http.get('http://localhost:3000/mealsHistory/users/' + idUser).subscribe(
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
}
