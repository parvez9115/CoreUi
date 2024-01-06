import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';

const httpOptionsWithJson = {
  headers: new HttpHeaders({
    Authorization: 'Basic YWRtaW46YWRtaW4=',
    'Content-Type': 'application/json;charset=utf-8',
  }),
  // withCredentials: true
};
const httpOptionsWithHTML = {
  headers: new HttpHeaders({
    Authorization: 'Basic YWRtaW46YWRtaW4=',
    'Content-Type': 'multipart/form-data;',
  }),
  // withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AjaxService {
  constructor(private http: HttpClient) {}
  private extractStringData(res: any) {
    const body = res;
    return body || '';
  }

  handleError = async (error: HttpErrorResponse) => {
    console.log('Orginal Error' + JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message

    // this.toast('Something bad happened; please try again later.');
    //  const toast = await this.toastController.create({
    //     message: "Reaching server time out, please try after sometimes ",
    //     duration: 2000
    // });
    // toast.present();
    return null;
  };

  async toast() {
    console.log('Something went wrong');
  }

  ajaxget(url: string): Observable<any> {
    return this.http
      .get(url)
      .pipe(map(this.extractStringData), catchError(this.toast));
  }
  ajaxgetHtml(url: string): Observable<any> {
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(map(this.extractStringData), catchError(this.toast));
  }
  ajaxdelete(url: string): Observable<any> {
    return this.http
      .delete(url)
      .pipe(map(this.extractStringData), catchError(this.toast));
  }

  ajaxPostWithBody(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data, httpOptionsWithJson)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }
  ajaxPostWithFile(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }
}
