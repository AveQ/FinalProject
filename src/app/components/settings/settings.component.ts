import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {FoodService} from '../../services/food.service';


@Component({
  selector: 'app-food--panel',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings = [
    {
      name: 'Nick',
      name_value: 'Brak',
      formInfo: 'text',
      dbName: 'nick',
      class_icon: 'fas fa-user-circle fa-3x '
    },
    {
      name: 'Waga',
      name_value: 60,
      formInfo: 'number',
      dbName: 'weight',
      class_icon: 'fas fa-weight fa-3x account'
    },
    {
      name: 'Wzrost',
      name_value: 170,
      formInfo: 'number',
      dbName: 'height',
      class_icon: 'fas fa-arrows-alt-v fa-3x'
    },
    {
      name: 'Płeć',
      name_value: 'Brak',
      formInfo: 'select',
      options_value: ['Male', 'Female'],
      dbName: 'gender',
      class_icon: 'fas fa-venus-mars fa-3x account'
    },
    {
      name: 'Tygodniowa zmiana',
      name_value: '0kg',
      formInfo: 'number',
      dbName: 'weeklyChange',
      class_icon: 'fas fa-exchange-alt fa-3x'
    },
    {
      name: 'Kraj',
      name_value: 'Polska',
      options_value: ['Polska', 'USA'],
      formInfo: 'select',
      dbName: 'language',
      class_icon: 'fas fa-globe-americas fa-3x account'
    },
    {
      name: 'Wiek',
      name_value: 50,
      formInfo: 'number',
      dbName: 'age',
      class_icon: 'fas fa-birthday-cake fa-3x'
    },
    {
      name: 'Język',
      name_value: 'PL',
      options_value: ['PL', 'EN'],
      formInfo: 'select',
      dbName: 'language',
      class_icon: 'fas fa-language fa-3x account'
    }
  ];
  dietInfo = [
    {
      name: 'Prognoza wagi',
      name_value: 'Spadek',
      class_icon: 'fas fa-chart-line fa-3x account-green'
    },
    {
      name: 'Waga docelowa',
      name_value: '85 kg',
      class_icon: 'fas fa-bullseye fa-3x account-blue'
    }
  ];
  achievements = [
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-brown',
      name_value: '1 dzień',
      class_icon: 'fas fa-medal fa-3x account-brown',
      unblock: false
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-silver',
      name_value: '5 dni',
      class_icon: 'fas fa-medal fa-3x account-silver',
      unblock: false
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-gold',
      name_value: '10 dni',
      class_icon: 'fas fa-medal fa-3x account-gold',
      unblock: false
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-diamond',
      name_value: 'Miesiąc',
      class_icon: 'fas fa-trophy fa-3x account-diamond',
      unblock: false
    },
  ];
  newValue: FormGroup;
  newValueLanguage: FormGroup;
  changeValue = '';
  modalOpen = false;
  userSub: Subscription;
  weight = 60;
  height = 170;
  userId;
  user;
  curElement: {
    name: string,
    name_value: string,
    formInfo: string,
    dbName: string,
    class_icon: string,
    options_value?
  };
  historyUser;
  counterUserHistory = 0;

  constructor(private foodService: FoodService, private navigationService: NavigationService, private authService: AuthService,
              private userService: UserService) {
    this.newValue = new FormGroup({
      newValue: new FormControl(),
    });
    this.newValueLanguage = new FormGroup({
      polish: new FormControl(),
      english: new FormControl(null)
    });
  }

  // ustaw achivmenty
  checkCounterLogin() {
    for (let i = 1; i < 5; i++) {
      this.achievements[i - 1].unblock = i * 5 <= this.counterUserHistory;
    }
  }

  ngOnInit(): void {
    this.navigationService.changeNavSubject(5);
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log(this.settings);
          this.settings[0].name_value = user.user.nick !== '' ? user.user.nick : 'Nick';
          this.settings[1].name_value = user.user.weight + ' kg';
          this.settings[2].name_value = user.user.height + ' cm';
          this.settings[3].name_value = user.user.gender;
          this.settings[4].name_value = user.user.weeklyChange + ' kg';
          this.settings[5].name_value = user.user.country;
          this.settings[6].name_value = user.user.age + '';
          this.settings[7].name_value = user.user.language;
          this.dietInfo[0].name_value = user.user.forecast;
          this.dietInfo[1].name_value = user.user.target;
          this.userId = user.user.id;
          this.user = user;
        }
        let tempHistory;
        this.foodService.loadData(this.userId).subscribe(
          data => {
            tempHistory = data;
          },
          error => {
          },
          () => {
            this.counterUserHistory = tempHistory.length;
            this.checkCounterLogin();
          }
        );
      }
    );
    this.configuration();
  }

  onSubmit() {
    console.log(this.changeValue);
    this.userService.patchUserFavExercises(this.userId, this.curElement.dbName, this.newValue.value.newValue).subscribe();
    const userNew = this.user;
    userNew.user[this.curElement.dbName] = this.newValue.value.newValue;
    localStorage.setItem('userData', JSON.stringify(userNew));
    this.authService.user.next(userNew);
    this.closeModal();
  }

  onSubmitSelect(value) {
    this.userService.patchUserFavExercises(this.userId, this.curElement.dbName, value.value).subscribe();
    const userNew = this.user;
    userNew.user[this.curElement.dbName] = value.value;
    localStorage.setItem('userData', JSON.stringify(userNew));
    this.authService.user.next(userNew);
    this.closeModal();
  }

  // funkcja ustawiająca obiekt settings
  configuration() {
    // for (const element in this.settings) {
    //   if (this.settings.hasOwnProperty(element)) {
    //     switch (this.settings[element].name) {
    //       case 'Nick': {
    //       }
    //     }
    //   }
    // }
  }

  openModal(value) {
    this.modalOpen = true;
    this.changeValue = value.formInfo;
    this.curElement = value;
  }

  closeModal() {
    this.modalOpen = false;
    this.changeValue = '';
  }

  ngOnDestroy(): void {
  }
}
