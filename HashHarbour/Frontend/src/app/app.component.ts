import { Component } from '@angular/core';
import { MainComponent } from './components/main/main.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Frontend';
}
