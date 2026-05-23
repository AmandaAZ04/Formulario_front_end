const formulario = document.getElementById('registroForm');
const btnCancelar = document.getElementById('btnCancelar');

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
  {
    id: 'nombre',
    icono: 'iconoNombre',
    error: 'errorNombre',
    validar: validarNombre
  },
  {
    id: 'cv',
    icono: 'iconoCv',
    error: 'errorCv',
    validar: validarCv
  },
  {
    id: 'password',
    icono: 'iconoPassword',
    error: 'errorPassword',
    validar: validarPassword
  },
  {
    id: 'rut',
    icono: 'iconoRut',
    error: 'errorRut',
    validar: validarRut
  },
  {
    id: 'email',
    icono: 'iconoEmail',
    error: 'errorEmail',
    validar: validarEmail
  },
  {
    id: 'repetirPassword',
    icono: 'iconoRepetirPassword',
    error: 'errorRepetirPassword',
    validar: validarRepetirPassword
  },
  {
    id: 'fechaNacimiento',
    icono: 'iconoFecha',
    error: 'errorFecha',
    validar: validarFechaNacimiento
  },
  {
    id: 'genero',
    icono: 'iconoGenero',
    error: 'errorGenero',
    validar: validarGenero
  }
];

function validarNombre(input) {
  const valor = input.value.trim();

  if (valor === '') {
    return {
      valido: false,
      mensaje: 'El nombre completo es obligatorio.'
    };
  }

  if (valor.length < 5 || !valor.includes(' ')) {
    return {
      valido: false,
      mensaje: 'Ingrese nombre y apellido.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarCv(input) {
  if (input.files.length === 0) {
    limpiarCampoPorId('cv', 'iconoCv', 'errorCv');
    return {
      valido: true,
      mensaje: ''
    };
  }

  const archivo = input.files[0].name;
  const regexArchivo = /\.(pdf|docx)$/i;

  if (!regexArchivo.test(archivo)) {
    return {
      valido: false,
      mensaje: 'El archivo debe ser PDF o DOCX.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarPassword(input) {
  const valor = input.value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

  if (valor === '') {
    return {
      valido: false,
      mensaje: 'La contraseña es obligatoria.'
    };
  }

  if (!regexPassword.test(valor)) {
    return {
      valido: false,
      mensaje: 'Debe tener 8 a 12 caracteres, mayúscula, minúscula, número y símbolo.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarRut(input) {
  const valor = limpiarRut(input.value);

  if (valor === '') {
    return {
      valido: false,
      mensaje: 'El Rut es obligatorio.'
    };
  }

  if (!/^[0-9]+[0-9kK]$/.test(valor)) {
    return {
      valido: false,
      mensaje: 'Ingrese un Rut válido.'
    };
  }

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1).toUpperCase();

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador++;

    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }

  const resto = suma % 11;
  const resultado = 11 - resto;

  let dvEsperado = '';

  if (resultado === 11) {
    dvEsperado = '0';
  } else if (resultado === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = String(resultado);
  }

  if (dv !== dvEsperado) {
    return {
      valido: false,
      mensaje: 'El dígito verificador del Rut no es correcto.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarEmail(input) {
  const valor = input.value.trim().toLowerCase();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (valor === '') {
    return {
      valido: false,
      mensaje: 'El email es obligatorio.'
    };
  }

  if (!regexEmail.test(valor)) {
    return {
      valido: false,
      mensaje: 'Ingrese un email válido.'
    };
  }

  const dominio = valor.split('@')[1];

  if (!dominiosPermitidos.includes(dominio)) {
    return {
      valido: false,
      mensaje: 'Use un dominio válido: gmail, hotmail, outlook, yahoo, icloud o inacapmail.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarRepetirPassword(input) {
  const password = document.getElementById('password').value;
  const valor = input.value;

  if (valor === '') {
    return {
      valido: false,
      mensaje: 'Debe repetir la contraseña.'
    };
  }

  if (valor !== password) {
    return {
      valido: false,
      mensaje: 'Las contraseñas no coinciden.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarFechaNacimiento(input) {
  const valor = input.value;

  if (valor === '') {
    limpiarCampoPorId('fechaNacimiento', 'iconoFecha', 'errorFecha');
    return {
      valido: true,
      mensaje: ''
    };
  }

  const fechaIngresada = new Date(valor);
  const hoy = new Date();

  if (fechaIngresada > hoy) {
    return {
      valido: false,
      mensaje: 'La fecha no puede ser futura.'
    };
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function validarGenero(input) {
  if (input.value === '') {
    limpiarCampoPorId('genero', 'iconoGenero', 'errorGenero');
  }

  return {
    valido: true,
    mensaje: ''
  };
}

function limpiarRut(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}

function marcarValido(input, iconoId, errorId) {
  const icono = document.getElementById(iconoId);
  const error = document.getElementById(errorId);

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');

  icono.textContent = '✓';
  icono.classList.remove('invalido');
  icono.classList.add('valido');

  error.textContent = '';
}

function marcarInvalido(input, iconoId, errorId, mensaje) {
  const icono = document.getElementById(iconoId);
  const error = document.getElementById(errorId);

  input.classList.remove('is-valid');
  input.classList.add('is-invalid');

  icono.textContent = 'X';
  icono.classList.remove('valido');
  icono.classList.add('invalido');

  error.textContent = mensaje;
}

function limpiarCampoPorId(inputId, iconoId, errorId) {
  const input = document.getElementById(inputId);
  const icono = document.getElementById(iconoId);
  const error = document.getElementById(errorId);

  input.classList.remove('is-valid');
  input.classList.remove('is-invalid');

  icono.textContent = '';
  icono.classList.remove('valido');
  icono.classList.remove('invalido');

  error.textContent = '';
}

function validarCampo(campo) {
  const input = document.getElementById(campo.id);
  const resultado = campo.validar(input);

  if (resultado.valido) {
    if (campo.id === 'cv' && input.files.length === 0) {
      return true;
    }

    if (campo.id === 'fechaNacimiento' && input.value === '') {
      return true;
    }

    if (campo.id === 'genero' && input.value === '') {
      return true;
    }

    marcarValido(input, campo.icono, campo.error);
    return true;
  }

  marcarInvalido(input, campo.icono, campo.error, resultado.mensaje);
  return false;
}

function validarFormulario(event) {
  event.preventDefault();

  let formularioValido = true;

  campos.forEach(function (campo) {
    const campoValido = validarCampo(campo);

    if (!campoValido) {
      formularioValido = false;
    }
  });

  if (formularioValido) {
    alert('El envío de datos ha sido correcto.');
  }
}

function limpiarFormulario() {
  formulario.reset();

  campos.forEach(function (campo) {
    limpiarCampoPorId(campo.id, campo.icono, campo.error);
  });
}

campos.forEach(function (campo) {
  const input = document.getElementById(campo.id);

  input.addEventListener('blur', function () {
    validarCampo(campo);
  });

  input.addEventListener('input', function () {
    limpiarCampoPorId(campo.id, campo.icono, campo.error);
  });

  input.addEventListener('change', function () {
    validarCampo(campo);
  });
});

formulario.addEventListener('submit', validarFormulario);
btnCancelar.addEventListener('click', limpiarFormulario);