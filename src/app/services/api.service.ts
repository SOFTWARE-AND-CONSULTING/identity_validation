import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  post(path: string, data: any): any {
    const headers = new HttpHeaders(
      {
        "type": "FRONT",
        "contentType": "image/jpg",
        "extension": "jpg",
        "documentType": "CC"
    }
    );
    return this.http.post<any>(`${environment.URL}${path}`,{headers: headers}).pipe(map(d => d));
  }

  get(path: string): any {
    return this.http.get<any>(`${environment.URL}${path}`).pipe(map(d => d));
  }

  delete(path: string): any {
    return this.http.delete<any>(`${environment.URL}${path}`).pipe(map(d => d));
  }

  put(path: string, data: any): any {
    return this.http.put<any>(`${environment.URL}${path}`, data).pipe(map(d => d));
  }

}
