import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from './componentes/encabezado/encabezado';
import { PiePagina } from './componentes/pie-pagina/pie-pagina';

@Component({
  imports: [RouterOutlet, Encabezado, PiePagina],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}