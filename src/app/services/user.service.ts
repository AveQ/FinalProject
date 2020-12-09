import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponseData} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  patchUserFavExercises(userId, toChange, newValue) {
    return this.http.patch('http://localhost:3000/users/' + userId, [{'propName': toChange, 'value': newValue}]);
  }

  getUserFavExercises(userId) {
    return this.http.get<AuthResponseData>('http://localhost:3000/users/' + userId);
  }
}
