import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ExerciseService} from '../../services/exercise.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExerciseModel} from '../../model/exercise.model';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-atlas',
  templateUrl: './atlas.component.html',
  styleUrls: ['./atlas.component.scss']
})
export class AtlasComponent implements OnInit, OnDestroy {
  filtersHidden = true;
  partOfBody = 'Wybierz partię';
  isFront = false;
  heartAnimation = false;
  safeSrc: SafeResourceUrl;
  videoURL = 'https://www.youtube.com/embed/3vJHQjiEp1w';
  openExer = false;
  selectedExercise: ExerciseModel = {
    id: '0',
    name: '0',
    type: '0',
    description: '0',
    rate: 0,
    popular: 0,
    musclePart: '0',
    image: '0',
    video: '0',
    difficult: 0
  };
  counterExercises = 0;

  constructor(
    private navigationService: NavigationService,
    private sanitizer: DomSanitizer,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {
  }

  basicSportMenu = [
    {
      name: 'Wiedza podstawowa',
      on: false
    },
    {
      name: 'Ćwiczenia',
      on: true
    },
  ];
  allExercisesDb;
  filtersArray;
  exercises;

  page = 0;

  filters = {
    name: '',
    part: '',
    sort: ''
  };

  scaleOfDifficulty = 66;
  lvlOfDifficulty = 'Expert';
  colorOfDifficulty = 'success';
  kcal15min = 125;
  exerciseId = '0';
  paramsSubscription: Subscription;
  user;
  favUserExercises = [];

  ngOnInit(): void {

    // pobierz dane o użytkowniku
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          this.favUserExercises = this.user.user.userFavExercises;
        }
      },
      error => {
      },
      () => {
      }
    );
    // pobierz cwiczenia
    this.getExercises();
    // sledz sciezke
    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.exerciseId = params.exerciseId;
      }
    );
    if (this.exerciseId !== undefined) {
      this.loadExercise();
    }
    this.navigationService.changeNavSubject(3);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
  }

  // zmiana sortowania
  changeSortType(value, type) {
    this.filters[type] = value;
    this.searchAndSortExercises();
  }

  // znajdz cwiczenie zgodnie z filtrami
  searchAndSortExercises() {
    // chwilowa tablica do edycji
    let tempArray = [];
    // po nazwie
    if (this.filters.name.length > 0) {
      for (const exercise in this.allExercisesDb) {
        // jezeli substring znajduje sie w nazwie cwiczenia poprostu dodaj do tmpArray
        if (this.allExercisesDb.hasOwnProperty(exercise) &&
          this.allExercisesDb[exercise].name.toLowerCase().includes((this.filters.name).toLowerCase())) {
          tempArray.push(this.allExercisesDb[exercise]);
        }
      }
    } else {
      tempArray = this.allExercisesDb;
    }
    let partArray = [];
    // po parrtii miesniowej
    if (this.filters.part !== '' && this.filters.part !== 'fav') {
      for (const exercise in tempArray) {
        // jezeli musclePart jest taki jak zaznacozny przez uzytkownika dodaj do tmep array
        if (tempArray.hasOwnProperty(exercise) &&
          (tempArray[exercise].musclePart === this.filters.part)) {
          partArray.push(this.allExercisesDb[exercise]);
        }
      }
    } else if (this.filters.part === 'fav') {
      for (const exercise in tempArray) {
        // jezeli idFav bedzie takie jak cwiczenia dodaj
        if (tempArray.hasOwnProperty(exercise)) {
          console.log(this.favUserExercises);
          if (this.favUserExercises.find(id => id === tempArray[exercise]._id)) {
            partArray.push(tempArray[exercise]);
          }
        }
      }
    } else {
      partArray = tempArray;
    }

    // sortuj tablice
    let sortArray = [];
    switch (this.filters.sort) {
      case '': {
        sortArray = partArray;
        break;
      }
      case 'a-z': {
        sortArray = _.orderBy(partArray, ['name'], ['asc']);
        break;
      }
      case 'z-a': {
        sortArray = _.orderBy(partArray, ['name'], ['desc']);
        break;
      }
      case 'rate': {
        sortArray = _.orderBy(partArray, ['rate'], ['desc']);
        break;
      }
      case 'popular': {
        sortArray = _.orderBy(partArray, ['popular'], ['desc']);
        break;
      }
    }
    this.filtersArray = sortArray;
    this.counterExercises = this.filtersArray.length;
    this.exercises = this.filtersArray.slice(this.page * 6, this.page * 6 + 6);
  }


  isNext() {
    return (this.page * 6 + 7) <= this.filtersArray.length;
  }

  // nastepna badz poprzednia strona
  pagination(value) {

    if (value && this.isNext()) {
      this.page++;
    } else if (!value && !(this.page <= 0)) { // poprzednia strona
      console.log(value)
      this.page--;
    }
    this.exercises = this.filtersArray.slice(this.page * 6, this.page * 6 + 6);
  }

  setExercisesPagination() {

  }

  getExercises() {
    this.exerciseService.getAllExercises().subscribe(
      data => {
        this.allExercisesDb = data.exercises;
      },
      err => {

      },
      () => {
        this.favUserExercises = this.user.user.userFavExercises;
        for (const exer in this.allExercisesDb) {
          if (this.allExercisesDb.hasOwnProperty(exer)) {
            // sprawdz ktore cwiczenia sa ulubione i daj serduszko
            this.allExercisesDb[exer].favourite = !!this.favUserExercises.find(data => {
              return data === this.allExercisesDb[exer]._id;
            });
          }
        }
        this.searchAndSortExercises();
        this.exercises = this.filtersArray.slice(this.page * 6, this.page * 6 + 6);
        this.counterExercises = this.allExercisesDb.length;
      }
    );
  }

  loadExercise() {
    this.openExer = true;
    this.exerciseService.getExercise(this.exerciseId).subscribe(
      data => {
        this.selectedExercise = data;
      },
      error => {
      },
      () => {
        this.checkDifficulty();
      }
    );
  }

  openExercise(value) {
    console.log(value);
    this.router.navigate(
      ['/atlas'],
      {
        queryParams: {exerciseId: value},
        queryParamsHandling: 'merge'
      });
    this.exerciseId = value;
    this.loadExercise();
  }

  closeExercise() {
    this.router.navigate(['/atlas']);
    this.openExer = !this.openExer;
  }

  animationHeart(element: HTMLElement, exerciseId) {
    const index = this.favUserExercises.findIndex(data => data === exerciseId);
    if (index === -1) {
      this.favUserExercises.push(exerciseId);
      this.updateDataFavExercise();
    } else {
      this.favUserExercises.splice(index, 1);
      console.log(this.favUserExercises);
      this.updateDataFavExercise();
    }
    // zeby aktualizowac dane przechowywane lokalnie
    // zeby serduszko sie odznaczalo po odkliknieciu i kombinacji wszystko -> ulubione -> wszystko -> ulubione
    let idTemp = _.findIndex(this.allExercisesDb, {_id: exerciseId});
    this.allExercisesDb[idTemp].favourite = !this.allExercisesDb[idTemp].favourite;
    const tempUser = this.authService.user.getValue();
    tempUser.user.userFavExercises = this.favUserExercises;
    localStorage.setItem('userData', JSON.stringify(tempUser));
    this.authService.user.next(tempUser);
    // animacja
    this.heartAnimation = !this.heartAnimation;
    element.classList.contains('fa-heart-active')
      ? element.classList.remove('fa-heart-active') : element.classList.add('fa-heart-active');
    element.classList.add('fa-heart-animation');
    setTimeout(() => {
      element.classList.remove('fa-heart-animation');
    }, 1000);
  }

  downloadFavExercise(id) {
    this.userService.getUserFavExercises(id).subscribe(
      data => {
        this.favUserExercises = data.user.userFavExercises;
      }, error => {
      },
      () => {
      }
    );
  }

  updateDataFavExercise() {
    console.log(this.favUserExercises);
    this.userService.patchUserFavExercises(this.user.user.id, 'userFavExercises', this.favUserExercises)
      .subscribe(
        data => {
        }, error => {
        }, () => {
        }
      );
  }

  changeCategory(index) {
    this.basicSportMenu.map(x => {
      x.on = false;
    });
    this.basicSportMenu[index].on = true;
  }

  sayMyName(value) {
    console.log(value);
    this.partOfBody = value;
  }


  checkDifficulty() {
    switch (this.selectedExercise.difficult) {
      case 0: {
        this.setDifficulty('success', 33, 'Łatwy');
        break;
      }
      case 1: {
        this.setDifficulty('warning', 66, 'Trudny');
        break;
      }
      case 2: {
        this.setDifficulty('danger', 100, 'Expert');
        break;
      }
      default: {
        this.setDifficulty('success', 33, 'Łatwy');
      }
    }
  }

  setDifficulty(color, scale, lvl) {
    this.scaleOfDifficulty = scale;
    this.lvlOfDifficulty = lvl;
    this.colorOfDifficulty = color;
  }


  ngOnDestroy(): void {
  }
}
