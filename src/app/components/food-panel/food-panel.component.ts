import {Component, OnInit} from '@angular/core';
import {Meals} from '../models/meals.model';
import {MealMOK} from '../MOK/mealMOK.services';

@Component({
  selector: 'app-food-panel',
  templateUrl: './food-panel.component.html',
  styleUrls: ['./food-panel.component.scss']
})
export class FoodPanelComponent implements OnInit {

  currentDate = '27.07.20 - wtorek';
  date = new Date().toISOString().substr(0, 10);
  maxDate;
  minDate;
  meals = [];

  constructor(private mealMOK: MealMOK) {
  }

  ngOnInit(): void {
    this.meals = this.mealMOK.meals;
    this.setMaxAndMinDate();
  }

  setMaxAndMinDate() {
    this.minDate = new Date(new Date().getTime() - 86400000 * 30).toISOString().substr(0, 10);
    this.maxDate = new Date(new Date().getTime() + 86400000 * 30).toISOString().substr(0, 10);
  }

  addNewMeal() {
    this.mealMOK.addNewMeal();
  }
  dailyStatistics() {

  }
}
