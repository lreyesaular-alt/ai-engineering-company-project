(() => {
  const form = document.querySelector('form');

  if (!form) {
    return;
  }

  const fields = {
    nombreCompleto: document.getElementById('nombre-completo'),
    email: document.getElementById('email'),
    telefono: document.getElementById('telefono'),
    pais: document.getElementById('pais'),
    ciudad: document.getElementById('ciudad'),
    ubicacionFavorita: document.getElementById('ubicacion-favorita'),
    comoNosConociste: document.getElementById('como-nos-conociste'),
    fechaNacimiento: document.getElementById('fecha-nacimiento'),
    aceptoTerminos: document.getElementById('acepto-terminos'),
  };

  const cityByCountry = {
    colombia: ['medellin', 'bogota', 'cali'],
    'estados-unidos': ['miami', 'orlando'],
  };

  const locationByCountryAndCity = {
    colombia: {
      medellin: ['el-poblado', 'laureles', 'envigado', 'sabaneta'],
      bogota: ['usaquen', 'chapinero', 'zona-rosa'],
      cali: ['granada', 'ciudad-jardin', 'unicentro'],
    },
    'estados-unidos': {
      miami: ['brickell', 'coral-gables'],
      orlando: ['downtown', 'international-drive'],
    },
  };

  const messages = {
    nombreCompleto: 'Ingresa tu nombre completo (nombre y apellido)',
    email: 'Ingresa un email valido (ejemplo: nombre@correo.com)',
    telefono:
      'El telefono debe incluir codigo de pais (ejemplo: +57 300 123 4567 o +1 305 123 4567)',
    pais: 'Selecciona tu pais',
    ciudad: 'Selecciona tu ciudad',
    comoNosConociste: 'Cuentanos como conociste Brasaland',
    fechaNacimiento: 'Debes ser mayor de 18 anos para registrarte en Brasa Points',
    aceptoTerminos:
      'Debes aceptar los terminos del programa Brasa Points para continuar',
    ubicacionFavorita: 'Selecciona una ubicacion valida para el pais y ciudad elegidos',
  };

  function getErrorElement(input) {
    const errorId = `${input.id}-error`;
    let errorEl = document.getElementById(errorId);

    if (!errorEl) {
      errorEl = document.createElement('small');
      errorEl.id = errorId;
      errorEl.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', errorEl);
    }

    return errorEl;
  }

  function setError(input, message) {
    const errorEl = getErrorElement(input);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
    errorEl.textContent = message;
    return false;
  }

  function clearError(input) {
    const errorEl = getErrorElement(input);
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorEl.textContent = '';
    return true;
  }

  function validateRequiredText(value) {
    return value.trim().length > 0;
  }

  function validateFullName() {
    const value = fields.nombreCompleto.value.trim();
    const parts = value.split(/\s+/).filter(Boolean);

    if (!validateRequiredText(value) || parts.length < 2) {
      return setError(fields.nombreCompleto, messages.nombreCompleto);
    }

    return clearError(fields.nombreCompleto);
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(value)) {
      return setError(fields.email, messages.email);
    }

    return clearError(fields.email);
  }

  function validatePhone() {
    const value = fields.telefono.value.trim();
    const phonePattern = /^\+(57|1)\s[0-9\s-]{6,}$/;

    if (!phonePattern.test(value)) {
      return setError(fields.telefono, messages.telefono);
    }

    return clearError(fields.telefono);
  }

  function validateCountry() {
    const value = fields.pais.value;

    if (!value) {
      return setError(fields.pais, messages.pais);
    }

    return clearError(fields.pais);
  }

  function validateCity() {
    const country = fields.pais.value;
    const city = fields.ciudad.value;

    if (!city) {
      return setError(fields.ciudad, messages.ciudad);
    }

    const allowedCities = cityByCountry[country] || [];
    if (country && !allowedCities.includes(city)) {
      return setError(fields.ciudad, messages.ciudad);
    }

    return clearError(fields.ciudad);
  }

  function validateHowFoundUs() {
    if (!fields.comoNosConociste.value) {
      return setError(fields.comoNosConociste, messages.comoNosConociste);
    }

    return clearError(fields.comoNosConociste);
  }

  function validateAdultAge() {
    const value = fields.fechaNacimiento.value;

    if (!value) {
      return setError(fields.fechaNacimiento, messages.fechaNacimiento);
    }

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    if (Number.isNaN(birthDate.getTime()) || age < 18) {
      return setError(fields.fechaNacimiento, messages.fechaNacimiento);
    }

    return clearError(fields.fechaNacimiento);
  }

  function validateTerms() {
    if (!fields.aceptoTerminos.checked) {
      return setError(fields.aceptoTerminos, messages.aceptoTerminos);
    }

    return clearError(fields.aceptoTerminos);
  }

  function validateFavoriteLocation() {
    const value = fields.ubicacionFavorita.value;

    if (!value) {
      return clearError(fields.ubicacionFavorita);
    }

    const country = fields.pais.value;
    const city = fields.ciudad.value;
    const validLocations =
      (locationByCountryAndCity[country] && locationByCountryAndCity[country][city]) || [];

    if (!validLocations.includes(value)) {
      return setError(fields.ubicacionFavorita, messages.ubicacionFavorita);
    }

    return clearError(fields.ubicacionFavorita);
  }

  function validateForm() {
    const results = [
      validateFullName(),
      validateEmail(),
      validatePhone(),
      validateCountry(),
      validateCity(),
      validateHowFoundUs(),
      validateAdultAge(),
      validateTerms(),
      validateFavoriteLocation(),
    ];

    return results.every(Boolean);
  }

  form.addEventListener('submit', (event) => {
    if (!validateForm()) {
      event.preventDefault();
      const firstInvalid = form.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    event.preventDefault();
    alert(
      '¡Bienvenido a Brasa Points!\n\nTu registro ha sido exitoso. Recibiras un email de confirmacion en los proximos minutos con los detalles de tu cuenta y como empezar a acumular puntos.\n\n¡Ya puedes disfrutar de tus beneficios en cualquiera de nuestras 14 ubicaciones!'
    );
  });

  fields.nombreCompleto.addEventListener('blur', validateFullName);
  fields.email.addEventListener('blur', validateEmail);
  fields.telefono.addEventListener('blur', validatePhone);
  fields.pais.addEventListener('change', () => {
    validateCountry();
    validateCity();
    validateFavoriteLocation();
  });
  fields.ciudad.addEventListener('change', () => {
    validateCity();
    validateFavoriteLocation();
  });
  fields.comoNosConociste.addEventListener('change', validateHowFoundUs);
  fields.fechaNacimiento.addEventListener('change', validateAdultAge);
  fields.aceptoTerminos.addEventListener('change', validateTerms);
  fields.ubicacionFavorita.addEventListener('change', validateFavoriteLocation);
})();