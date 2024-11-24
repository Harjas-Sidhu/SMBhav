import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-carrier',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './carrier.component.html',
})
export class CarrierComponent implements OnInit {
    carriers: any = [];
    loading = true;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getCarriers().subscribe({
            next: (response: any) => {
                this.loading = false;
                if (response.success) {
                    this.carriers = response.carriers;
                    console.log('Carriers fetched', response);
                } else {
                    console.error('Error fetching carriers', response);
                }
            },
            error: (error: any) => {
                console.error('Error fetching carriers', error);
                this.loading = false;
            },
        });
    }
}
