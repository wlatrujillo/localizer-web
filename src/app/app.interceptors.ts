import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
//import { LoadingService } from './loading.service';

export const authInterceptorFunctional: HttpInterceptorFn = (req, next) => {

    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
      return next(req);
    }

    const authReq = req.clone({
      setHeaders: { 'x-auth-token': `${authToken}` }
    });

    return next(authReq);

};


// Loading Spinner Interceptor
export const loadingSpinnerInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  //const loadingService = new LoadingService(); // Instantiate the loading service
  //loadingService.showLoadingSpinner(); // Show loading spinner UI element

  return next(req).pipe(
    finalize(() => {
        //loadingService.hideLoadingSpinner(); // Hide loading spinner UI element
    })
  );
};

// Logging Interceptor
export const loggingInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  console.log('Request URL: ' + req.url);
  return next(req);
}
