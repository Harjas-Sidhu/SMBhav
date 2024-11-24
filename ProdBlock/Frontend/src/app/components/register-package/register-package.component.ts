import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-package',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-package.component.html',
})
export class RegisterPackageComponent {
    packageId: string = '';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private data: DataService) {}

    onSubmit() {
        if (this.packageId.trim()) {
            this.data.registerPackage(this.packageId).subscribe({
                next: (response: any) => {
                    if (response.success) {
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
            this.errorMessage = 'Package ID is required';
        }
    }
}
