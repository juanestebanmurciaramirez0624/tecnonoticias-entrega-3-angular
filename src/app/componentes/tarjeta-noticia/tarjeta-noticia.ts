import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../modelos/noticia';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [RouterLink],
  selector: 'app-tarjeta-noticia',
  styleUrl: './tarjeta-noticia.css',
  templateUrl: './tarjeta-noticia.html',
})
export class TarjetaNoticia {
  readonly noticia = input.required<Noticia>();
  readonly servicioNoticias = inject(ServicioNoticias);
}