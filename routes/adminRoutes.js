const adminController = require('../contollers/adminControllers')

const { Router } = require('express')

const router = Router()

// router.get('/admin', authController.admin_get)

router.post('/admin', adminController.admin_post)

// router.get('/login', authController.login_get)

// router.post('/login', authController.login_post)

// router.get('/logout', authController.logout_get)

// router.post('/make-order', authController.make_order_post)

// router.get('/make-order', authController.make_order_get)

router.get('/get-menu', adminController.get_menu)

router.patch('/edit-admin', adminController.edit_admin)

router.delete('/delete-admin', adminController.delete_admin)

router.delete('/delete-menu', adminController.delete_menu)

module.exports = router