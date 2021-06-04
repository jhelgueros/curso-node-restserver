const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validate-fields');
// const { validarJWT } = require('../middlewares/validate-jwt');
// const { esAdminRole, tieneRol } = require('../middlewares/validate-roles');

const { validarCampos, validarJWT, tieneRol } = require('../middlewares')

const { usuariosGet, usuariosPut, usuariosDelete, usuariosPost } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


module.exports = router