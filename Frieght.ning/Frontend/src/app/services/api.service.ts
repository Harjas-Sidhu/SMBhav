import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    registerCarrier(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/carriers/register`, data, {
            headers: this.authService.headers,
        });
    }

    addRate(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/rates/add`, data, {
            headers: this.authService.headers,
        });
    }

    createShipment(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/shipments/add`, data, {
            headers: this.authService.headers,
        });
    }

    getCarriers(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/carriers`, {
            headers: this.authService.headers,
        });
    }

    getRates(params?: any): Observable<any> {
        return this.http.get(`${environment.apiUrl}/rates`, {
            headers: this.authService.headers,
            params,
        });
    }

    getRatesForShipment(shipmentId: string): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/rates/shipment/${shipmentId}`,
            {
                headers: this.authService.headers,
            }
        );
    }

    startAuction(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auction/start`, data, {
            headers: this.authService.headers,
        });
    }

    placeBid(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auction/bid`, data, {
            headers: this.authService.headers,
        });
    }

    getAuctions(params?: any): Observable<any> {
        return this.http.get(`${environment.apiUrl}/auction`, {
            headers: this.authService.headers,
            params,
        });
    }

    getShipments(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/shipments`, {
            headers: this.authService.headers,
        });
    }

    updateShipmentStatus(data: any): Observable<any> {
        return this.http.patch(
            `${environment.apiUrl}/shipments/update-status`,
            data,
            {
                headers: this.authService.headers,
            }
        );
    }

    getShipmentHistory(shipmentId: string): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/shipments/${shipmentId}/history`,
            {
                headers: this.authService.headers,
            }
        );
    }
}
