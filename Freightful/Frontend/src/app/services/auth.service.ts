import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
        this.currentUserSubject = new BehaviorSubject<any>(
            JSON.parse(localStorage.getItem('currentUser') || '{}')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
            email,
            password,
        });
    }

    register(user: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/register`, user);
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    public get isAuthenticated(): boolean {
        const token = this.currentUserValue?.token;
        return !this.jwtHelper.isTokenExpired(token);
    }

    public get headers(): HttpHeaders {
        const token = this.currentUserValue?.token;
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }
}
