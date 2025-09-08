require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000; // Puerto en el que correrá el servidor

// Middleware para manejar JSON
app.use(express.json());

const cors = require('cors');
app.use(cors());
// Ruta principal (GET)
app.get('/', (req, res) => {
    res.send('¡Hola, este es tu backend con Node.js!');
});
// Ruta para un formulario de contacto
app.post('/contacto', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    console.log('Datos recibidos:', { nombre, email, mensaje });

    res.send(`¡Gracias, ${nombre}! Hemos recibido tu mensaje.`);
});
// Ruta para enviar el correo
app.post('/send-email', async (req, res) => {
    const { nombreEmpresa, telefono, email, tipoLimpieza, periodicidad, observaciones } = req.body;

    // Configura el transportador de Nodemailer
    const nodemailer = require('nodemailer');

    // Configura el transportador de Nodemailer solo una vez
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error('Error en la configuración del transportador:', error);
        } else {
            console.log('Transportador listo para enviar correos');
        }
    });

    // Configurar los detalles del correo
    const mailOptions = {
        from: process.env.EMAIL_USER, // Usar el correo autenticado
        to: 'limpiacristales.capel@gmail.com', // Tu correo de destino
        subject: `Nuevo formulario de contacto de ${nombreEmpresa}`,
        html: `
        <h3>Detalles del Formulario</h3>
        <p><strong>Nombre de Empresa o Cliente:</strong> ${nombreEmpresa}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo de Limpieza:</strong> ${tipoLimpieza}</p>
        <p><strong>Periodicidad:</strong> ${periodicidad}</p>
        <p><strong>Observaciones:</strong> ${observaciones}</p>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: 'Correo enviado correctamente.'
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send({
            message: 'Error al enviar el correo.',
            error: error.message || error
        });
    }
});



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
