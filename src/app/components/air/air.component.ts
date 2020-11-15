import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AirPollutionService} from '../../services/airPollution.service';


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
  finalArray;

  constructor(private navigateService: NavigationService, private airPollutionService: AirPollutionService) {
  }

  ngOnInit(): void {
    this.navigateService.changeNavSubject(4);
    this.airForm = new FormGroup({
      city: new FormControl(),
    });
    this.getPollutionData();
  }

  onSubmit() {
    console.log(this.airForm.value);
  }

  ngOnDestroy(): void {
  }

  // znajdź miasto, które posiada substring podany przez użytkownika
  searchCity(value, city) {
    this.filteredStations = [];
    this.arrayWithCity = [];
    this.filteredStations = this.stations.filter(stat => {
      if (stat.city.name.toUpperCase().includes(city.value.toUpperCase())) {
        return stat;
      }
    });
    this.createTable();
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

  // po wczytaniu danych do tablicy pokaz 10 elementow zaleznych od aktualnej strony
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
  }

// sprawdz date badania
  getAirStatus(value: { pm10IndexLevel: { indexLevelName }, no2IndexLevel: {indexLevelName}}) {
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
}
