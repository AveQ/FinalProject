import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AllExerciseModel, ExerciseModel} from '../model/exercise.model';
import {ExerciseHistoryModel} from '../model/exerciseHistory.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private urlLocal = 'https://nfl-center-api.herokuapp.com';

  constructor(private http: HttpClient) {
  }

  getAllExercises() {
    return this.http.get<AllExerciseModel>(this.urlLocal + '/api/exercises/');
  }

  getExercise(exerciseId) {
    return this.http.get<ExerciseModel>(this.urlLocal + '/api/exercises/' + exerciseId);
  }

  loadTodayExercisesHistory() {
    return this.http.get<ExerciseHistoryModel>(this.urlLocal + '/api/userExercisesHistory/');
  }

  loadUserAllHistory(id) {
    return this.http.get<ExerciseHistoryModel>(this.urlLocal + '/api/userExercisesHistory/users/' + id);
  }

  postUserHistory(newUserHistory) {
    return this.http.post<{message: string, createdExercise}>(this.urlLocal + '/api/userExercisesHistory', newUserHistory);
  }

  patchUserHistory(id, toChange, newValue) {
    return this.http.patch(this.urlLocal + '/api/userExercisesHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  postExercise(exercise) {
    return this.http.post(this.urlLocal + '/api/exercises/', exercise);
  }

  patchExercise(id, toChange, newValue) {
    return this.http.patch(this.urlLocal + '/api/exercises/' + id, [{'propName': toChange, 'value': newValue}]);
  }

}
