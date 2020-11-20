/*
  Model użytkownika. Zawiera potrzebne informacje do przesyłania danych.
*/
export class User {
  constructor(
    public id: string,
    public email: string,
    private token: string,
    private tokenExpirationDate: Date,
  ) {
  }

  get myToken() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.token;
  }
}
