import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-carrier-registration',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './carrier-registration.component.html',
})
export class CarrierRegistrationComponent implements OnInit {
    carrier = {
        carrierId: '',
        name: '',
        contactDetails: '',
        rating: 0,
    };
    loading = false;

    constructor(private apiService: ApiService, private router: Router) {}

    ngOnInit(): void {}

    registerCarrier() {
        this.loading = true;
        this.apiService.registerCarrier(this.carrier).subscribe({
            next: (response: any) => {
                this.loading = false;
                console.log('Carrier registered successfully');
                this.router.navigate(['/']);
            },
            error: (error: any) => {
                this.loading = false;
                console.error('Error registering carrier', error);
            },
        });
    }
}
