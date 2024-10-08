import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ApiResponse } from '../_models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private httpClient: HttpClient = inject(HttpClient)
private readonly apiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&utf8=&formatversion=2&srsearch=Angular&srprop=sectiontitle|sectionsnippet|snippet|timestamp'

getData(): Observable<ApiResponse> {  
  return this.httpClient.get<ApiResponse>(this.apiUrl);
}

}
