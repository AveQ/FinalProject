import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface MuscleResponseData {
  count: number;
  muscles: [
    {
      _id: string,
      name: string,
      namePL: string,
      dbName: string,
      description: string,
      descriptionPL: string
    }
  ];
}


@Injectable({
  providedIn: 'root'
})
export class MusclesService {
  private urlLocal = 'https://nfl-center-api.herokuapp.com';

  constructor(private http: HttpClient) {
  }

  getMuscles() {
    return this.http.get<MuscleResponseData>(this.urlLocal + '/api/muscles');
  }

}
