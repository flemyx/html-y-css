document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginWindow = document.querySelector('.login-container');
    const mainWindow = document.querySelector('.mainwindow');
    const labelTipoUsuario = document.getElementById('labelTipoUsuario');
    const sections = document.querySelectorAll('.section');
    const logoutButton = document.getElementById('logoutButton');
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    // Evento para iniciar sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const isAdmin = document.getElementById('isAdminCheckbox').checked;

        if ((username === 'admin' && password === '1234') || (username === 'user' && password === '5678')) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', isAdmin ? 'admin' : 'user'); // Guardar el rol correctamente

            loginWindow.style.display = 'none';
            mainWindow.style.display = 'flex';
            labelTipoUsuario.innerText = isAdmin ? 'Permisos de Administrador' : 'Permisos de Usuario';
            showSection('intro');
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });

    // Verificar si ya está logueado
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userRole = localStorage.getItem('userRole');
        labelTipoUsuario.innerText = userRole === 'admin' ? 'Permisos de Administrador' : 'Permisos de Usuario';
        loginWindow.style.display = 'none';
        mainWindow.style.display = 'flex';
        showSection('intro');
    } else {
        // Asegurar que siempre inicia en la pantalla de login
        loginWindow.style.display = 'flex';
        mainWindow.style.display = 'none';
        sections.forEach(section => section.classList.remove('active'));
    }

    // Función para mostrar la sección seleccionada
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // Manejo de navegación entre secciones
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            showSection(targetId);
        });
    });

    // Evento de cierre de sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        loginWindow.style.display = 'flex';
        mainWindow.style.display = 'none';
        sections.forEach(section => section.classList.remove('active'));
    });
});