import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signin: FormGroup;

  @Output() user = {
    email: "",
    password: "",
    firstname: "",
    lastname: ""
  };

  constructor(fb: FormBuilder, private http: Http) {
    this.signin = fb.group({
      email: ["", Validators.required],
      password: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        ])]
    });
  }

  signinSubmit() {
    if(!this.signin.invalid){
      this.http.post('http://localhost:9000/signin', this.user, {})
        .subscribe((res: Response) => {
          let resBody: any = res.json();
          if (resBody.status == "OK") {
            localStorage.setItem("user", resBody);
            this.user.firstname = resBody.firstname;
            this.user.lastname = resBody.lastname;
          }
          this.signin.reset();
        });
    }
  }

  ngOnInit() {
  }

}
