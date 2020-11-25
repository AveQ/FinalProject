/*
  Model posiłku z historii uzytkownika. Zawiera potrzebne informacje do przesyłania danych.
*/
export class MealHistory {
  constructor(
    public idMeal: number,
    public mealAmong: number,
  ) {
  }

}
