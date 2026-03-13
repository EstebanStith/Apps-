import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { MyMoviesComponent } from './components/my-movies/my-movies.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'my-movies', component: MyMoviesComponent },
  { path: '**', redirectTo: '' }
];
