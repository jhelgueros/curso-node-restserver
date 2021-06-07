const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the process.env.GOOGLE_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[process.env.GOOGLE_CLIENT_ID_1, process.env.GOOGLE_CLIENT_ID_2, process.env.GOOGLE_CLIENT_ID_3]
    });
    const {
        name: nombre,
        picture: img,
        email: correo
    }
        = ticket.getPayload();
    console.log('Entro aca a veiricar', nombre)
    return { nombre, img, correo }
    // const userid = payload['sub'];


    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

// verify().catch(console.error);

module.exports = {
    googleVerify
}