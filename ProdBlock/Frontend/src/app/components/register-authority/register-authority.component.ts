import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-authority',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-authority.component.html',
})
export class RegisterAuthorityComponent {
    authorityAddress: string = '';
    name: string = '';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private dataService: DataService) {}

    registerAuthority() {
        if (this.authorityAddress && this.name) {
            this.dataService
                .registerAuthority(this.authorityAddress, this.name)
                .subscribe({
                    next: (response: any) => {
                        if(response.success) {
                            this.successMessage = response.message;
                            this.errorMessage = '';
                        } else {
                            this.errorMessage = response.message;
                            this.successMessage = '';
                        }
                    },
                    error: (error: any) => {
                        this.errorMessage = error.message;
                        this.successMessage = '';
                    },
                });
        } else {
            this.errorMessage = 'Both authority address and name are required';
            this.successMessage = '';
        }
    }
}
