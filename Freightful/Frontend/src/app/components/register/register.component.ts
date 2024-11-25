import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    user = {
        email: '',
        password: '',
        role: '',
        name: '',
        contactDetails: '',
    };
    loading = false;

    constructor(private authService: AuthService, private router: Router) {}

    register() {
        this.loading = true;
        this.authService.register(this.user).subscribe({
            next: (response: any) => {
                console.log('User registered successfully');
                this.router.navigate(['/login']);
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error registering user', error);
                this.loading = false;
            },
        });
    }
}
