const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;



// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Middleware para probar conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    const conn = await db.getConnection();
    conn.release();
    next();
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor funcionando', timestamp: new Date() });
});

// Registro de usuarios
app.post('/api/auth/register', async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  try {
    const [exists] = await db.query('SELECT id FROM usuarios WHERE email = ? OR telefono = ?', [email, telefono]);
    if (exists.length > 0) {
      return res.status(400).json({ error: 'El correo o teléfono ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)', [nombre, email, telefono, hashedPassword]);

    res.status(201).json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error('Error registrando usuario:', err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Login 
app.post('/api/auth/login', async (req, res) => {
  const { telefono, password } = req.body;
  console.log(`Intento de login con teléfono: ${telefono}`);

  try {
    // 1. Primero verifica en administradores
    const [admins] = await db.query('SELECT * FROM administradores WHERE telefono = ?', [telefono]);
    
    if (admins.length > 0) {
      console.log('Admin encontrado, verificando contraseña...');
      
      // Comparación directa (sin bcrypt)
      if (admins[0].password === password) {
        const admin = admins[0];
        delete admin.password;
        admin.isAdmin = true;
        console.log('Admin autenticado:', admin);
        
        return res.status(200).json({ success: true, user: admin });
      }
    }

    // 2. Si no es admin, verifica en usuarios normales
    const [users] = await db.query('SELECT * FROM usuarios WHERE telefono = ?', [telefono]);
    
    if (users.length > 0) {
      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (validPassword) {
        delete user.password;
        user.isAdmin = false;
        console.log('Usuario normal autenticado:', user);
        return res.status(200).json({ success: true, user });
      }
    }

    console.log('Credenciales incorrectas para teléfono:', telefono);
    return res.status(401).json({ error: 'Credenciales incorrectas' });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el login', details: err.message });
  }
});

// Obtener fechas disponibles
app.get('/api/fechas-disponibles', async (req, res) => {
  try {
    const [fechas] = await db.query('SELECT id, fecha FROM fechas WHERE disponible = TRUE AND fecha >= CURDATE()');
    res.json({ success: true, data: fechas });
  } catch (err) {
    console.error('Error obteniendo fechas:', err);
    res.status(500).json({ error: 'Error obteniendo fechas' });
  }
});

// Obtener paquetes
app.get('/api/paquetes', async (req, res) => {
  try {
    const [paquetes] = await db.query('SELECT * FROM paquetes');
    res.json({ success: true, data: paquetes });
  } catch (err) {
    console.error('Error obteniendo paquetes:', err);
    res.status(500).json({ error: 'Error obteniendo paquetes' });
  }
});

// Obtener administradores
app.get('/api/administradores', async (req, res) => {
  try {
    const [admins] = await db.query('SELECT id, nombre, telefono, whatsapp, instagram, facebook, tiktok FROM administradores');
    res.json({ success: true, data: admins });
  } catch (err) {
    console.error('Error obteniendo administradores:', err);
    res.status(500).json({ error: 'Error obteniendo administradores' });
  }
});

// Obtener eventos calendario
app.get('/api/eventos-calendario', async (req, res) => {
  try {
    const [fechas] = await db.query(`
      SELECT 
        DATE_FORMAT(f.fecha, '%Y-%m-%d') as date,
        CASE 
          WHEN f.disponible = 1 THEN 'disponible'
          ELSE 'no-disponible' 
        END as estado
      FROM fechas f
    `);
    
    const eventos = fechas.map(f => ({
      start: f.date,
      display: 'background',
      backgroundColor: f.estado === 'disponible' ? '#378006' : '#FF0000',
      className: `fc-event-${f.estado}`,
      extendedProps: {
        estado: f.estado
      }
    }));
    
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// app.get('/api/eventos-calendario', async (req, res) => {
//   try {
//     const [eventos] = await db.query(`
//       SELECT 
//         f.fecha,
//         CASE WHEN r.estado = 'confirmada' THEN 'no-disponible'
//              WHEN r.estado = 'pendiente' THEN 'pendiente'
//              ELSE 'disponible' END as estado
//       FROM fechas f
//       LEFT JOIN reservas r ON f.id = r.fecha_id
//       WHERE f.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
//       ORDER BY f.fecha
//     `);

//     const eventosFormateados = eventos.map(e => ({
//       id: e.fecha,
//       title: e.estado === 'disponible' ? 'Disponible' :
//              e.estado === 'pendiente' ? 'Pendiente' : 'No disponible',
//       date: e.fecha,
//       color: e.estado === 'disponible' ? '#378006' :
//              e.estado === 'pendiente' ? '#FFA500' : '#FF0000',
//       textColor: '#FFFFFF',
//       display: 'background',
//       extendedProps: { estado: e.estado }
//     }));
    

//     res.json(eventosFormateados);
//   } catch (err) {
//     console.error('Error obteniendo eventos:', err);
//     res.status(500).json({ error: 'Error cargando eventos' });
//   }
// });

// Crear reserva
app.post('/api/reservas', async (req, res) => {
  const { usuario_id, fecha, paquete_id } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [fechas] = await connection.query('SELECT id, disponible FROM fechas WHERE fecha = ? FOR UPDATE', [fecha]);

    let fecha_id;
    if (fechas.length === 0) {
      const [insert] = await connection.query('INSERT INTO fechas (fecha, disponible) VALUES (?, FALSE)', [fecha]);
      fecha_id = insert.insertId;
    } else {
      fecha_id = fechas[0].id;
      if (!fechas[0].disponible) {
        await connection.rollback();
        return res.status(409).json({ error: 'Fecha no disponible' });
      }
    }

    await connection.query('INSERT INTO reservas (usuario_id, fecha_id, paquete_id, estado) VALUES (?, ?, ?, "pendiente")', [usuario_id, fecha_id, paquete_id]);
    await connection.query('UPDATE fechas SET disponible = FALSE WHERE id = ?', [fecha_id]);

    await connection.commit();
    res.status(201).json({ success: true, fecha_id });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error en reserva:', err);
    res.status(500).json({ error: 'Error procesando reserva', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Error Handler Global
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'c0e1d2df6dd3c7', // Reemplaza con tu user de Mailtrap
    pass: 'bf6a757f17b92a' // Reemplaza con tu password de Mailtrap
  }
});

//const transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//    user: 'pereitazegna@gmail.com',
//    pass: 'uxrp rywr lbei nat'
//  },
//  tls: {
//    rejectUnauthorized: false // Solo para desarrollo, quitar en producción
//  }
//});

// Ruta para enviar código de verificación
app.post('/api/auth/send-verification', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`Intentando enviar código a: ${email}`); // Log de diagnóstico

  try {
    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: email,
      subject: 'Código de verificación',
      text: `Tu código es: ${code}`,
      html: `<p>Tu código es: <strong>${code}</strong></p>`
    };

    console.log('Opciones de correo:', mailOptions); // Log de diagnóstico

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response); // Log de confirmación

    res.json({ success: true, message: 'Código enviado' });
  } catch (err) {
    console.error('Error detallado al enviar correo:', err); // Log detallado del error
    res.status(500).json({ 
      error: 'Error enviando código de verificación',
      details: err.message 
    });
  }
});

app.get('/test-mail', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: 'Test <test@produccionesgh.com>',
      to: 'docko_519@outlook.com', // Cambia esto
      subject: 'Prueba de correo',
      text: 'Esto es una prueba'
    });
    res.send(`Correo enviado: ${info.response}`);
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
});

// Ruta para verificar código y registrar usuario
app.post('/api/auth/verify-email', async (req, res) => {
  const { nombre, email, telefono, password, code } = req.body;
  
  // Aquí deberías verificar el código contra la base de datos
  // Por simplicidad, asumiremos que el código es correcto
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, hashedPassword]
    );
    
    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error('Error registrando usuario:', err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Ruta para solicitar recuperación de contraseña
app.post('/api/auth/request-password-reset', async (req, res) => {
  const { email } = req.body;
  
  try {
    const [users] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }
    
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora de expiración
    
    await db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );
    
    const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    
    await transporter.sendMail({
      from: 'Producciones GH <tu_correo@gmail.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Este enlace expirará en 1 hora.</p>`
    });
    
    res.json({ success: true, message: 'Correo de recuperación enviado' });
  } catch (err) {
    console.error('Error en recuperación de contraseña:', err);
    res.status(500).json({ error: 'Error procesando la solicitud' });
  }
});

// Ruta para restablecer contraseña
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const [users] = await db.query(
      'SELECT id FROM usuarios WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.query(
      'UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?',
      [hashedPassword, token]
    );
    
    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (err) {
    console.error('Error restableciendo contraseña:', err);
    res.status(500).json({ error: 'Error restableciendo contraseña' });
  }
});

// Ruta para obtener reservas de un usuario
app.get('/api/reservas/usuario/:usuarioId', async (req, res) => {
  try {
    const [reservas] = await db.query(`
      SELECT r.id, r.estado, f.fecha, p.nombre as paquete_nombre, p.precio
      FROM reservas r
      JOIN fechas f ON r.fecha_id = f.id
      JOIN paquetes p ON r.paquete_id = p.id
      WHERE r.usuario_id = ?
      ORDER BY f.fecha DESC
    `, [req.params.usuarioId]);
    
    res.json(reservas);
  } catch (err) {
    console.error('Error obteniendo reservas:', err);
    res.status(500).json({ error: 'Error obteniendo reservas' });
  }
});

// Ruta para cancelar reserva
app.put('/api/reservas/:id/cancelar', async (req, res) => {
  try {
    const [reserva] = await db.query(`
      SELECT r.estado, f.fecha, f.id as fecha_id
      FROM reservas r
      JOIN fechas f ON r.fecha_id = f.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    if (reserva[0].estado !== 'pendiente') {
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas pendientes' });
    }
    
    await db.query('UPDATE reservas SET estado = "cancelada" WHERE id = ?', [req.params.id]);
    await db.query('UPDATE fechas SET disponible = TRUE WHERE id = ?', [reserva[0].fecha_id]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error cancelando reserva:', err);
    res.status(500).json({ error: 'Error cancelando reserva' });
  }
});

//------------------------ADMIN--------------------//
// Middleware para verificar admin
const isAdmin = async (req, res, next) => {
  const telefono = req.query.telefono;
  if (!telefono) {
    return res.status(400).json({ error: 'Falta número de teléfono del admin' });
  }

  try {
    const [users] = await db.query('SELECT * FROM administradores WHERE telefono = ?', [telefono]);
    if (users.length === 0) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error verificando permisos' });
  }
};



// Ruta para verificar si es admin
app.get('/api/auth/is-admin', async (req, res) => {
  try {
    const [admin] = await db.query('SELECT id FROM administradores WHERE telefono = ?', [req.query.telefono]);
    res.json({ isAdmin: admin.length > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error verificando admin' });
  }
});

// Obtener todas las reservas (para admin)
app.get('/api/admin/reservas', isAdmin, async (req, res) => {
  try {
    const [reservas] = await db.query(`
      SELECT r.id, r.estado, f.fecha, u.nombre as cliente, u.telefono, 
             p.nombre as paquete, p.precio
      FROM reservas r
      JOIN fechas f ON r.fecha_id = f.id
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN paquetes p ON r.paquete_id = p.id
      ORDER BY f.fecha DESC
    `);
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo reservas' });
  }
});

// Actualizar estado de reserva (para admin)
app.put('/api/admin/reservas/:id', isAdmin, async (req, res) => {
  const { estado } = req.body;
  try {
    await db.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando reserva' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
