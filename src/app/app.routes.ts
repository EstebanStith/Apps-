import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto: muestra la lista
  {
    path: '',
    loadComponent: () => import('./components/pokemon-list/pokemon-list.component').then(c => c.PokemonListComponent)
  },
  // Ruta para el detalle: recibe el nombre del pokemon en la URL
  {
    path: 'pokemon/:name',
    loadComponent: () => import('./components/pokemon-detail/pokemon-detail.component').then(c => c.PokemonDetailComponent)
  },
  // Si alguien escribe una ruta que no existe, lo regresamos a la lista
  {
    path: '**',
    redirectTo: ''
  }
];
