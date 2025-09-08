require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

// Configura tu token de acceso largo y app secret en el .env
const INSTAGRAM_TOKEN = process.env.INSTAGRAM_TOKEN;
const REFRESH_URL = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${INSTAGRAM_TOKEN}`;

async function refreshToken() {
    try {
        const response = await axios.get(REFRESH_URL);
        const newToken = response.data.access_token;
        const expiresIn = response.data.expires_in;
        console.log('Nuevo token:', newToken);
        console.log('Expira en (segundos):', expiresIn);

        // Actualiza el .env
        let env = fs.readFileSync('.env', 'utf8');
        env = env.replace(/INSTAGRAM_TOKEN=.*/g, `INSTAGRAM_TOKEN=${newToken}`);
        fs.writeFileSync('.env', env);
        console.log('Token actualizado en .env');
    } catch (error) {
        console.error('Error al refrescar el token:', error.response ? error.response.data : error);
    }
}

refreshToken();
