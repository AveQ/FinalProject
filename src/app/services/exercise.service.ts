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
    return this.http.get<AllExerciseModel>('https://nfl-center-api.herokuapp.com/exercises/');
  }

  getExercise(exerciseId) {
    return this.http.get<ExerciseModel>('https://nfl-center-api.herokuapp.com/exercises/' + exerciseId);
  }

  loadTodayExercisesHistory() {
    return this.http.get<ExerciseHistoryModel>('https://nfl-center-api.herokuapp.com/userExercisesHistory/');
  }

  loadUserAllHistory(id) {
    return this.http.get<ExerciseHistoryModel>('https://nfl-center-api.herokuapp.com/userExercisesHistory/users/' + id);
  }

  postUserHistory(newUserHistory) {
    return this.http.post('https://nfl-center-api.herokuapp.com/userExercisesHistory', newUserHistory);
  }

  patchUserHistory(id, toChange, newValue) {
    return this.http.patch('https://nfl-center-api.herokuapp.com/userExercisesHistory/' + id, [{'propName': toChange, 'value': newValue}]);
  }

  postExercise(exercise) {
    return this.http.post('https://nfl-center-api.herokuapp.com/exercises/', exercise);
  }
}
