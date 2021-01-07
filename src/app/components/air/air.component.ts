import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AirPollutionService} from '../../services/airPollution.service';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-bmi',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit, OnDestroy {
  airForm: FormGroup;
  city = '';
  // wszystkie stacje pogodowe
  stations;
  loading = true;
  page = 0;
  // wyzukane obiekty przez użytkownika
  filteredStations = [];
  // chwilowa tablica do pomocy w przeszukiwaniu wyników
  tempArray;
  // 5 wyszukanych miast
  arrayWithCity;
  // zanieczyszczenia dla 5 miast
  arrayWithPollutions;
  // ostateczna tablica czyta w DOM
  finalArray = [];
  // wyzeruj tablice jak string === ''
  emptyFlag = true;

  constructor(private navigateService: NavigationService, private translate: TranslateService, private airPollutionService: AirPollutionService) {
  }

  ngOnInit(): void {
    this.navigateService.changeNavSubject(4);
    this.airForm = new FormGroup({
      city: new FormControl(),
    });
    this.getPollutionData();
  }

  isNext() {
    return (this.page * 5 + 6) <= this.filteredStations.length;
  }

  otherPage(value) {
    if (value && this.isNext()) {
      this.page++;
      this.createTable();
    } else if (!value) { // poprzednia strona
      this.page--;
      this.createTable();
    }
  }

  onSubmit() {
    console.log(this.airForm.value);
  }

  // znajdź miasto, które posiada substring podany przez użytkownika
  searchCity(value, city) {
    this.page = 0;
    this.filteredStations = [];
    this.arrayWithCity = [];
    this.filteredStations = _.filter(this.stations, stat => {
      if (stat.city !== null && stat.city.name.toUpperCase().includes(city.value.toUpperCase())) {
        return stat;
      }
    });
    this.createTable();
    city.value === '' ? this.emptyFlag = true : this.emptyFlag = false;
  }

  // pobierz całą listę stacji i zapisz w lokalnej tablicy objetków
  getPollutionData() {
    this.airPollutionService.getStations().subscribe(
      data => {
        this.stations = data;
      },
      error => {
      },
      () => {
        this.loading = true;
      }
    );
  }

  // po wczytaniu danych do tablicy pokaz 5 elementow zaleznych od aktualnej strony
  createTable() {
    this.tempArray = [];
    const firstElement = this.page * 5;
    if (firstElement < this.filteredStations.length) {
      this.tempArray = this.filteredStations.slice(this.page * 5, this.page * 5 + 5);
    }
    for (const element of this.tempArray) {
      this.getStationsInfo(element.id);
    }
    this.arrayWithCity = this.tempArray;
  }

  // pobierz dane dla miast o zanieczyszczeniu
  getStationsInfo(value) {
    this.arrayWithPollutions = [];
    this.airPollutionService.getStationsInfo(value).subscribe(
      data => {
        this.arrayWithPollutions.push(data);
      },
      error => {
      },
      () => {
        this.createFinalArray();
      }
    );
  }

  // stwórz ostateczna tablice
  createFinalArray() {
    if (!this.emptyFlag) {
      this.finalArray = [];
      let jsonObject = {};
      for (const element of this.arrayWithCity) {
        jsonObject = {
          id: element.id,
          city: element.city.name,
          address: element.addressStreet,
          lastResearch: this.getDateOfLastResearch(this.arrayWithPollutions.find(object => {
            return object.id === element.id;
          })),
          airStatus: this.getAirStatus(this.arrayWithPollutions.find(object => {
            return object.id === element.id;
          })),
          type: this.getTypeOfStation(this.arrayWithPollutions.find(object => {
            return object.id === element.id;
          }))
        };
        this.finalArray.push(jsonObject);
      }
    } else {
      this.finalArray = [];
    }
  }

// sprawdz date badania
  getAirStatus(value: { pm10IndexLevel: { indexLevelName }, no2IndexLevel: { indexLevelName } }) {
    if (value && value.pm10IndexLevel && value.pm10IndexLevel.indexLevelName) {
      return value.pm10IndexLevel.indexLevelName;
    } else if (value && value.no2IndexLevel && value.no2IndexLevel.indexLevelName) {
      return value.no2IndexLevel.indexLevelName;
    } else {
      return 'Brak danych';
    }
  }

  // sprawdz status powietraz
  getDateOfLastResearch(value: { pm10SourceDataDate, no2SourceDataDate }) {
    if (value && value.pm10SourceDataDate) {
      return value.pm10SourceDataDate;
    } else if (value && value.no2SourceDataDate) {
      return value.no2SourceDataDate;
    } else {
      return 'Brak danych';
    }
  }

  // sprawdz typ stacji
  getTypeOfStation(value: { pm10SourceDataDate, no2SourceDataDate }) {
    if (value && value.pm10SourceDataDate) {
      return 'PM10';
    } else if (value && value.no2SourceDataDate) {
      return 'NO2';
    } else {
      return 'Brak danych';
    }
  }

  translateStatus(status) {
    if (this.translate.currentLang !== 'pl') {
      switch (status) {
        case 'Dobry': {
          return 'Good';
        }
        case 'Bardzo dobry': {
          return 'Very good';
        }
        case 'Dostateczny': {
          return 'Sufficient';
        }
        case 'Zły': {
          return 'Bad';
        }
        case 'Bardzo zły': {
          return 'Very bad';
        }
        case 'Brak danych': {
          return 'No data';
        }
        case 'Umiarkowany': {
          return 'Temperate';
        }
      }
    } else {
      return status;
    }
  }

  ngOnDestroy(): void {
  }
}
