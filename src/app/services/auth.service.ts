import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {User} from '../model/user.model';
import {BehaviorSubject} from 'rxjs';
import {SocialUser} from 'angularx-social-login';
import {CrossOrigin} from '@angular-devkit/build-angular/src/browser/schema';

export interface AuthResponseData {
  id: string;
  email: string;
  token: string;
  expirationDate: string;
  user: {
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
    userFavExercises: []
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
  }

  autoLogin() {
    const userData: {
      id: string,
      email: string,
      token: string,
      tokenExpirationDate: string,
      user: {
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
        physicalActivity: number
      }
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.id, userData.email, userData.token,
      new Date(userData.tokenExpirationDate), userData.user);

    if (loadedUser.myToken) {
      this.user.next(loadedUser);
    }
  }

  signup(value) {
    return this.http.post<AuthResponseData>('http://localhost:3000/users/signup', value);
  }

  login(value) {
    return this.http.post<AuthResponseData>('http://localhost:3000/users/login', value).pipe(
      tap(resData => {
        this.handleAuthentication(resData.id, resData.email, resData.token, resData.expirationDate, resData.user);
      })
    );
  }

  private handleAuthentication(id, email, token, expirationDate, use) {
    const expDate = new Date(new Date().getTime() + +expirationDate * 1000); // one hour expiration
    const user = new User(id, email, token, expDate, use);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    localStorage.clear();
  }
}
