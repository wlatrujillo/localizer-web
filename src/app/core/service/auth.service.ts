import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_URL = '/api/auth';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.AUTH_URL}/register`, user)
    .pipe(catchError(this.errorHandler));
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.AUTH_URL}/login`, { email, password })
    .pipe(map(token => {
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return token;
    }))
    .pipe(catchError(this.errorHandler));
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error. Please try again later.'));
  }
}
