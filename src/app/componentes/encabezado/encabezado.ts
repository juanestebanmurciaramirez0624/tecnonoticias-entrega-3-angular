import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-encabezado',
  styleUrl: './encabezado.css',
  templateUrl: './encabezado.html',
})
export class Encabezado {
  readonly servicioNoticias = inject(ServicioNoticias);
}