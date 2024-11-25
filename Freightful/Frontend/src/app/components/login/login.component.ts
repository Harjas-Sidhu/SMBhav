import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) {}

    login() {
        this.loading = true;
        this.authService.login(this.email, this.password).subscribe({
            next: (response: any) => {
                localStorage.setItem('currentUser', JSON.stringify(response));
                window.location.reload();
                this.router.navigate(['/']);
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error logging in', error);
                this.loading = false;
            },
        });
    }
}
