import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private baseUrl = 'http://localhost:3000/files';

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/upload`, formData);
    }

    searchFiles(query: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/search`, { params: { query } });
    }
}
