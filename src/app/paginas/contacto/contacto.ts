import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contacto',
  styleUrl: './contacto.css',
  templateUrl: './contacto.html',
})
export class Contacto {
  readonly formulario = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(100)] }),
    asunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(1000)] }),
  });

  enviando = false;
  mensajeEstado = '';
  envioCorrecto = false;

  mostrarError(campo: keyof Contacto['formulario']['controls']): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  async enviar(): Promise<void> {
    this.mensajeEstado = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeEstado = 'Revisa los campos marcados antes de enviar.';
      return;
    }

    this.enviando = true;
    try {
      const respuesta = await fetch('https://formsubmit.co/ajax/juanesteban4354@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...this.formulario.getRawValue(),
          _subject: `Nuevo mensaje de TecnoNoticias: ${this.formulario.controls.asunto.value}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!respuesta.ok) throw new Error('No se pudo enviar el formulario');
      this.envioCorrecto = true;
      this.mensajeEstado = 'Mensaje enviado correctamente. Gracias por contactarnos.';
      this.formulario.reset();
    } catch {
      this.envioCorrecto = false;
      this.mensajeEstado = 'No pudimos enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.';
    } finally {
      this.enviando = false;
    }
  }
}