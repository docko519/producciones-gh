const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 


const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const verificationCodes = new Map();
const verificationAttempts = new Map();

const TOKEN_TEMP_SECRET = 'clave_secreta_temporal'; 



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
app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor funcionando', timestamp: new Date() });
});

// Registro de usuarios
app.post('/api/auth/register', async (req, res) => {
  const { nombre, email, telefono, password, verificationToken } = req.body;
  console.log('Datos de registro recibidos:', req.body); // Debug

  try {
    // ✅ Usa la misma clave que al generar el token
    try {
      jwt.verify(verificationToken, TOKEN_TEMP_SECRET);
    } catch (tokenError) {
      console.error('❌ Token inválido o expirado:', tokenError.message);
      return res.status(400).json({ 
        success: false,
        error: 'Token de verificación inválido o expirado' 
      });
    }

    // Verificar si el usuario ya existe
    const [exists] = await db.query(
      'SELECT id FROM usuarios WHERE email = ? OR telefono = ?', 
      [email, telefono]
    );

    if (exists.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'El correo o teléfono ya está registrado' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, hashedPassword]
    );

    res.status(201).json({ 
      success: true,
      userId: result.insertId
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor al registrar usuario' 
    });
  }
});




// app.post('/api/auth/register', async (req, res) => {
//   const { nombre, email, telefono, password } = req.body;
//   try {
//     const [exists] = await db.query('SELECT id FROM usuarios WHERE email = ? OR telefono = ?', [email, telefono]);
//     if (exists.length > 0) {
//       return res.status(400).json({ error: 'El correo o teléfono ya está registrado' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await db.query('INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)', [nombre, email, telefono, hashedPassword]);

//     res.status(201).json({ success: true, userId: result.insertId });
//   } catch (err) {
//     console.error('Error registrando usuario:', err);
//     res.status(500).json({ error: 'Error registrando usuario' });
//   }
// });

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

    const [fechas] = await connection.query(
      'SELECT id, disponible FROM fechas WHERE fecha = ? FOR UPDATE',
      [fecha]
    );

    let fecha_id;
    if (fechas.length === 0) {
      const [insert] = await connection.query(
        'INSERT INTO fechas (fecha, disponible) VALUES (?, FALSE)',
        [fecha]
      );
      fecha_id = insert.insertId;
    } else {
      fecha_id = fechas[0].id;
      if (!fechas[0].disponible) {
        await connection.rollback();
        return res.status(409).json({ error: 'Fecha no disponible' });
      }
    }

    await connection.query(
      'INSERT INTO reservas (usuario_id, fecha_id, paquete_id, estado) VALUES (?, ?, ?, "pendiente")',
      [usuario_id, fecha_id, paquete_id]
    );

    await connection.query('UPDATE fechas SET disponible = FALSE WHERE id = ?', [fecha_id]);
    await connection.commit();

    // Obtener info adicional
    const [[usuario]] = await db.query(
      'SELECT nombre, telefono FROM usuarios WHERE id = ?',
      [usuario_id]
    );
    const [[paquete]] = await db.query(
      'SELECT nombre, precio FROM paquetes WHERE id = ?',
      [paquete_id]
    );

    const [yyyy, mm, dd] = fecha.split('T')[0].split('-');
    const fechaFormateada = `${dd}/${mm}/${yyyy}`;

    // Correo al administrador
    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: 'produccionesgh1117@gmail.com', 
      subject: 'Nueva reserva recibida',
      html: `
        <h3>Se ha registrado una nueva reserva</h3>
        <p><strong>Cliente:</strong> ${usuario.nombre}</p>
        <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
        <p><strong>Paquete:</strong> ${paquete.nombre} - $${paquete.precio.toLocaleString('es-MX')}</p>
        <p><strong>Fecha del evento:</strong> ${fechaFormateada}</p>
      `
    };

    try {
      const resultado = await transporter.sendMail(mailOptions);
      console.log('📧 Correo enviado al administrador:', resultado.response);
    } catch (errorCorreo) {
      console.error('❌ Error al enviar correo al administrador:', errorCorreo.message);
      // No afecta a la creación de la reserva
    }

    res.status(201).json({ success: true, fecha_id });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('❌ Error en reserva:', err);
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

// Configuración del transporte de correo para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pereitazegna@gmail.com',
    pass: 'oiwjnsyjfyzusxvm'
  },
  tls: {
    rejectUnauthorized: false // Solo para desarrollo, quitar en producción
  }
});


// Ruta para enviar código de verificación
app.post('/api/auth/send-verification', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Almacena el código con su fecha de expiración (15 minutos)
  verificationCodes.set(email, {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  // Reinicia contador de intentos
  verificationAttempts.set(email, 0);

  console.log(`Código generado para ${email}: ${code}`); // Solo para desarrollo

  try {
    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: email,
      subject: 'Código de verificación',
      text: `Tu código para completar tu registro es: ${code}`,
      html: `<p>Tu código es: <strong>${code}</strong></p>
             <p>Este código expirará en 15 minutos.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);

    res.json({ 
      success: true, 
      message: 'Código enviado',
      expiresIn: 15 * 60 // Tiempo en segundos
    });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error enviando código de verificación',
      details: err.message 
    });
  }
});

app.post('/api/auth/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar por email o teléfono
    const [users] = await db.query(
      'SELECT id, email FROM usuarios WHERE email = ? OR telefono = ?',
      [email, email]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado con ese correo o teléfono'
      });
    }

    const userEmail = users[0].email;

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar código con expiración
    verificationCodes.set(userEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    verificationAttempts.set(userEmail, 0); // Reiniciar intentos

    // Configurar y enviar correo
    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: userEmail,
      subject: 'Código para restablecer tu contraseña',
      html: `<p>Tu código para restablecer la contraseña es: 
             <strong>${code}</strong></p>
             <p>Este código expirará en 15 minutos.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${userEmail}:`, info.response);

    res.json({
      success: true,
      message: 'Código enviado',
      email: userEmail,
      expiresIn: 15 * 60
    });

  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al procesar la solicitud',
      details: error.message
    });
  }
});


// Ruta para verificar código
app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;

  const attempts = verificationAttempts.get(email) || 0;
  if (attempts >= 5) {
    return res.status(429).json({ 
      success: false,
      error: 'Demasiados intentos. Por favor solicita un nuevo código.' 
    });
  }

  const record = verificationCodes.get(email);
  if (!record) {
    return res.status(400).json({ 
      success: false,
      error: 'No se encontró código para este email. Solicita uno nuevo.' 
    });
  }

  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(email);
    return res.status(400).json({ 
      success: false,
      error: 'El código ha expirado. Solicita uno nuevo.' 
    });
  }

  if (record.code !== code) {
    verificationAttempts.set(email, attempts + 1);
    const remaining = 5 - (attempts + 1);
    return res.status(400).json({ 
      success: false,
      error: `Código incorrecto. Te quedan ${remaining} intentos.` 
    });
  }

  verificationCodes.delete(email);
  verificationAttempts.delete(email);

  res.json({ 
    success: true,
    message: 'Código verificado correctamente',
    token: generarTokenTemporal(email) 
  });
});

//Ruta reser-pass V1
// app.post('/api/auth/reset-password', async (req, res) => {
//   const { token, password } = req.body;

//   try {
//     const decoded = jwt.verify(token, TOKEN_TEMP_SECRET);
//     const email = decoded.email;

//     if (!password || typeof password !== 'string') {
//       return res.status(400).json({ success: false, error: 'Contraseña inválida' });
//     }

//     const hashedPassword = await bcrypt.hash(password.toString(), 10);
//     await db.query('UPDATE usuarios SET password = ? WHERE email = ?', [hashedPassword, email]);

//     res.json({ success: true, message: 'Contraseña actualizada correctamente' });
//   } catch (error) {
//     console.error('Error al restablecer contraseña:', error);
//     res.status(400).json({ 
//       success: false,
//       error: 'Token inválido o expirado. Solicita un nuevo código.' 
//     });
//   }
//   });

// app.post('/api/auth/verify-code', (req, res) => {
//   const { email, code } = req.body;

//   // Verificar intentos
//   const attempts = verificationAttempts.get(email) || 0;
//   if (attempts >= 5) {
//     return res.status(429).json({ 
//       success: false,
//       error: 'Demasiados intentos. Por favor solicita un nuevo código.' 
//     });
//   }

//   if (!verificationCodes.has(email)) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'No se encontró código para este email. Solicita uno nuevo.' 
//     });
//   }

//   const record = verificationCodes.get(email);

//   if (Date.now() > record.expiresAt) {
//     verificationCodes.delete(email);
//     return res.status(400).json({ 
//       success: false,
//       error: 'El código ha expirado. Solicita uno nuevo.' 
//     });
//   }

//   if (record.code !== code) {
//     verificationAttempts.set(email, attempts + 1);
//     const remainingAttempts = 5 - (attempts + 1);
//     return res.status(400).json({ 
//       success: false,
//       error: `Código incorrecto. Te quedan ${remainingAttempts} intentos.` 
//     });
//   }

//   // Código válido
//   verificationCodes.delete(email);
//   verificationAttempts.delete(email);
  
//   res.json({ 
//     success: true, 
//     message: 'Código verificado correctamente',
//     token: generarTokenTemporal(email) // Implementa esta función según tu sistema
//   });
// });

// Ruta para test de correo (puedes mantenerla)
app.get('/test-mail', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: 'Test <test@produccionesgh.com>',
      to: 'docko_519@outlook.com',
      subject: 'Prueba de correo',
      text: 'Esto es una prueba'
    });
    res.send(`Correo enviado: ${info.response}`);
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
});

// Función auxiliar para generar token temporal (ejemplo)
function generarTokenTemporal(email) {
  return jwt.sign({ email }, TOKEN_TEMP_SECRET, { expiresIn: '15m' });
}


// Ruta para solicitar recuperación de contraseña
app.post('/api/auth/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.query(
      'SELECT id, email FROM usuarios WHERE email = ? OR telefono = ?',
      [email, email]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado con ese correo o teléfono'
      });
    }

    const userEmail = users[0].email;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    verificationCodes.set(userEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });
    verificationAttempts.set(userEmail, 0);

    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: userEmail,
      subject: 'Código para restablecer tu contraseña',
      html: `<p>Tu código para restablecer la contraseña es: <strong>${code}</strong></p>
             <p>Este código expirará en 15 minutos.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${userEmail}:`, info.response);

    res.json({
      success: true,
      email: userEmail,
      message: 'Código enviado',
      expiresIn: 15 * 60
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al procesar la solicitud',
      details: error.message
    });
  }
});

// Ruta para restablecer contraseña
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' });
    }

    const decoded = jwt.verify(token, TOKEN_TEMP_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Token inválido' });
    }

    if (typeof password !== 'string' || password.trim().length < 6) {
      return res.status(400).json({ success: false, error: 'Contraseña inválida o muy corta' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    await db.query(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return res.status(400).json({
      success: false,
      error: 'Token inválido o expirado. Solicita un nuevo código.'
    });
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
    // 1. Obtener información completa de la reserva
    const [[reserva]] = await db.query(`
      SELECT r.estado, f.fecha, f.id as fecha_id,
             u.nombre AS usuario_nombre, u.telefono,
             p.nombre AS paquete_nombre
      FROM reservas r
      JOIN fechas f ON r.fecha_id = f.id
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN paquetes p ON r.paquete_id = p.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    if (reserva.estado !== 'pendiente') {
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas pendientes' });
    }

    // 2. Cancelar y liberar fecha
    await db.query('UPDATE reservas SET estado = "cancelada" WHERE id = ?', [req.params.id]);
    await db.query('UPDATE fechas SET disponible = TRUE WHERE id = ?', [reserva.fecha_id]);

    // 3. Formatear la fecha
    const fechaStr = new Date(reserva.fecha).toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const [yyyy, mm, dd] = fechaStr.split('-');
    const fechaFormateada = `${dd}/${mm}/${yyyy}`;


    // 4. Enviar notificación al admin
    const mailOptions = {
      from: 'Producciones GH <no-reply@produccionesgh.com>',
      to: 'produccionesgh1117@gmail.com',
      subject: 'Reserva cancelada por el cliente',
      html: `
        <h3>Un usuario ha cancelado su reserva</h3>
        <p><strong>Cliente:</strong> ${reserva.usuario_nombre}</p>
        <p><strong>Teléfono:</strong> ${reserva.telefono}</p>
        <p><strong>Paquete:</strong> ${reserva.paquete_nombre}</p>
        <p><strong>Fecha del evento:</strong> ${fechaFormateada}</p>
        <p>La fecha se encuentra disponible para reservar de nuevo.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Reserva cancelada y notificación enviada' });

  } catch (err) {
    console.error('Error cancelando reserva:', err);
    res.status(500).json({ error: 'Error cancelando reserva' });
  }
});


//------------------------ADMIN--------------------//
// Middleware para verificar admin
const isAdmin = async (req, res, next) => {
   console.log('Verificando admin...'); // Debug
  try {
    // Temporal: Permitir todas las solicitudes para testing
    console.log('Acceso concedido (testing)');
    return next();
    } catch (err) {
    console.error('Error en middleware isAdmin:', err);
    res.status(500).json({ error: 'Error de autenticación' });
  }
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
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

app.put('/api/admin/reservas/:id', isAdmin, async (req, res) => {
  const { estado } = req.body;
  const reservaId = req.params.id;

  try {
    // Actualizar el estado de la reserva
    await db.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, reservaId]);

    // Obtener información del usuario, paquete y fecha
    const [[info]] = await db.query(`
      SELECT u.email, u.nombre AS usuario_nombre, u.telefono,
             p.nombre AS paquete_nombre, p.precio,
             f.fecha
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN paquetes p ON r.paquete_id = p.id
      JOIN fechas f ON r.fecha_id = f.id
      WHERE r.id = ?
    `, [reservaId]);

    if (!info || !info.email) {
      return res.status(404).json({ error: 'No se encontró el usuario para la reserva' });
    }

    const fechaFormateada = new Date(info.fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Contenido personalizado según el estado
    let asunto = '';
    let mensaje = '';

    if (estado === 'confirmada') {
      asunto = '¡Tu reserva ha sido confirmada!';
      mensaje = `
        <p>Hola ${info.usuario_nombre},</p>
        <p>Tu reserva para el día <strong>${fechaFormateada}</strong> ha sido <strong>confirmada</strong>.</p>
        <p>Paquete: <strong>${info.paquete_nombre} - $${info.precio.toLocaleString('es-MX')}</strong></p>
        <p>Gracias por confiar en <strong>Producciones GH</strong>.</p>
      `;
    } else if (estado === 'cancelada') {
      asunto = 'Tu reserva ha sido cancelada';
      mensaje = `
        <p>Hola ${info.usuario_nombre},</p>
        <p>Lamentamos informarte que tu reserva para el <strong>${fechaFormateada}</strong> ha sido <strong>cancelada</strong>.</p>
        <p>Si tienes alguna duda, contáctanos.</p>
      `;
    }

    // Enviar correo al usuario si corresponde
    if (asunto && mensaje) {
      await transporter.sendMail({
        from: 'Producciones GH <no-reply@produccionesgh.com>',
        to: info.email,
        subject: asunto,
        html: mensaje
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error actualizando reserva:', err);
    res.status(500).json({ error: 'Error actualizando reserva' });
  }
});



//Delete y actualizar en el calendario 
app.delete('/api/reservas/:id', async (req, res) => {
  const reservaId = req.params.id;
  console.log('Intentando eliminar reserva con ID:', reservaId);

  try {
    // Paso 1: obtener la fecha asociada
    const [reservaRows] = await db.query(
      'SELECT fecha_id FROM reservas WHERE id = ?',
      [reservaId]
    );

    console.log('Resultado del SELECT:', reservaRows);

    if (reservaRows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const fechaId = reservaRows[0].fecha_id;

    // Paso 2: eliminar la reserva
    const [deleteResult] = await db.query(
      'DELETE FROM reservas WHERE id = ?',
      [reservaId]
    );

    console.log(`Reserva eliminada. Afectadas: ${deleteResult.affectedRows}`);

    // Paso 3: liberar la fecha
    const [updateResult] = await db.query(
      'UPDATE fechas SET disponible = 1 WHERE id = ?',
      [fechaId]
    );

    console.log(`Fecha con ID ${fechaId} marcada como disponible.`);

    res.status(200).json({ message: 'Reserva eliminada y fecha liberada' });

  } catch (error) {
    console.error('Error en la operación:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar reserva' });
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, nombre, email, telefono, created_at as fecha_registro 
      FROM usuarios
    `);
    res.json(users);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ error: 'Error al cargar usuarios' });
  }
});

// Crear usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  
  try {
    // Verificar si ya existe
    const [exists] = await db.query(
      'SELECT id FROM usuarios WHERE email = ? OR telefono = ?', 
      [email, telefono]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: 'El correo o teléfono ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, hashedPassword]
    );

    res.status(201).json({ 
      id: result.insertId,
      nombre,
      email,
      telefono
    });
  } catch (err) {
    console.error('Error creando usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  try {
    // Verificar si el email/teléfono ya existe en otro usuario
    const [exists] = await db.query(
      'SELECT id FROM usuarios WHERE (email = ? OR telefono = ?) AND id != ?',
      [email, telefono, id]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: 'El correo o teléfono ya está en uso' });
    }

    await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
      [nombre, email, telefono, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


// Obtener todos los paquetes
app.get('/api/paquetes', async (req, res) => {
  try {
    const [paquetes] = await db.query('SELECT * FROM paquetes');
    res.json(paquetes);
  } catch (err) {
    console.error('Error obteniendo paquetes:', err);
    res.status(500).json({ error: 'Error al cargar paquetes' });
  }
});

// Crear paquete
app.get('/api/admin/paquetes', isAdmin, async (req, res) => {
  try {
    const [paquetes] = await db.query('SELECT * FROM paquetes');
    // Asegurarse de devolver siempre un array, incluso si está vacío
    res.json(paquetes || []);
  } catch (err) {
    console.error('Error obteniendo paquetes:', err);
    res.status(500).json({ error: 'Error obteniendo paquetes', details: err.message });
  }
});

// Obtener un paquete específico
app.get('/api/admin/paquetes', isAdmin, async (req, res) => {
  console.log('Accediendo a /api/admin/paquetes'); // Debug
  try {
    const [paquetes] = await db.query('SELECT * FROM paquetes');
    console.log('Paquetes encontrados:', paquetes); // Debug
    res.json(paquetes);
  } catch (err) {
    console.error('Error en GET /api/admin/paquetes:', err);
    res.status(500).json({ error: 'Error al obtener paquetes', details: err.message });
  }
});

// Crear paquete
app.post('/api/admin/paquetes', isAdmin, async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  
  try {
    // Verificar si ya existe
    const [exists] = await db.query(
      'SELECT id FROM paquetes WHERE nombre = ?', 
      [nombre]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: 'Ya existe un paquete con este nombre' });
    }

    // Validaciones
    if (typeof precio !== 'number' || isNaN(precio)) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }
    if (precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor que cero' });
    }
    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO paquetes (nombre, descripcion, precio) VALUES (?, ?, ?)',
      [nombre, descripcion, precio]
    );

    // Devolver el paquete creado con su ID
    const [newPaquete] = await db.query('SELECT * FROM paquetes WHERE id = ?', [result.insertId]);
    res.status(201).json(newPaquete[0]);
  } catch (err) {
    console.error('Error creando paquete:', err);
    res.status(500).json({ error: 'Error al crear paquete' });
  }
});

// Actualizar paquete
app.put('/api/admin/paquetes/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    // Verificar si el paquete existe
    const [existing] = await db.query('SELECT id FROM paquetes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    // Verificar nombre duplicado
    const [duplicate] = await db.query(
      'SELECT id FROM paquetes WHERE nombre = ? AND id != ?',
      [nombre, id]
    );
    if (duplicate.length > 0) {
      return res.status(400).json({ error: 'Ya existe un paquete con este nombre' });
    }

    // Validaciones
    if (typeof precio !== 'number' || isNaN(precio)) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }
    if (precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor que cero' });
    }
    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }

    await db.query(
      'UPDATE paquetes SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?',
      [nombre, descripcion, precio, id]
    );

    // Devolver el paquete actualizado
    const [updated] = await db.query('SELECT * FROM paquetes WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error actualizando paquete:', err);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

// Eliminar paquete
app.delete('/api/admin/paquetes/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el paquete existe
    const [existing] = await db.query('SELECT id FROM paquetes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    // Verificar reservas asociadas
    const [reservas] = await db.query(
      'SELECT id FROM reservas WHERE paquete_id = ?',
      [id]
    );
    if (reservas.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar: tiene reservas asociadas' 
      });
    }

    await db.query('DELETE FROM paquetes WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando paquete:', err);
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
});
// app.post('/api/paquetes', async (req, res) => {
//   const { nombre, descripcion, precio } = req.body;
  
//   try {
//     // Verificar si ya existe un paquete con el mismo nombre
//     const [exists] = await db.query(
//       'SELECT id FROM paquetes WHERE nombre = ?', 
//       [nombre]
//     );

//     if (exists.length > 0) {
//       return res.status(400).json({ error: 'Ya existe un paquete con este nombre' });
//     }

//     // Validar que el precio sea un número positivo
//     if (isNaN(precio)) {
//       return res.status(400).json({ error: 'El precio debe ser un número válido' });
//     }

//     if (precio <= 0) {
//       return res.status(400).json({ error: 'El precio debe ser mayor que cero' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO paquetes (nombre, descripcion, precio) VALUES (?, ?, ?)',
//       [nombre, descripcion, precio]
//     );

//     res.status(201).json({ 
//       id: result.insertId,
//       nombre,
//       descripcion,
//       precio
//     });
//   } catch (err) {
//     console.error('Error creando paquete:', err);
//     res.status(500).json({ error: 'Error al crear paquete' });
//   }
// });

// Actualizar paquete
app.put('/api/paquetes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    // Verificar si el nombre ya existe en otro paquete
    const [exists] = await db.query(
      'SELECT id FROM paquetes WHERE nombre = ? AND id != ?',
      [nombre, id]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: 'Ya existe un paquete con este nombre' });
    }

    // Validar que el precio sea un número positivo
    if (isNaN(precio)) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }

    if (precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor que cero' });
    }

    await db.query(
      'UPDATE paquetes SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?',
      [nombre, descripcion, precio, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error actualizando paquete:', err);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

// Eliminar paquete
app.delete('/api/paquetes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el paquete tiene reservas asociadas
    const [reservas] = await db.query(
      'SELECT id FROM reservas WHERE paquete_id = ?',
      [id]
    );

    if (reservas.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el paquete porque tiene reservas asociadas' 
      });
    }

    await db.query('DELETE FROM paquetes WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando paquete:', err);
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
});

// Ruta para verificar código de email
app.post('/api/auth/verify-email', (req, res) => {
  const { email, code } = req.body;
  console.log(`Verificando código para ${email}. Código recibido: ${code}`); // Debug

  // Verificar intentos
  const attempts = verificationAttempts.get(email) || 0;
  if (attempts >= 5) {
    return res.status(429).json({ 
      success: false,
      error: 'Demasiados intentos. Por favor solicita un nuevo código.' 
    });
  }

  if (!verificationCodes.has(email)) {
    console.log(`No se encontró código para ${email}`); // Debug
    return res.status(400).json({ 
      success: false,
      error: 'No se encontró código para este email. Solicita uno nuevo.' 
    });
  }

  const record = verificationCodes.get(email);
  console.log(`Código almacenado para ${email}: ${record.code}`); // Debug
  
  // Verificar si el código ha expirado
  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(email);
    return res.status(400).json({ 
      success: false,
      error: 'El código ha expirado. Solicita uno nuevo.' 
    });
  }

  // Verificar si el código coincide
  if (record.code !== code) {
    verificationAttempts.set(email, attempts + 1);
    const remainingAttempts = 5 - (attempts + 1);
    console.log(`Código incorrecto para ${email}. Intentos restantes: ${remainingAttempts}`); // Debug
    return res.status(400).json({ 
      success: false,
      error: `Código incorrecto. Te quedan ${remainingAttempts} intentos.` 
    });
  }

  // Código válido
  verificationCodes.delete(email);
  verificationAttempts.delete(email);
  console.log(`Código verificado correctamente para ${email}`); // Debug
  
  res.json({ 
    success: true, 
    message: 'Código verificado correctamente',
    token: generarTokenTemporal(email)
  });
});


// Iniciar servidor


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
