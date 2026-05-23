const formulario = document.getElementById('registroForm');
const btnCancelar = document.getElementById('btnCancelar');
const btnSeleccionarCv = document.getElementById('btnSeleccionarCv');
const inputCv = document.getElementById('cv');
const nombreCv = document.getElementById('nombreCv');
const cvBox = document.getElementById('cvBox');

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
    requeridoId: 'reqNombre',
    validar: validarNombre
  },
  {
    id: 'cv',
    validar: validarCv
  },
  {
    id: 'password',
    requeridoId: 'reqPassword',
    validar: validarPassword
  },
  {
    id: 'rut',
    requeridoId: 'reqRut',
    validar: validarRut
  },
  {
    id: 'email',
    requeridoId: 'reqEmail',
    validar: validarEmail
  },
  {
    id: 'repetirPassword',
    requeridoId: 'reqRepetirPassword',
    validar: validarRepetirPassword
  },
  {
    id: 'fechaNacimiento',
    validar: validarFechaNacimiento
  },
  {
    id: 'genero',
    validar: validarGenero
  }
];

function validarNombre(input) {
  const valor = input.value.trim();

  if (valor === '') {
    return {
      valido: false,
      obligatorio: true
    };
  }

  if (valor.length < 5 || !valor.includes(' ')) {
    return {
      valido: false
    };
  }

  return {
    valido: true
  };
}

function validarCv(input) {
  if (input.files.length === 0) {
    return {
      valido: true,
      opcionalVacio: true
    };
  }

  const archivo = input.files[0].name;
  const regexArchivo = /\.(pdf|docx)$/i;

  return {
    valido: regexArchivo.test(archivo)
  };
}

function validarPassword(input) {
  const valor = input.value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

  if (valor === '') {
    return {
      valido: false,
      obligatorio: true
    };
  }

  return {
    valido: regexPassword.test(valor)
  };
}

function validarRut(input) {
  const valor = limpiarRut(input.value);

  if (valor === '') {
    return {
      valido: false,
      obligatorio: true
    };
  }

  if (!/^[0-9]+[0-9kK]$/.test(valor)) {
    return {
      valido: false
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

  const resultado = 11 - (suma % 11);
  let dvEsperado = '';

  if (resultado === 11) {
    dvEsperado = '0';
  } else if (resultado === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = String(resultado);
  }

  return {
    valido: dv === dvEsperado
  };
}

function validarEmail(input) {
  const valor = input.value.trim().toLowerCase();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (valor === '') {
    return {
      valido: false,
      obligatorio: true
    };
  }

  if (!regexEmail.test(valor)) {
    return {
      valido: false
    };
  }

  const dominio = valor.split('@')[1];

  return {
    valido: dominiosPermitidos.includes(dominio)
  };
}

function validarRepetirPassword(input) {
  const password = document.getElementById('password').value;
  const valor = input.value;

  if (valor === '') {
    return {
      valido: false,
      obligatorio: true
    };
  }

  return {
    valido: valor === password
  };
}

function validarFechaNacimiento(input) {
  const valor = input.value;

  if (valor === '') {
    return {
      valido: true,
      opcionalVacio: true
    };
  }

  const fechaIngresada = new Date(valor);
  const hoy = new Date();

  return {
    valido: fechaIngresada <= hoy
  };
}

function validarGenero(input) {
  if (input.value === '') {
    return {
      valido: true,
      opcionalVacio: true
    };
  }

  return {
    valido: true
  };
}

function limpiarRut(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}

function marcarObligatorio(requeridoId, activo) {
  if (!requeridoId) {
    return;
  }

  const requerido = document.getElementById(requeridoId);

  if (activo) {
    requerido.textContent = '*Obligatorio*';
    requerido.classList.add('activo');
  } else {
    requerido.textContent = '*';
    requerido.classList.remove('activo');
  }
}

function marcarValido(input, campo) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  marcarObligatorio(campo.requeridoId, false);
}

function marcarInvalido(input, campo, obligatorio) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  marcarObligatorio(campo.requeridoId, obligatorio);
}

function limpiarCampo(input, campo) {
  input.classList.remove('is-valid');
  input.classList.remove('is-invalid');
  marcarObligatorio(campo.requeridoId, false);
}

function validarCampo(campo, mostrarVacio) {
  const input = document.getElementById(campo.id);
  const resultado = campo.validar(input);

  if (resultado.opcionalVacio) {
    limpiarCampo(input, campo);
    return true;
  }

  if (resultado.obligatorio && !mostrarVacio) {
    limpiarCampo(input, campo);
    return false;
  }

  if (resultado.valido) {
    marcarValido(input, campo);
    return true;
  }

  marcarInvalido(input, campo, resultado.obligatorio);
  return false;
}

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

function limpiarFormulario() {
  formulario.reset();
  nombreCv.textContent = 'Solo .docx, .pdf';
  cvBox.classList.remove('is-valid');
  cvBox.classList.remove('is-invalid');

  campos.forEach(function (campo) {
    const input = document.getElementById(campo.id);
    limpiarCampo(input, campo);
  });
}

function validarCvVisual() {
  const resultado = validarCv(inputCv);

  cvBox.classList.remove('is-valid');
  cvBox.classList.remove('is-invalid');

  if (resultado.opcionalVacio) {
    return true;
  }

  if (resultado.valido) {
    cvBox.classList.add('is-valid');
    return true;
  }

  cvBox.classList.add('is-invalid');
  return false;
}

campos.forEach(function (campo) {
  const input = document.getElementById(campo.id);

  input.addEventListener('blur', function () {
    validarCampo(campo, false);
  });

  input.addEventListener('input', function () {
    limpiarCampo(input, campo);
  });

  input.addEventListener('change', function () {
    validarCampo(campo, false);
  });
});

btnSeleccionarCv.addEventListener('click', function () {
  inputCv.click();
});

inputCv.addEventListener('change', function () {
  if (inputCv.files.length > 0) {
    nombreCv.textContent = inputCv.files[0].name;
  } else {
    nombreCv.textContent = 'Solo .docx, .pdf';
  }

  validarCvVisual();
});

formulario.addEventListener('submit', validarFormulario);
btnCancelar.addEventListener('click', limpiarFormulario);