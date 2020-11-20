import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {User} from '../components/user.model';
import {BehaviorSubject} from 'rxjs';

// export interface AuthResponseData  {
//   id: string;
//   email: string;
//   token: string;
//   expirationDate: string;
//   nick: string;
//   weight: number;
//   height: number;
//   gender: string;
//   weeklyChange: number;
//   country: string;
//   age: number;
//   language: string;
// }
export interface AuthResponseData {
  id: string;
  email: string;
  token: string;
  expirationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
  }

  getTheUser() {
    return this.user ? this.user : null;
  }

  signup(value) {
    return this.http.post<AuthResponseData>('http://localhost:3000/users/signup', value);
  }

  login(value) {
    return this.http.post<AuthResponseData>('http://localhost:3000/users/login', value).pipe(
      tap(resData => {
        this.handleAuthentication(resData.id, resData.email, resData.token, resData.expirationDate);
      })
    );
  }

  private handleAuthentication(id, email, token, expirationDate) {
    const expDate = new Date(new Date().getTime() + +expirationDate * 1000); // one hour expiration
    const user = new User(id, email, token, expDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
