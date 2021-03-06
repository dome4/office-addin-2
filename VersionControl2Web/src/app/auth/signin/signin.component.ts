import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequirementService } from '../../services/requirement/requirement.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnDestroy {

  // subscriptions
  private subscriptions: Subscription[] = [];

  @ViewChild('loginError') loginError: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private requirementService: RequirementService
  ) { }

  ngOnDestroy() {
    // unsubscribe all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSignin(form: NgForm) {

    const email = form.value.email;
    const password = form.value.password;

    // subscribe to signinUser
    this.subscriptions.push(
      this.authService.signinUser(email, password).subscribe(
        (response: boolean) => {

          // if signin was successfull (true) 
          if (response) {
            // retry first request (should be first request) (observerable completes)
            this.requirementService.resendInitialRequests()
              .subscribe(data => {

                // navigate to root page
                this.router.navigate(['/'], { queryParams: { showStartupModal: true } });
              }, error => {

                console.log('Login failed - try again');
                console.log(error);
              });
          }
        }, (error) => {

          // activate error message
          this.loginError.nativeElement.classList.add('active');

          console.log('Login failed - try again');
          console.log(error.error.message);
        })
    );
  }
}
