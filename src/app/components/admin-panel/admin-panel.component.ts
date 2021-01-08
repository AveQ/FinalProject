import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';
import {FoodService} from '../../services/food.service';
import {ExerciseService} from '../../services/exercise.service';
import {UserService} from '../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';

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
  mealForm: FormGroup;
  exerciseForm: FormGroup;
  selectedFile: File = null;

  constructor(private foodService: FoodService,
              private exerciseService: ExerciseService,
              private userService: UserService,
              private modalService: NgbModal,
              private navigateService: NavigationService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Admin | NFL-Center');
    this.navigateService.changeNavSubject(7);
    this.loadMeals();
    this.loadExercise();
    this.loadUsers();
    this.mealForm = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        oneServing: new FormControl(null, Validators.required),
        kcal: new FormControl(null, Validators.required),
        proteins: new FormControl(null, Validators.required),
        carbs: new FormControl(null, Validators.required),
        fats: new FormControl(null, Validators.required),
        salt: new FormControl(null, Validators.required),
        fiber: new FormControl(null, Validators.required)
      }
    );
    this.exerciseForm = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        musclePart: new FormControl(null, Validators.required),
        image: new FormControl(null, Validators.required),
        difficult: new FormControl(null, Validators.required),
        kcalRatio: new FormControl(null, Validators.required),
      }
    );
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }

  openSm(content) {
    console.log('xd');
    this.modalService.open(content, {size: 'sm'});
    // this.myMealProp = value;
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

  onSubmitExercise() {
    console.log(this.exerciseForm.value);
    const uploadData = new FormData();
    uploadData.append('name', this.exerciseForm.get('name').value);
    uploadData.append('type', this.exerciseForm.get('type').value);
    uploadData.append('description', this.exerciseForm.get('description').value);
    uploadData.append('musclePart', this.exerciseForm.get('musclePart').value);
    uploadData.append('difficult', this.exerciseForm.get('difficult').value);
    uploadData.append('kcalRatio', this.exerciseForm.get('kcalRatio').value);
    uploadData.append('image', this.selectedFile, this.selectedFile.name);
    console.log(uploadData);
    this.exerciseService.postExercise(uploadData).subscribe(
      data => {
      },
      error => {
      },
      () => {
        console.log('done');
      }
    );
  }

  onSubmitMeal() {
    console.log(this.mealForm.value);
    this.foodService.postMeal(this.mealForm.value).subscribe(
      data => {
        console.log(data);
      },
      error => {
      },
      () => {
        this.loadMeals();
        this.modalService.dismissAll();
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
