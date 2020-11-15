import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AirPollutionService {
  constructor(private http: HttpClient) {
  }
  getStations() {
    return this.http.get('http://localhost:3000/pollutions');
  }
  getStationsInfo(value) {
    return this.http.get('http://localhost:3000/pollutions/' + value);
  }
}
