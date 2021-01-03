import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AirPollutionService {
  constructor(private http: HttpClient) {
  }
  // do serwera
  getStations() {
    return this.http.get('https://nfl-center-api.herokuapp.com/api/pollutions');
  }
  getStationsInfo(value) {
    return this.http.get('https://nfl-center-api.herokuapp.com/api/pollutions/' + value);
  }
}
