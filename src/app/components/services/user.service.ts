import {Injectable} from '@angular/core';

@Injectable()
export class UserService {
  private userName: string = 'Sign up';

  getUserName(): string {
    return this.userName;
  }
}
