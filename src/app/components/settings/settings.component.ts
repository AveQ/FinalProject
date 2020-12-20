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
      name: 'Aktywność fizyczna',
      name_value: 'Brak Danych',
      options_value: [
        {value: 2.2, name: 'Wyczynowa'},
        {value: 2.0, name: 'Duża'},
        {value: 1.8, name: 'Średnia'},
        {value: 1.5, name: 'Mała'}],
      formInfo: 'select',
      dbName: 'physicalActivity',
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
    },
    {
      name: 'Waga docelowa',
      name_value: 85,
      formInfo: 'number',
      dbName: 'finalWeight',
      class_icon: 'fas fa-bullseye fa-3x account-blue'
    }
  ];
  dietInfo = [
    {
      name: 'Prognoza wagi',
      name_value: 'Spadek',
      class_icon: 'fas fa-chart-line fa-3x account-green'
    },
    {
      name: 'PPM',
      name_value: '0 kcal',
      class_icon: 'fas fa-bullseye fa-3x account-blue'
    },
    {
      name: 'CPM',
      name_value: '0 kcal',
      class_icon: 'fas fa-bullseye fa-3x account-blue'
    }
  ];
  goal = [
    {
      name: 'Dziennie',
      name_value: 'Brak danych',
      class_icon: 'fas fa-chart-line fa-3x account-green'
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

  // ustaw achievement
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
          let physName = 0;
          this.settings[5].options_value.findIndex(data => {
            if (data.value === +user.user.physicalActivity) {
              physName = data.name;
            }
          });
          this.settings[5].name_value = physName;
          this.settings[6].name_value = user.user.age + '';
          this.settings[7].name_value = user.user.language;
          this.settings[8].name_value = user.user.finalWeight + ' kg';
          this.dietInfo[0].name_value = user.user.forecast;
          const ppm = this.setPPM(user.user.gender, user.user.weight, user.user.height, user.user.age);
          this.dietInfo[1].name_value = ppm === 0 ? 'Złe Dane' : ppm.toPrecision(5) + ' kcal';
          const cpm = this.setCPM(user.user.physicalActivity, ppm);
          this.dietInfo[2].name_value = cpm === 0 ? 'Złe Dane' : cpm.toPrecision(5) + ' kcal';
          this.goal[0].name_value = (cpm + (user.user.weeklyChange * 1000)).toPrecision(5) + 'kg';
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
            this.foodService.isDecrease(this.userId);
          }
        );
      }
    );
    this.configuration();
  }

  setPPM(gender, weight, height, age) {
    let ppm = 0;
    if (weight >= 20 && height >= 50 && weight <= 350 && height <= 250 && age >= 8) {
      if (gender.toLowerCase() === 'female') {
        ppm = 665.09 + (9.56 * weight) + (1.85 * height) - (4.67 * age);
      } else {
        ppm = 66.47 + 13.7 * weight + 5.0 * height - 6.76 * age;
      }
    }
    return ppm;
  }

  setCPM(physicalActivity, ppm) {
    let cpm = 0;
    if (ppm !== 'Złe Dane') {
      cpm = ppm * physicalActivity;
    }
    return cpm;
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
