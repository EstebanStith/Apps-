import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { inject } from '@angular/core';

@Component({
  selector: 'app-my-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-movies.component.html',
  styleUrls: ['./my-movies.component.css']
})
export class MyMoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);
  private router = inject(Router);

  movies: Movie[] = [];

  ngOnInit() {
    this.movies = this.moviesService.getSavedMovies();
  }

  goBack() { this.router.navigate(['/']); }
}
