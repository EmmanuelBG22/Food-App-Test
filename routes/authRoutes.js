const authController = require('../contollers/authController')
const { Router } = require('express')

const router = Router()

router.get('/signup', authController.signup_get)

router.post('/signup', authController.signup_post)

router.get('/login', authController.login_get)

router.post('/login', authController.login_post)

router.get('/logout', authController.logout_get)

router.post('/make-order', authController.make_order_post)

router.get('/make-order', authController.make_order_get)

router.get('/get-orders', authController.get_orders)

router.patch('/edit-order', authController.edit_order)

router.delete('/delete-order', authController.delete_order)

module.exports = router