import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AllExerciseModel, ExerciseModel} from '../model/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private http: HttpClient) {
  }

  getAllExercises() {
    return this.http.get<AllExerciseModel>('http://localhost:3000/exercises/');
  }

  getExercise(exerciseId) {
    return this.http.get<ExerciseModel>('http://localhost:3000/exercises/' + exerciseId);
  }
}
