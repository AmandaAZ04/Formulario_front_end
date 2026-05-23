/* Formulario */
const formulario = document.getElementById('registroForm');
const btnCancelar = document.getElementById('btnCancelar');

/* CV */
const btnCv = document.getElementById('btnCv');
const inputCv = document.getElementById('cv');
const nombreCv = document.getElementById('nombreCv');

/* Campo Fecha */
const btnCalendario = document.getElementById('btnCalendario');
const fechaNacimiento = document.getElementById('fechaNacimiento');
const boxFecha = document.getElementById('boxFecha');

/* Campo genero */
const boxGenero = document.getElementById('boxGenero');
const genero = document.getElementById('genero');
const btnGenero = document.getElementById('btnGenero');

/* Dominios de correo permitidos */
const dominiosPermitidos = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'inacapmail.cl',
  'inacap.cl'
];

const campos = [
  { id: 'nombre', box: 'boxNombre', validar: validarNombre },
  { id: 'rut', box: 'boxRut', validar: validarRut },
  { id: 'fechaNacimiento', box: 'boxFecha', validar: validarFechaNacimiento },
  { id: 'cv', box: 'boxCv', validar: validarCv },
  { id: 'email', box: 'boxEmail', validar: validarEmail },
  { id: 'genero', box: 'boxGenero', validar: validarGenero },
  { id: 'password', box: 'boxPassword', validar: validarPassword },
  { id: 'repetirPassword', box: 'boxRepetirPassword', validar: validarRepetirPassword }
];

/* Valida que el nombre tenga solo letras, espacios, nombre y apellido */
function validarNombre(input) {
  const valor = input.value.trim();
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return {
    valido: valor !== '' && valor.length >= 5 && valor.includes(' ') && regexNombre.test(valor)
  };
}

/* Impide escribir números o simbolos en nombre */
function filtrarNombre(input) {
  input.value = input.value
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
    .replace(/\s{2,}/g, ' ');
}

/* Valida rut con digito verificador */
function validarRut(input) {
  const valor = limpiarRut(input.value);
  if (valor === '' || !/^[0-9]+[0-9]$/.test(valor)) {
    return { valido: false };
  }
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador++;

    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }
  const resultado = 11 - (suma % 11);
  let dvEsperado = '';
  if (resultado === 11) {
    dvEsperado = '0';
  } else if (resultado === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = String(resultado);
  }
  return { valido: dv === dvEsperado };
}

/* Permite escribir solo números, puntos y guion en el rut */
function filtrarRut(input) {
  input.value = input.value.replace(/[^0-9.-]/g, '');
}

/* Valida fecha opcional y evita fechas futuras */
function validarFechaNacimiento(input) {
  if (input.value === '') {
    return { valido: true, opcionalVacio: true };
  }
  const fechaIngresada = new Date(input.value);
  const hoy = new Date();
  return { valido: fechaIngresada <= hoy };
}

/* Valida archivo, solo PDF o DOCX */
function validarCv(input) {
  if (input.files.length === 0) {
    return { valido: true, opcionalVacio: true };
  }
  const nombreArchivo = input.files[0].name;
  const regexArchivo = /\.(pdf|docx)$/i;
  return { valido: regexArchivo.test(nombreArchivo) };
}

/* Valida estructura del email y dominio permitido */
function validarEmail(input) {
  const valor = input.value.trim().toLowerCase();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regexEmail.test(valor)) {
    return { valido: false };
  }
  const dominio = valor.split('@')[1];
  return { valido: dominiosPermitidos.includes(dominio) };
}

/* Genero es opcional */
function validarGenero(input) {
  if (input.value === '') {
    return { valido: true, opcionalVacio: true };
  }
  return { valido: true };
}

/* Valida contraseña con mayuscula, minuscula, número, simbolo y largo 8 a 12 */
function validarPassword(input) {
  const valor = input.value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
  return { valido: regexPassword.test(valor) };
}

/* Valida que repetir contraseña sea igual a contraseña */
function validarRepetirPassword(input) {
  const password = document.getElementById('password').value;
  return {
    valido: input.value !== '' && input.value === password
  };
}

/* Limpia puntos y guion para calcular rut */
function limpiarRut(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}

/* Cambia clases visuales valid/invalid de cada campo */
function pintarEstado(box, estado) {
  box.classList.remove('valid');
  box.classList.remove('invalid');
  if (estado === 'valid') {
    box.classList.add('valid');
  }
  if (estado === 'invalid') {
    box.classList.add('invalid');
  }
}

/* Valida un campo específico y pinta su estado */
function validarCampo(campo, mostrarVacio) {
  const input = document.getElementById(campo.id);
  const box = document.getElementById(campo.box);
  const resultado = campo.validar(input);
  if (resultado.opcionalVacio) {
    pintarEstado(box, '');
    return true;
  }
  if (!mostrarVacio && input.value.trim && input.value.trim() === '') {
    pintarEstado(box, '');
    return false;
  }
  if (resultado.valido) {
    pintarEstado(box, 'valid');
    return true;
  }
  pintarEstado(box, 'invalid');
  return false;
}

/* Valida todo el formulario al presionar enviar */
function validarFormulario(event) {
  event.preventDefault();
  let formularioValido = true;
  campos.forEach(function (campo) {
    const campoValido = validarCampo(campo, true);
    if (!campoValido) {
      formularioValido = false;
    }
  });
  if (formularioValido) {
    alert('El envío de datos ha sido correcto.');
  }
}

/* Limpia formulario, colores, archivo, fecha y ojos */
function limpiarFormulario() {
  formulario.reset();
  nombreCv.textContent = 'Solo .docx, .pdf';
  fechaNacimiento.classList.remove('has-value');
  campos.forEach(function (campo) {
    const box = document.getElementById(campo.box);
    pintarEstado(box, '');
  });
  cerrarPassword('password', 'togglePassword');
  cerrarPassword('repetirPassword', 'toggleRepetirPassword');
}

/* Abre calendario nativo */
function abrirCalendario() {
  if (fechaNacimiento.showPicker) {
    fechaNacimiento.showPicker();
  } else {
    fechaNacimiento.focus();
  }
}

/* Abre menu nativo del select genero */
function abrirGenero() {
  if (genero.showPicker) {
    genero.showPicker();
  } else {
    genero.focus();
  }
}

/* Configura boton ojo para mostrar u ocultar contraseña */
function configurarTogglePassword(inputId, botonId) {
  const input = document.getElementById(inputId);
  const boton = document.getElementById(botonId);
  const imagen = boton.querySelector('img');
  boton.addEventListener('click', function () {
    const estaOculta = input.type === 'password';
    input.type = estaOculta ? 'text' : 'password';
    imagen.src = estaOculta ? './assets/img/OJITO.png' : './assets/img/CERRADO.png';
    boton.setAttribute('aria-label', estaOculta ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
}

/* Vuelve una contraseña a estado oculto */
function cerrarPassword(inputId, botonId) {
  const input = document.getElementById(inputId);
  const boton = document.getElementById(botonId);
  const imagen = boton.querySelector('img');
  input.type = 'password';
  imagen.src = './assets/img/CERRADO.png';
  boton.setAttribute('aria-label', 'Mostrar contraseña');
}

/* Eventos de escritura, salida y cambio para todos los campos */
campos.forEach(function (campo) {
  const input = document.getElementById(campo.id);
  input.addEventListener('input', function () {
    if (campo.id === 'nombre') {
      filtrarNombre(input);
    }
    if (campo.id === 'rut') {
      filtrarRut(input);
    }
    const box = document.getElementById(campo.box);
    pintarEstado(box, '');
    if (campo.id === 'fechaNacimiento') {
      input.classList.toggle('has-value', input.value !== '');
    }
  });
  input.addEventListener('blur', function () {
    validarCampo(campo, false);
  });
  input.addEventListener('change', function () {
    if (campo.id === 'fechaNacimiento') {
      input.classList.toggle('has-value', input.value !== '');
    }
    validarCampo(campo, false);
  });
});

/* Abre selector de archivo al presionar seleccionar */
btnCv.addEventListener('click', function () {
  inputCv.click();
});

/* Actualiza nombre del archivo y valida CV */
inputCv.addEventListener('change', function () {
  if (inputCv.files.length > 0) {
    nombreCv.textContent = inputCv.files[0].name;
  } else {
    nombreCv.textContent = 'Solo .docx, .pdf';
  }
  validarCampo(campos.find(function (campo) {
    return campo.id === 'cv';
  }), false);
});

/* Abre calendario al hacer clic en el campo completo */
boxFecha.addEventListener('click', abrirCalendario);

/* Abre calendario al hacer clic en el icono */
btnCalendario.addEventListener('click', function (event) {
  event.preventDefault();
  event.stopPropagation();
  abrirCalendario();
});

/* Abre genero al hacer clic en el campo completo */
boxGenero.addEventListener('click', abrirGenero);

/* Abre genero al hacer clic en la flecha */
btnGenero.addEventListener('click', function (event) {
  event.preventDefault();
  event.stopPropagation();
  abrirGenero();
});

/* Activa ojos de contraseña */
configurarTogglePassword('password', 'togglePassword');
configurarTogglePassword('repetirPassword', 'toggleRepetirPassword');

/* Eventos principales del formulario */
formulario.addEventListener('submit', validarFormulario);
btnCancelar.addEventListener('click', limpiarFormulario);