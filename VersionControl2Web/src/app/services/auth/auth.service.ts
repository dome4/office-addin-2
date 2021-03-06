import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { catchError, retry, map } from 'rxjs/operators';
import { LocalStorageService } from "../local-storage.service";
import { Observable } from "rxjs";

// api url
const api = environment.apiUrl;

// request header
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable()
export class AuthService {

  private token: string;

  constructor(private router: Router,
              private http: HttpClient,
              private storageService: LocalStorageService) { }

  // ToDo
  /**
   * method creates a new user
   * 
   * @param email
   * @param password
   */
  //signupUser(email: string, password: string) {

  //}

  /**
   * method signs the user in
   * 
   * @param username
   * @param password
   */
  signinUser(username: string, password: string): Observable<boolean> {

    const body = new HttpParams()
      .set('name', username)
      .set('password', password);

    return this.http.post<{ success: boolean, message: string, token: string }>(`${api}/user/authenticate`, body, httpOptions).pipe(
      map((data) => {
        if (data['token']) {

          // save in local storage
          this.storageService.store('vc-token', data['token']);

          // save in variable
          this.token = data['token'];

          return true;
        } else {
          throw new Error('signinUser() - Login Failed');
        }
      })
    );
  }

  /**
   * logout method
   * 
   */
  logout() {

    // reset token variable
    this.token = null;

    // remove local stored token
    this.storageService.remove('vc-token');
  }

  /**
   * method requests a new token
   * 
   */
  refreshToken() {
    // ToDo
  }

  /**
   * method checks if the user is authenticated
   * 
   */
  isAuthenticated(): boolean {

    return this.storageService.get('vc-token') != null;
 
  }

  /**
   * get the local stored auth token
   * 
   */
  getToken() {

    if (this.isAuthenticated()) {
      return this.storageService.get('vc-token');
    } else {
      return null;
    }
  }
}
