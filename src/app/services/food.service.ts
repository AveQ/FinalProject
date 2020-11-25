import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MealHistory} from '../model/mealHistory.model';

export interface FoodResponseData {
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

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {
  }

  loadData(id) {
    return this.http.get<FoodResponseData>('http://localhost:3000/mealsHistory/' + id);
  }
}
