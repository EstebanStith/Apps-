import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { inject } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);
  private router = inject(Router);

  movie?: Movie;
  saved = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movie = this.moviesService.getMovieById(id);
    this.saved = !!this.moviesService.getSavedMovies().find(m => m.id === id);
  }

  saveMovie() {
    if (this.movie) {
      this.moviesService.saveMovie(this.movie);
      this.saved = true;
      // Esto lanza el cartel nativo del navegador igualito a tu foto
      alert('Película guardada en Mis Películas');
    }
  }

  goBack() { this.router.navigate(['/']); }
}
