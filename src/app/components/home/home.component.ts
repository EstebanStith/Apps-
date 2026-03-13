import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private moviesService = inject(MoviesService);
  private router = inject(Router);

  categories = this.moviesService.getCategories();

  goToDetail(id: number) { this.router.navigate(['/movie', id]); }
  goToMyMovies() { this.router.navigate(['/my-movies']); }
}
