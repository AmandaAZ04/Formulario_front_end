const formulario = document.getElementById('registroForm');
const btnCancelar = document.getElementById('btnCancelar');
const btnCv = document.getElementById('btnCv');
const inputCv = document.getElementById('cv');
const nombreCv = document.getElementById('nombreCv');
const btnCalendario = document.getElementById('btnCalendario');
const fechaNacimiento = document.getElementById('fechaNacimiento');

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
    box: 'boxNombre',
    validar: validarNombre
  },
  {
    id: 'rut',
    box: 'boxRut',
    validar: validarRut
  },
  {
    id: 'fechaNacimiento',
    box: 'boxFecha',
    validar: validarFechaNacimiento
  },
  {
    id: 'cv',
    box: 'boxCv',
    validar: validarCv
  },
  {
    id: 'email',
    box: 'boxEmail',
    validar: validarEmail
  },
  {
    id: 'genero',
    box: 'boxGenero',
    validar: validarGenero
  },
  {
    id: 'password',
    box: 'boxPassword',
    validar: validarPassword
  },
  {
    id: 'repetirPassword',
    box: 'boxRepetirPassword',
    validar: validarRepetirPassword
  }
];

function validarNombre(input) {
  const valor = input.value.trim();

  return {
    valido: valor !== '' && valor.length >= 5 && valor.includes(' ')
  };
}

function validarRut(input) {
  const valor = limpiarRut(input.value);

  if (valor === '' || !/^[0-9]+[0-9kK]$/.test(valor)) {
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

function validarFechaNacimiento(input) {
  if (input.value === '') {
    return {
      valido: true,
      opcionalVacio: true
    };
  }

  const fechaIngresada = new Date(input.value);
  const hoy = new Date();

  return {
    valido: fechaIngresada <= hoy
  };
}

function validarCv(input) {
  if (input.files.length === 0) {
    return {
      valido: true,
      opcionalVacio: true
    };
  }

  const nombreArchivo = input.files[0].name;
  const regexArchivo = /\.(pdf|docx)$/i;

  return {
    valido: regexArchivo.test(nombreArchivo)
  };
}

function validarEmail(input) {
  const valor = input.value.trim().toLowerCase();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

function validarPassword(input) {
  const valor = input.value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

  return {
    valido: regexPassword.test(valor)
  };
}

function validarRepetirPassword(input) {
  const password = document.getElementById('password').value;

  return {
    valido: input.value !== '' && input.value === password
  };
}

function limpiarRut(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '').trim();
}

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

  campos.forEach(function (campo) {
    const box = document.getElementById(campo.box);
    pintarEstado(box, '');
  });
}

campos.forEach(function (campo) {
  const input = document.getElementById(campo.id);

  input.addEventListener('blur', function () {
    validarCampo(campo, false);
  });

  input.addEventListener('input', function () {
    const box = document.getElementById(campo.box);
    pintarEstado(box, '');
  });

  input.addEventListener('change', function () {
    validarCampo(campo, false);
  });
});

btnCv.addEventListener('click', function () {
  inputCv.click();
});

inputCv.addEventListener('change', function () {
  if (inputCv.files.length > 0) {
    nombreCv.textContent = inputCv.files[0].name;
  } else {
    nombreCv.textContent = 'Solo .docx, .pdf';
  }

  validarCampo(campos[3], false);
});

btnCalendario.addEventListener('click', function () {
  if (fechaNacimiento.showPicker) {
    fechaNacimiento.showPicker();
  } else {
    fechaNacimiento.focus();
  }
});

formulario.addEventListener('submit', validarFormulario);
btnCancelar.addEventListener('click', limpiarFormulario);