import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';
import {FoodService} from '../../services/food.service';
import {ExerciseService} from '../../services/exercise.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  allMeals;
  mealsPadding;
  mealPage = 0;
  allExercises;
  exercisesPadding;
  exercisePage = 0;
  allUsers;
  usersPadding;
  userPage = 0;

  constructor(private foodService: FoodService,
              private exerciseService: ExerciseService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadMeals();
    this.loadExercise();
    this.loadUsers();
  }

  loadMeals() {
    this.foodService.getAllMeals().subscribe(
      data => {
        this.allMeals = data.meals;
        for (const elem of this.allMeals) {
          elem.delete = false;
        }
      },
      error => {
      },
      () => {
        this.mealsPadding = this.allMeals.slice(this.mealPage * 5, this.mealPage * 5 + 5);
      }
    );
  }
  loadUsers() {
    this.userService.getAllUsers().subscribe(
      data => {
        this.allUsers = data.users;
        console.log(this.allUsers);
      },
      error => {
      },
      () => {
        this.usersPadding = this.allUsers.slice(this.userPage * 5, this.userPage * 5 + 5);
      }
    );
  }
  loadExercise() {
    this.exerciseService.getAllExercises().subscribe(
      data => {
        this.allExercises = data.exercises;
        for (const elem of this.allExercises) {
          elem.delete = false;
        }
      },
      error => {
      },
      () => {
        this.exercisesPadding = this.allExercises.slice(this.exercisePage * 5, this.exercisePage * 5 + 5);
      }
    );
  }

  nextMeals(value) {
    if (value && this.isNext('meal')) {
      this.mealPage++;
    } else if (!value && !(this.mealPage <= 0)) {
      this.mealPage--;
    }
    this.mealsPadding = this.allMeals.slice(this.mealPage * 5, this.mealPage * 5 + 5);
  }
  nextUser(value) {
    if (value && this.isNext('user')) {
      this.userPage++;
    } else if (!value && !(this.userPage <= 0)) {
      this.userPage--;
    }
    this.usersPadding = this.allUsers.slice(this.userPage * 5, this.userPage * 5 + 5);
  }
  nextExercises(value) {
    if (value && this.isNext('exercise')) {
      this.exercisePage++;
    } else if (!value && !(this.exercisePage <= 0)) {
      this.exercisePage--;
    }
    this.exercisesPadding = this.allExercises.slice(this.exercisePage * 5, this.exercisePage * 5 + 5);
  }

  isNext(value) {
    if (value === 'meal') {
      return (this.mealPage * 5 + 6) <= this.allMeals.length;
    } else if (value === 'user') {
      return (this.userPage * 5 + 6) <= this.allUsers.length;
    } else if (value === 'exercise') {
      return (this.exercisePage * 5 + 6) <= this.allExercises.length;
    } else {
      return false;
    }
  }
}
