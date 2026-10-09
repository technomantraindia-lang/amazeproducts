const form = document.querySelector('#staffLoginForm');
const password = document.querySelector('#password');
const toggle = document.querySelector('.password-toggle');
const message = document.querySelector('#formMessage');

toggle.addEventListener('click', () => {
  const reveal = password.type === 'password';
  password.type = reveal ? 'text' : 'password';
  toggle.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
  toggle.setAttribute('aria-pressed', String(reveal));
  toggle.innerHTML = `<i class="fa-regular fa-eye${reveal ? '-slash' : ''}"></i>`;
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) {
    message.textContent = 'Please enter your name, work email and password.';
    message.classList.add('visible');
    form.reportValidity();
    return;
  }
  // Authentication remains on the CRM origin so passwords never pass through this static site.
  // The email is carried over only to save the user entering it twice.
  const details = new URLSearchParams({
    name: form.name.value.trim(),
    email: form.email.value.trim(),
  });
  window.location.assign(`http://localhost:3000/login?${details}`);
});
