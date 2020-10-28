import { config } from './config.js';

const form = document.getElementById('form');

if ('content' in document.createElement('template')) {
  const template = document.getElementById('formControl');
  const div = template.content.querySelector('div');
  const children = div.children;

  form.setAttribute('method', config.method);
  form.setAttribute('action', config.action);

  config.fields.forEach((field) => {
    // label
    children[0].innerHTML = field.labelText || '';
    children[0].setAttribute('for', field.id);

    // input
    children[1].type = field.type || 'text';
    children[1].id = field.id;
    children[1].placeholder = field.placeholder || '';

    form.appendChild(div.cloneNode(true));

    // Adding confirm password input
    if (field.type === 'password') {
      // label
      children[0].innerHTML = 'Confirm Password';
      children[0].setAttribute('for', `${field.id}2`);

      // input
      children[1].type = 'password';
      children[1].id = `${field.id}2`;
      children[1].placeholder = field.placeholder || '';

      form.appendChild(div.cloneNode(true));
    }
  });

  const button = document.createElement('button');
  button.innerHTML = 'Submit';
  form.appendChild(button);
} else {
  console.error('templates are not supported by your browser');
}

// ========================================

const showError = (input, msg) => {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = document.createElement('small');
  small.innerText = msg;
  formControl.appendChild(small);
};

const showSuccess = (input) => {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
};

const getFieldName = (input) => {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
};

function formEmailCheck(email) {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEx.test(String(email.value.trim()).toLowerCase())) {
    showSuccess(email);
  } else {
    showError(email, `${getFieldName(email)} email is not valid`);
  }
  return regEx.test(String(email).toLowerCase());
}

const formRequiredCheck = (input) => {
  if (!input.value.trim()) {
    showError(input, `${getFieldName(input)} is required`);
  } else {
    showSuccess(input);
  }
};

const formLengthCheck = (input, min, max) => {
  if (input.value.length < min) {
    showError(input, `${getFieldName(input)} is too short`);
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(input)} is too large`);
  } else {
    showSuccess(input);
  }
};

const formPasswordCheck = (inputOne, inputTwo) => {
  if (inputOne.value !== inputTwo.value) {
    console.log(2);
    showError(inputOne, '');
    showError(inputTwo, 'Passwords do not match');
  }
  if (inputTwo.value && inputTwo.parentElement.children.length === 2) {
    showSuccess(inputOne);
    showSuccess(inputTwo);
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // delete all small tags from html
  const smallArray = form.querySelectorAll('small');
  smallArray.forEach((node) => node.remove());

  let checkPasswords = false;

  config.fields.forEach((field) => {
    const input = document.getElementById(field.id);
    if (field.type === 'password') {
      checkPasswords = true;
    }
    if (field.required) {
      formRequiredCheck(input);
    }
    if (field.isEmail && (field.required || input.value)) {
      formEmailCheck(input);
    }
    if (field.min || field.max) {
      formLengthCheck(input, field.min || 1, field.max || 256);
    }
  });

  if (checkPasswords) {
    formPasswordCheck(password, password2);
  }

  if (!form.querySelectorAll('small').length) {
    let body = {};
    const formInputs = form.querySelectorAll('input');
    formInputs.forEach(
      (input) => (body = { ...body, [input.id]: input.value })
    );

    // // Пример ASYNC|AWAIT отправки POST запроса:
    // async function postData(url = '', data = {}) {
    //   console.log(config.method);
    //   // Default options are marked with *
    //   const response = await fetch(url, {
    //     method: config.method,
    //     body: JSON.stringify(data),
    //   });
    //   return await response.json();
    // }
    // postData('https://jsonplaceholder.typicode.com/posts', body).then(
    //   (data) => {
    //     console.log(data);
    //   }
    // );

    fetch(config.action, {
      method: config.method,
      body: JSON.stringify(body),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }
});
