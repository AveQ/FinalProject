import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {FoodService} from '../../services/food.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from '../../services/translation.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-food--panel',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings;
  dietInfo;
  goal;
  achievements;
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
    nameEN: string,
    name_value: string,
    name_value_EN: string,
    formInfo: string,
    dbName: string,
    class_icon: string,
    options_value?,
    options_value_EN?
  };
  historyUser;
  counterUserHistory = 0;
  language = 'pl';

  constructor(private foodService: FoodService, private navigationService: NavigationService, private authService: AuthService,
              private userService: UserService,
              private translation: TranslateService,
              private translate: TranslationService,
              private router: Router,
              private titleService: Title) {
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
      console.log(this.achievements[i - 1].unblock);
      this.achievements[i - 1].unblock = i * 5 <= this.counterUserHistory;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('User | NFL-Center');
    this.language = this.translation.currentLang;
    this.settings = this.userService.settings;
    this.dietInfo = this.userService.dietInfo;
    this.goal = this.userService.goal;
    this.achievements = this.userService.achievements;
    this.navigationService.changeNavSubject(5);
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user) {
          this.setLanguage(user);

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
  }

  setLanguage(user) {
    let languageNameValue;
    let languageOptionValue;
    console.log(this.settings);
    if (this.language === 'pl') {
      languageNameValue = 'name_value';
      languageOptionValue = 'options_value';
    } else {
      languageNameValue = 'name_value_EN';
      languageOptionValue = 'options_value_EN';
    }
    this.settings[0][languageNameValue] = user.user.nick !== '' ? user.user.nick : 'Nick';
    this.settings[1][languageNameValue] = user.user.weight + ' kg';
    this.settings[2][languageNameValue] = user.user.height + ' cm';
    if (this.language === 'pl') {
      this.settings[3][languageNameValue] = user.user.gender.toLowerCase() === 'male' ? 'Mężczyzna' : 'Kobieta';
    } else {
      console.log('tpo: ' + user.user.gender.toLowerCase());
      this.settings[3][languageNameValue] = user.user.gender.toLowerCase() === 'male' ? 'Male' : 'Female';
    }
    this.settings[4][languageNameValue] = user.user.weeklyChange + ' kg';
    let physName = 0;
    this.settings[5][languageOptionValue].findIndex(data => {
      if (data.value === +user.user.physicalActivity) {
        physName = data.name;
      }
    });
    this.settings[5][languageNameValue] = physName;
    this.settings[6][languageNameValue] = user.user.age + '';
    this.settings[7][languageNameValue] = user.user.language;
    this.settings[8][languageNameValue] = user.user.finalWeight + ' kg';
    this.dietInfo[0][languageNameValue] = user.user.forecast;
    const ppm = this.userService.setPPM(user.user.gender, user.user.weight, user.user.height, user.user.age);
    this.dietInfo[1][languageNameValue] = ppm === 0 ? 'Złe Dane' : ppm.toPrecision(5) + ' kcal';
    const cpm = this.userService.setCPM(user.user.physicalActivity, ppm);
    this.dietInfo[2][languageNameValue] = cpm === 0 ? 'Złe Dane' : cpm.toPrecision(5) + ' kcal';
    const mac = this.userService.returnMacro(cpm);
    this.dietInfo[3][languageNameValue] = mac[0] === 0 ? 'Złe Dane' : mac[0].toPrecision(4) + ' g';
    this.dietInfo[4][languageNameValue] = mac[1] === 0 ? 'Złe Dane' : mac[1].toPrecision(4) + ' g';
    this.dietInfo[5][languageNameValue] = mac[2] === 0 ? 'Złe Dane' : mac[2].toPrecision(4) + ' g';
    this.goal[0][languageNameValue] = (cpm + (user.user.weeklyChange * 1000)).toPrecision(5) + 'kg';
    const goalMac = this.userService.returnMacro((cpm + (user.user.weeklyChange * 1000)));
    this.goal[1][languageNameValue] = goalMac[0] === 0 ? 'Złe Dane' : goalMac[0].toPrecision(4) + ' g';
    this.goal[2][languageNameValue] = goalMac[1] === 0 ? 'Złe Dane' : goalMac[1].toPrecision(4) + ' g';
    this.goal[3][languageNameValue] = goalMac[2] === 0 ? 'Złe Dane' : goalMac[2].toPrecision(4) + ' g';
    this.userId = user.user.id;
    this.user = user;
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
    let patchValue = value.value;
    if (value.value === 'Mezczyzna' || value.value === 'Kobieta') {
      patchValue = value.value === 'Mezczyzna' ? 'male' : 'female';
    }
    if (value.value.toLowerCase() === 'en' || value.value.toLowerCase() === 'pl') {
      this.translate.changeTranslationStatus(value.value);
      localStorage.setItem('language', JSON.stringify(value.value));
      this.router.navigate(['../']);
    }
    this.userService.patchUserFavExercises(this.userId, this.curElement.dbName, patchValue).subscribe();
    const userNew = this.user;
    userNew.user[this.curElement.dbName] = value.value;
    localStorage.setItem('userData', JSON.stringify(userNew));
    this.authService.user.next(userNew);
    this.closeModal();
  }

  openModal(value) {
    this.modalOpen = true;
    this.changeValue = value.formInfo;
    console.log(value);
    this.curElement = value;
  }

  closeModal() {
    this.modalOpen = false;
    this.changeValue = '';
  }

  ngOnDestroy(): void {
  }
}
