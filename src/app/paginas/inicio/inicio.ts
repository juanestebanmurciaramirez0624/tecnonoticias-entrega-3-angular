import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [RouterLink, TarjetaNoticia],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  readonly servicioNoticias = inject(ServicioNoticias);
  readonly destacadas = computed(() =>
    this.servicioNoticias.noticias()
      .filter((noticia) => noticia.destacada)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
      .slice(0, 3),
  );
}