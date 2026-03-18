// Alternar entre login y registro
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        });
    }
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }

    // Lógica de login con localStorage
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            if (!email || !password) {
                showMessage('Por favor, completa todos los campos.');
                return;
            }
            const userData = localStorage.getItem('user_' + email);
            if (!userData) {
                showMessage('Usuario no registrado.');
                return;
            }
            const user = JSON.parse(userData);
            if (user.password !== password) {
                showMessage('Contraseña incorrecta.');
                return;
            }
            // Guardar usuario logueado
            localStorage.setItem('usuario_logueado', JSON.stringify(user));
            showMessage('¡Bienvenido, ' + user.name + '!', true);
            setTimeout(() => {
                window.location.href = 'registrar.html';
            }, 1000);
        });
    }

    // Lógica de registro con localStorage
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            // Validar campos
            if (!name || !email || !password) {
                showMessage('Por favor, completa todos los campos.');
                return;
            }
            // Guardar usuario
            const user = {
                name,
                email,
                password
            };
            localStorage.setItem('user_' + email, JSON.stringify(user));
            showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', true);
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'flex';
            }, 1200);
        });
    }

    // Mensaje flotante 
    function showMessage(msg, success = false) {
        let msgDiv = document.getElementById('msgAlert');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.id = 'msgAlert';
            document.body.appendChild(msgDiv);
        }
        msgDiv.textContent = msg;
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '32px';
        msgDiv.style.left = '50%';
        msgDiv.style.transform = 'translateX(-50%)';
        msgDiv.style.background = success ? '#00b894' : '#e74c3c';
        msgDiv.style.color = '#fff';
        msgDiv.style.padding = '0.8rem 1.5rem';
        msgDiv.style.borderRadius = '0.7rem';
        msgDiv.style.fontSize = '1.08rem';
        msgDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
        msgDiv.style.zIndex = '9999';
        msgDiv.style.opacity = '0.97';
        msgDiv.style.fontWeight = '500';
        msgDiv.style.textAlign = 'center';
        msgDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            msgDiv.style.opacity = '0';
            setTimeout(() => { if (msgDiv.parentNode) msgDiv.parentNode.removeChild(msgDiv); }, 350);
        }, 1800);
    }
});
