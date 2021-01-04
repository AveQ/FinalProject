import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AirPollutionService {

  private urlLocal = 'http://localhost:3000';
  private urlHeroku = 'https://nfl-center-api.herokuapp.com';
  constructor(private http: HttpClient) {
  }
  // do serwera
  getStations() {
    return this.http.get(this.urlLocal + '/api/pollutions');
  }
  getStationsInfo(value) {
    return this.http.get(this.urlLocal + '/api/pollutions/' + value);
  }
}
