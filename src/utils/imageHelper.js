/**
 * Convierte una imagen Base64 a un objeto File
 * @param {string} base64String - String Base64 de la imagen
 * @param {string} fileName - Nombre del archivo
 * @returns {File} - Objeto File
 */
export const base64ToFile = (base64String, fileName) => {
  if (!base64String) return null;
  
  // Extraer el tipo MIME y los datos
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], fileName, { type: mime });
};

/**
 * Genera un nombre único para el archivo
 * @param {string} userId - ID del usuario
 * @param {string} extension - Extensión del archivo (jpg, png, etc)
 * @returns {string} - Nombre único del archivo
 */
export const generateUniqueFileName = (userId, extension = 'jpg') => {
  const timestamp = Date.now();
  return `user-${userId}-${timestamp}.${extension}`;
};

/**
 * Obtiene la extensión de un archivo Base64
 * @param {string} base64String - String Base64
 * @returns {string} - Extensión del archivo
 */
export const getBase64Extension = (base64String) => {
  if (!base64String) return 'jpg';
  
  const mime = base64String.split(',')[0].match(/:(.*?);/);
  if (!mime) return 'jpg';
  
  const mimeType = mime[1];
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
  };
  
  return extensions[mimeType] || 'jpg';
};

/**
 * Valida si una imagen Base64 es válida
 * @param {string} base64String - String Base64
 * @returns {boolean} - true si es válida
 */
export const isValidBase64Image = (base64String) => {
  if (!base64String || typeof base64String !== 'string') return false;
  
  const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  return base64Pattern.test(base64String);
};

/**
 * Simula el guardado de imagen (en un proyecto real, esto sería una llamada al backend)
 * Por ahora, solo retorna la ruta donde debería guardarse
 * @param {string} base64String - String Base64 de la imagen
 * @param {string} userId - ID del usuario
 * @returns {Promise<string>} - Ruta de la imagen guardada
 */
export const saveImageLocally = async (base64String, userId) => {
  if (!isValidBase64Image(base64String)) {
    throw new Error('Imagen Base64 inválida');
  }
  
  const extension = getBase64Extension(base64String);
  const fileName = generateUniqueFileName(userId, extension);
  const imagePath = `/uploads/users/${fileName}`;
  
  // En un proyecto real con backend, aquí harías:
  // const formData = new FormData();
  // const file = base64ToFile(base64String, fileName);
  // formData.append('image', file);
  // await fetch('/api/upload', { method: 'POST', body: formData });
  
  // Por ahora, guardamos en localStorage como fallback
  try {
    localStorage.setItem(`image_${userId}`, base64String);
    console.log(`Imagen guardada para usuario ${userId} en localStorage`);
  } catch (error) {
    console.warn('No se pudo guardar en localStorage:', error);
  }
  
  return imagePath;
};

/**
 * Recupera una imagen guardada localmente
 * @param {string} userId - ID del usuario
 * @returns {string|null} - Base64 de la imagen o null
 */
export const getImageLocally = (userId) => {
  try {
    return localStorage.getItem(`image_${userId}`);
  } catch (error) {
    console.warn('No se pudo recuperar imagen:', error);
    return null;
  }
};

/**
 * Elimina una imagen guardada localmente
 * @param {string} userId - ID del usuario
 */
export const deleteImageLocally = (userId) => {
  try {
    localStorage.removeItem(`image_${userId}`);
    console.log(`Imagen eliminada para usuario ${userId}`);
  } catch (error) {
    console.warn('No se pudo eliminar imagen:', error);
  }
};
