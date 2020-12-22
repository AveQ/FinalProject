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

  settings;
  dietInfo;
  goal;
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
    this.settings = this.userService.settings;
    this.dietInfo = this.userService.dietInfo;
    this.goal = this.userService.goal;
    this.achievements = this.userService.achievements;
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
          const ppm = this.userService.setPPM(user.user.gender, user.user.weight, user.user.height, user.user.age);
          this.dietInfo[1].name_value = ppm === 0 ? 'Złe Dane' : ppm.toPrecision(5) + ' kcal';
          const cpm = this.userService.setCPM(user.user.physicalActivity, ppm);
          this.dietInfo[2].name_value = cpm === 0 ? 'Złe Dane' : cpm.toPrecision(5) + ' kcal';
          const mac = this.userService.returnMacro(cpm);
          this.dietInfo[3].name_value = mac[0] === 0 ? 'Złe Dane' : mac[0].toPrecision(4) + ' g';
          this.dietInfo[4].name_value = mac[1] === 0 ? 'Złe Dane' : mac[1].toPrecision(4) + ' g';
          this.dietInfo[5].name_value = mac[2] === 0 ? 'Złe Dane' : mac[2].toPrecision(4) + ' g';
          this.goal[0].name_value = (cpm + (user.user.weeklyChange * 1000)).toPrecision(5) + 'kg';
          const goalMac = this.userService.returnMacro((cpm + (user.user.weeklyChange * 1000)));
          this.goal[1].name_value = goalMac[0] === 0 ? 'Złe Dane' : goalMac[0].toPrecision(4) + ' g';
          this.goal[2].name_value = goalMac[1] === 0 ? 'Złe Dane' : goalMac[1].toPrecision(4) + ' g';
          this.goal[3].name_value = goalMac[2] === 0 ? 'Złe Dane' : goalMac[2].toPrecision(4) + ' g';
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
