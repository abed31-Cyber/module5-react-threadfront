export default async function logout() {
  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    // ignore network errors, on veut quand même déconnecter côté client
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('user');
    // rediriger vers la page de login ou d'accueil
    window.location.href = '/Login';
  }
}
