import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class NFLInterceptorService implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
      setHeaders: {
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }});
    return next.handle(req);
  }
}
