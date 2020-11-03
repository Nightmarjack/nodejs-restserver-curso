const jwt = require('jsonwebtoken');
// ===============
// Verificar Token
// ===============

let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });  
}

// ===============
// Verificar Admin Rol
// ===============

let verificaAdminRole = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No cuentas con los permisos sequeridos para hacer esta acción.'
                }
            })
        }
    
        next();
    });
}

module.exports = { 
    verificarToken,
    verificaAdminRole
}