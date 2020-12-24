import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AllExerciseModel, ExerciseModel} from '../model/exercise.model';
import {ExerciseHistoryModel} from '../model/exerciseHistory.model';

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

  loadTodayExercisesHistory() {
    return this.http.get<ExerciseHistoryModel>('http://localhost:3000/userExercisesHistory/');
  }

  loadUserAllHistory(id) {
    return this.http.get<ExerciseHistoryModel>('http://localhost:3000/userExercisesHistory/users/' + id);
  }

  postUserHistory(newUserHistory) {
    return this.http.post('http://localhost:3000/userExercisesHistory', newUserHistory);
  }

  patchUserHistory(id, toChange, newValue) {
    return this.http.patch('http://localhost:3000/userExercisesHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  postExercise(exercise) {
    return this.http.post('http://localhost:3000/exercises/', exercise);
  }
}
