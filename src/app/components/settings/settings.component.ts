import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-food--panel',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings = [
    {
      name: 'Nick',
      name_value: 'AveQ',
      class_icon: 'fas fa-user-circle fa-3x '
    },
    {
      name: 'Waga',
      name_value: '103 kg',
      class_icon: 'fas fa-weight fa-3x account'
    },
    {
      name: 'Wzrost',
      name_value: '183 cm',
      class_icon: 'fas fa-arrows-alt-v fa-3x'
    },
    {
      name: 'Płeć',
      name_value: 'Mężczyzna',
      class_icon: 'fas fa-venus-mars fa-3x account'
    },
    {
      name: 'Tygodniowa zmiana',
      name_value: '+1 kg',
      class_icon: 'fas fa-exchange-alt fa-3x'
    },
    {
      name: 'Kraj',
      name_value: 'Polska',
      class_icon: 'fas fa-globe-americas fa-3x account'
    },
    {
      name: 'Wiek',
      name_value: '23',
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
  constructor(private navigationService: NavigationService) {
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
  }

  onSubmit() {
    console.log(this.newValue.value);
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
