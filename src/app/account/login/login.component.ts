import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: SocialUser;
  private loggedIn: boolean;
  constructor(private loginService: LoginService, private socialAuthService: SocialAuthService,
              private router: Router) { }

  ngOnInit() {
    console.log(environment.env);
    // this.socialAuthService.authState.subscribe((data) => {
    //   this.user = data;
    //   this.loggedIn = (data != null);
    // });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      // console.log(data.authToken);
      // console.log(data.idToken);
      sessionStorage.setItem('user', JSON.stringify(data));
      this.login(data.idToken);
      this.router.navigate(['/dashboard/home']);
    });
  }

  login(idToken) {
    this.loginService.loginApi(idToken).subscribe(
      res => {
        console.log('login res', res.data);
      },
      error => {
        console.log('login failed', error);
      }
    );
  }
}
