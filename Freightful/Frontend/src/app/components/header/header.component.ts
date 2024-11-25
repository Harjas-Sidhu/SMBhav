import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    constructor(public authService: AuthService, private router: Router) {}

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated;
    }
}