// This interceptor runs for every outgoing HTTP request in the app.
// The interceptor chain is declared in provideHttpClient(withInterceptors([...]))
// — order matters, just like Express middleware.
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      switch (error.status) {
        case 0:
          message = 'Cannot reach the server. Is json-server running?';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Server error. Please try again.';
          break;
        default:
          message = `Unexpected error (${error.status}).`;
      }

      // Re-throw with the friendly message so the calling service can display it
      return throwError(() => new Error(message));
    })
  );
};
