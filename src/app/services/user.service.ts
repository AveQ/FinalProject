import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponseData} from './auth.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  // DANE PRZECHOWYWANE
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
      class_icon: 'fas fa-weight fa-3x'
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
      class_icon: 'fa-3x fas fa-utensils account'
    },
    {
      name: 'CPM',
      name_value: '0 kcal',
      class_icon: 'fa-3x fas fa-utensils'
    },
    {
      name: 'Białko',
      name_value: '0 g',
      class_icon: 'fas fa-drumstick-bite fa-3x account'
    },
    {
      name: 'Węglowodany',
      name_value: '0 g',
      class_icon: 'fas fa-bread-slice fa-3x '
    },
    {
      name: 'Tłuszcze',
      name_value: '0 g',
      class_icon: 'fas fa-bacon fa-3x account'
    }
  ];
  goal = [
    {
      name: 'Dziennie',
      name_value: 'Brak danych',
      class_icon: 'fa-3x fas fa-utensils'
    },
    {
      name: 'Białko',
      name_value: '0 g',
      class_icon: 'fas fa-drumstick-bite fa-3x account'
    },
    {
      name: 'Węglowodany',
      name_value: '0 g',
      class_icon: 'fas fa-bread-slice fa-3x '
    },
    {
      name: 'Tłuszcze',
      name_value: '0 g',
      class_icon: 'fas fa-bacon fa-3x account'
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
  summ = new BehaviorSubject(
    [
      {name: 'kcal', max: 0, today: 0},
      {name: 'proteins', max: 0, today: 0},
      {name: 'fats', max: 0, today: 0},
      {name: 'carbs', max: 0, today: 0}
    ]);

  // REST
  patchUserFavExercises(userId, toChange, newValue) {
    return this.http.patch('https://nfl-center-api.herokuapp.com/api/users/' + userId, [{'propName': toChange, 'value': newValue}]);
  }

  getUserFavExercises(userId) {
    return this.http.get<AuthResponseData>('https://nfl-center-api.herokuapp.com/api/users/' + userId);
  }
  getAllUsers() {
    return this.http.get<{count: number, users}>('https://nfl-center-api.herokuapp.com/api/users/');
  }
  // LOGIKA
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

  returnMacro(cpm) {
    const mac = [];
    // białko
    mac[0] = (cpm * 0.15) / 4;
    // tłuszcz
    mac[1] = (cpm * 0.30) / 4;
    // węglowodany
    mac[2] = (cpm * 0.55) / 4;
    return mac;
  }
}
