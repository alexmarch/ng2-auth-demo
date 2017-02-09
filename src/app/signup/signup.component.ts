import { Component, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import {Router} from '@angular/router';

@Pipe({name: 'currencyArray'})
export class PipeCurrencyList implements PipeTransform {
  transform(value: Object, args: any) : Array<Object> {
    let list = new Array<Object>();
    for(let key in value){
      list.push({ key:key, value:value[key] });
    }
    return list;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  data: Object = require('../data.json');
  currencyData: Object = require('../currency-data.json');
  countries: Array<Object> = require('../countries.json');
  timezones: Array<Object> = require('../timezones.json');
  currencyList: Object = require('../currency-list.json');
  signup: FormGroup;

  @Output() user = {
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    company: '',
    business: '',
    currency: '',
    country: '',
    timezone: ''
  }
  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
    this.signup = fb.group({
        "firstname": [null, Validators.compose([
              <any>Validators.required, <any>Validators.minLength(1), <any>Validators.maxLength(20)
            ])],
        "lastname": [null, Validators.compose([
              Validators.required, Validators.minLength(6), Validators.maxLength(15)
            ])],
        "password": [null, Validators.compose([
              Validators.required, Validators.minLength(6), Validators.maxLength(8)
            ])],
        "email": [null, Validators.compose([
              Validators.required,
              Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          ])],
        "company": ['', Validators.compose([
              Validators.required, Validators.maxLength(30)
            ])],
        "business": [null, Validators.compose([
              Validators.required
            ])],
        "country": [null, Validators.compose([
              Validators.required
            ])],
         "currency": [null, Validators.compose([
              Validators.required
            ])],
         "timezone": [null, Validators.compose([
              Validators.required
            ])]
    });
  }
  selectCountry(country, group: any) {
    if ( country.valid ) {
     let timezone: any = this.data[country.value];
     if (timezone) {
       let result: any = this.timezones.find((value: any, index, list):any => {
        if(value.utc) {
          if ( value.utc.indexOf(timezone.timezones[0]) > -1 ) {
            return true;
          }
        }
        return false;
       });
       if(result){
         this.user.timezone = result.value;
         group.controls.timezone.setValue(result.value);
       }
       let currencyCode = this.currencyData[timezone.id];
       if(currencyCode){
         this.user.currency = currencyCode;
         group.controls.currency.setValue(currencyCode);
       }
     }
    }
  }
  onSubmit() {
    if (this.signup.valid) {
       this.http.post('http://localhost:9000/signup', this.user, {})
        .subscribe((v: Response) => {
          let res: any = v.json();
          if (res.status == 'OK') {
            this.router.navigate(["signin"]);
          }
        });
    }
  }
  ngOnInit() {
  }

}
