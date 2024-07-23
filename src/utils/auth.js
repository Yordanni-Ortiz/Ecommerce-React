export const isAuthenticated = () => {
    // Revisa si hay un token en el almacenamiento local o algún otro mecanismo de autenticación
    return !!localStorage.getItem('authToken');
};

