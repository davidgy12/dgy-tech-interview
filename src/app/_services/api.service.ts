import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, firstValueFrom, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private httpClient: HttpClient = inject(HttpClient)
private readonly apiUrl = '/w/api.php?action=query&format=json&list=search&utf8=&formatversion=2&srsearch=Angular&srprop=sectiontitle|sectionsnippet|snippet|timestamp'

getData(): Observable<any> {
  return this.httpClient.get(this.apiUrl).pipe(
    first())
}



}
