import { Routes } from '@angular/router';
import { Administrar } from './paginas/administrar/administrar';
import { Contacto } from './paginas/contacto/contacto';
import { Detalle } from './paginas/detalle/detalle';
import { Favoritos } from './paginas/favoritos/favoritos';
import { Inicio } from './paginas/inicio/inicio';
import { Noticias } from './paginas/noticias/noticias';

export const routes: Routes = [
  { path: '', component: Inicio, title: 'TecnoNoticias' },
  { path: 'noticias', component: Noticias, title: 'Noticias | TecnoNoticias' },
  { path: 'noticias/:id', component: Detalle, title: 'Detalle | TecnoNoticias' },
  { path: 'favoritos', component: Favoritos, title: 'Favoritos | TecnoNoticias' },
  { path: 'administrar', component: Administrar, title: 'Administrar | TecnoNoticias' },
  { path: 'contacto', component: Contacto, title: 'Contacto | TecnoNoticias' },
  { path: '**', redirectTo: '' },
];