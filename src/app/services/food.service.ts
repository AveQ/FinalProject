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

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {
  }

  getInfoMeal(id) {
    return this.http.get<MealResponseData>('http://localhost:3000/meals/' + id);
  }

  loadData(id) {
    return this.http.get<FoodResponseData>('http://localhost:3000/mealsHistory/' + id);
  }
}
