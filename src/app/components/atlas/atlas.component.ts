import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {ExerciseService} from '../../services/exercise.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExerciseModel} from '../../model/exercise.model';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import * as _ from 'lodash';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-atlas',
  templateUrl: './atlas.component.html',
  styleUrls: ['./atlas.component.scss']
})
export class AtlasComponent implements OnInit, OnDestroy {
  /*http://localhost:3000/*/
  imageAddress = 'https://nfl-center-api.herokuapp.com/';
  filtersHidden = true;

  heartAnimation = false;
  safeSrc: SafeResourceUrl;
  videoURL = 'https://www.youtube.com/embed/3vJHQjiEp1w';
  openExer = false;
  isRated = false;
  counterExercises = 0;
  isLoading = true;
  language;

  constructor(
    private navigationService: NavigationService,
    private sanitizer: DomSanitizer,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService,
    private titleService: Title) {
  }

// wyszukana historia
  historyExercise;
  basicSportMenu = [
    {
      name: 'Wiedza podstawowa',
      route: '/atlas/knowledge',
      on: false
    },
    {
      name: 'Ćwiczenia',
      route: '/atlas/exercises/1',
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
  private allUserHistory;
  exerciseId = '0';
  paramsSubscription: Subscription;
  user;
  userId;
  favUserExercises = [];


  ngOnInit(): void {
    this.titleService.setTitle('Atlas | NFL-Center');
    this.language = this.translate.currentLang;
    this.setRoute();
    // pobierz dane o użytkowniku
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          this.userId = data.user.id;
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
    this.navigationService.changeNavSubject(3);
    if (this.user) {
      this.loadUserAllHistory();
    }
  }

  // sprawdz params i ustaw podstronke. jezeli inna od dozwolonych przekieruj na glowna
  setRoute() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params) {
          this.page = params.page - 1;
        } else {
          this.router.navigate(['/atlas', this.page + 1]);
        }
      }
    );
  }

  // zmiana sortowania
  changeSortType(value, type) {
    this.page = 0;
    this.filters[type] = value;
    this.searchAndSortExercises();
  }

  // znajdz cwiczenie zgodnie z filtrami
  searchAndSortExercises() {
    // chwilowa tablica do edycji
    let sort;
    this.language.toUpperCase() === 'PL' ? sort = 'namePL' : sort = 'name';
    let tempArray = [];
    // po nazwie
    if (this.filters.name.length > 0) {
      for (const exercise in this.allExercisesDb) {
        // jezeli substring znajduje sie w nazwie cwiczenia poprostu dodaj do tmpArray
        if (this.allExercisesDb.hasOwnProperty(exercise) &&
          this.allExercisesDb[exercise][sort].toLowerCase().includes((this.filters.name).toLowerCase())) {
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
          partArray.push(tempArray[exercise]);
        }
      }
    } else if (this.filters.part === 'fav') {
      for (const exercise in tempArray) {
        // jezeli idFav bedzie takie jak cwiczenia dodaj
        if (tempArray.hasOwnProperty(exercise)) {
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
    let sortName = 'name';
    if (this.language.toUpperCase() === 'PL'){
      sortName = 'namePL';
    }
    switch (this.filters.sort) {
      case '': {
        sortArray = partArray;
        break;
      }
      case 'a-z': {
        sortArray = _.orderBy(partArray, [sortName], ['asc']);
        break;
      }
      case 'z-a': {
        sortArray = _.orderBy(partArray, [sortName], ['desc']);
        break;
      }
      case 'rate': {
        sortArray = _.orderBy(partArray, ['rate.rate'], ['desc']);
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
      this.router.navigate(['/atlas/exercises', (this.page + 1)]);
    } else if (!value && !(this.page <= 0)) { // poprzednia strona
      this.page--;
      this.router.navigate(['/atlas/exercises', (this.page + 1)]);
    }
    this.exercises = this.filtersArray.slice(this.page * 6, this.page * 6 + 6);
  }

  getExercises() {
    this.exerciseService.getAllExercises().subscribe(
      data => {
        this.allExercisesDb = data.exercises;
      },
      err => {

      },
      () => {
        if (this.user) {
          this.favUserExercises = this.user.user.userFavExercises;
        }
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

  animationHeart(element: HTMLElement, exerciseId) {
    const index = this.favUserExercises.findIndex(data => data === exerciseId);
    if (index === -1) {
      this.favUserExercises.push(exerciseId);
      this.updateDataFavExercise();
    } else {
      this.favUserExercises.splice(index, 1);
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
    if (index === 1) {
      this.page = 0;
      this.getExercises();
    }
    this.router.navigate([this.basicSportMenu[index].route], { relativeTo: this.route });
  }



  loadUserAllHistory() {
    if (this.user) {
      this.exerciseService.loadUserAllHistory(this.userId).subscribe(
        data => {
          this.allUserHistory = data;
        },
        error => {
        },
        () => {
        }
      );
    }
  }


  ngOnDestroy(): void {
  }
}
