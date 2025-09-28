import emailjs from '@emailjs/browser';

emailjs.init('AE9gFcJHYlqfqiCdE');

export async function obtenerDatosEstadisticos() {
  try {
    const res = await fetch('http://localhost:3001/reportes');
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }
    const reportes = await res.json();

    const totalReportes = reportes.length;
    const problemasResueltos = reportes.filter(r => r.state === 'atendido').length;
    const usuariosActivos = new Set(reportes.map(r => r.userId || 'anonymous')).size; // Fallback si no hay userId

    // Para promedio de días: solo para reportes atendidos con fechas
    const dias = reportes
      .filter(r => r.state === 'atendido' && r.fechaResolucion && r.fechaCreacion)
      .map(r => {
        const inicio = new Date(r.fechaCreacion);
        const fin = new Date(r.fechaResolucion);
        return (fin - inicio) / (1000 * 60 * 60 * 24); // Diferencia en días
      });

    const promedioDias = dias.length > 0
      ? (dias.reduce((a, b) => a + b, 0) / dias.length).toFixed(1)
      : '0';

    return { totalReportes, problemasResueltos, usuariosActivos, promedioDias };
  } catch (error) {
    console.error('Error obteniendo datos estadísticos:', error);
    return { totalReportes: 0, problemasResueltos: 0, usuariosActivos: 0, promedioDias: '0' };
  }
}

export async function registerUser(userData) {
  try {
    const res = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error(`Error registering: ${res.status}`);
    const user = await res.json();
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { id: Date.now(), ...userData, photo: '' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch('http://localhost:3001/users');
    if (!res.ok) throw new Error(`Error fetching users: ${res.status}`);
    const users = await res.json();
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Error logging in:', error);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  }
}

export async function updateUser(id, userData) {
  try {
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error(`Error updating user: ${res.status}`);
    const user = await res.json();
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    }
    return null;
  }
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error deleting user: ${res.status}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
    return true;
  }
}

export async function getReviews() {
  try {
    const res = await fetch('http://localhost:3001/reviews');
    if (!res.ok) throw new Error(`Error fetching reviews: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('reviews') || '[]');
  }
}

export async function postReview(reviewData) {
  try {
    const res = await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error(`Error posting review: ${res.status}`);
    const review = await res.json();
    return review;
  } catch (error) {
    console.error('Error posting review:', error);
    // Fallback to localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const newReview = { id: Date.now(), ...reviewData, timestamp: new Date().toISOString() };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newReview;
  }
}

export async function sendResetEmail(email) {
  const testEmail = "jeaustincalderonulloafwd@gmail.com"; // Email hardcoded para testing y evitar error de recipient empty
  const userName = testEmail.split('@')[0];
  const resetLink = 'http://localhost:5173/reset-password'; // Enlace temporal; en producción, genera token único
  try {
    const result = await emailjs.send('service_3cbtfrz', 'template_21q3gwp', {
      to_email: testEmail,
      user_name: userName,
      reset_link: resetLink
    });
    return result.text === 'OK';
  } catch (error) {
    console.error('Error sending reset email:', error);
    return false;
  }
}

