import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';


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
      class_icon: 'fas fa-user-circle fa-3x '
    },
    {
      name: 'Waga',
      name_value: 60,
      class_icon: 'fas fa-weight fa-3x account'
    },
    {
      name: 'Wzrost',
      name_value: 170,
      class_icon: 'fas fa-arrows-alt-v fa-3x'
    },
    {
      name: 'Płeć',
      name_value: 'Brak',
      class_icon: 'fas fa-venus-mars fa-3x account'
    },
    {
      name: 'Tygodniowa zmiana',
      name_value: '0kg',
      class_icon: 'fas fa-exchange-alt fa-3x'
    },
    {
      name: 'Kraj',
      name_value: 'Polska',
      class_icon: 'fas fa-globe-americas fa-3x account'
    },
    {
      name: 'Wiek',
      name_value: 50,
      class_icon: 'fas fa-birthday-cake fa-3x'
    },
    {
      name: 'Język',
      name_value: 'PL',
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
      unblock: true
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-silver',
      name_value: '5 dni',
      class_icon: 'fas fa-medal fa-3x account-silver',
      unblock: true
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-gold',
      name_value: '10 dni',
      class_icon: 'fas fa-medal fa-3x account-gold',
      unblock: true
    },
    {
      name: 'Systematyczność z NFL',
      color_gradient: 'card-body-gradient-diamond',
      name_value: 'Miesiąc',
      class_icon: 'fas fa-trophy fa-3x account-diamond',
      unblock: true
    },
  ];
  newValue: FormGroup;
  newValueLanguage: FormGroup;
  changeValue = '';
  modalOpen = false;
  userSub: Subscription;
  weight = 60;
  height = 170;

  constructor(private navigationService: NavigationService, private authService: AuthService) {
    this.newValue = new FormGroup({
      newValue: new FormControl(),
    });
    this.newValueLanguage = new FormGroup({
      polish: new FormControl(),
      english: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.navigationService.changeNavSubject(5);
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log(user);
          this.settings[0].name_value = user.user.nick ? user.user.nick : 'Nick';
          this.settings[1].name_value = user.user.weight + ' kg';
          this.settings[2].name_value = user.user.height + ' cm';
          this.settings[3].name_value = user.user.gender;
          this.settings[4].name_value = user.user.weeklyChange + ' kg';
          this.settings[5].name_value = user.user.country;
          this.settings[6].name_value = user.user.age + '';
          this.settings[7].name_value = user.user.language;
          this.dietInfo[0].name_value = user.user.forecast;
          this.dietInfo[1].name_value = user.user.target;
        }

      }
    );
    this.configuration();
  }

  onSubmit() {
    console.log(this.newValue.value);
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
    this.changeValue = value;
  }

  closeModal() {
    this.modalOpen = false;
    this.changeValue = '';
  }

  onSubmitLanguage() {
    console.log(this.newValueLanguage.value);
  }

  ngOnDestroy(): void {
  }
}
