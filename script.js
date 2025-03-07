document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginWindow = document.querySelector('.login-container');
    const mainWindow = document.querySelector('.mainwindow');
    const labelTipoUsuario = document.getElementById('labelTipoUsuario');
    const sections = document.querySelectorAll('.section');
    const logoutButton = document.getElementById('logoutButton');
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    // Asegurar que siempre inicia en la pantalla de login
    loginWindow.style.display = 'flex';
    mainWindow.style.display = 'none';
    sections.forEach(section => section.classList.remove('active'));

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

    // Función para registrar un usuario
    async function registerUser(event) {
        event.preventDefault();

        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const isAdmin = document.getElementById('isAdminCheckbox').checked;

        const newUser = { username, password, isAdmin };

        try {
            const response = await fetch('https://tu-api.com/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Usuario registrado con éxito');
                showSection('eliminar_usuario'); // Mostrar sección de eliminar usuario después de registrar
            } else {
                alert('Error al registrar el usuario');
            }
        } catch (error) {
            console.error('Error en la solicitud POST:', error);
        }
    }

    document.getElementById('registerUserForm').addEventListener('submit', registerUser);

    // Función para eliminar un usuario
    async function deleteUser(event) {
        event.preventDefault();

        const userId = document.getElementById('selectUser').value;

        try {
            const response = await fetch(`https://tu-api.com/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                alert('Usuario eliminado con éxito');
                loadUsersForDeletion(); // Recargar la lista de usuarios después de eliminar
            } else {
                alert('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error en la solicitud DELETE:', error);
        }
    }

    document.getElementById('deleteUserForm').addEventListener('submit', deleteUser);

    // Función para cargar los usuarios para la eliminación
    async function loadUsersForDeletion() {
        try {
            const response = await fetch('https://tu-api.com/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const users = await response.json();
                const selectUser = document.getElementById('selectUser');
                selectUser.innerHTML = ''; // Limpiar el contenido previo

                // Llenar el <select> con los usuarios
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.username;
                    selectUser.appendChild(option);
                });
            } else {
                console.error('Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error en la solicitud GET:', error);
        }
    }

    // Evento de cierre de sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        loginWindow.style.display = 'flex';
        mainWindow.style.display = 'none';
        sections.forEach(section => section.classList.remove('active'));
    });
});
