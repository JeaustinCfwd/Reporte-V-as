const fs = require('fs');
const path = require('path');

// Leer el archivo db.json
const dbPath = path.join(__dirname, 'src', 'services', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Limpiar las fotos de todos los usuarios
if (db.users) {
  db.users.forEach(user => {
    user.photo = '';
  });
}

// Guardar el archivo limpio
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('✅ Fotos eliminadas del db.json');
console.log(`Total de usuarios limpiados: ${db.users.length}`);
