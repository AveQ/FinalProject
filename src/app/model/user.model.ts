/*
  Model użytkownika. Zawiera potrzebne informacje do przesyłania danych.
*/
export class User {
  constructor(
    public id: string,
    public email: string,
    private token: string,
    private tokenExpirationDate: Date,
    public user: {
      id: string,
      nick: string,
      weight: number,
      height: number,
      gender: string,
      weeklyChange: number,
      country: string,
      age: number,
      language: string,
      target: string,
      forecast: string,
      userFavExercises,
      startingWeight: number,
      finalWeight: number,
      counterSignIn: number,
      ppm: number,
      cpm: number,
      physicalActivity: number,
      isAdmin: boolean,
      isRated: []
    }
  ) {
  }

  get myToken() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.token;
  }
}
