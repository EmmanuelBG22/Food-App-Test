const adminController = require('../contollers/adminControllers')

const { Router } = require('express')

const router = Router()


router.post('/admin', adminController.admin_post)


router.get('/get-all-orders', adminController.orders_get)

router.get('/get-menu', adminController.get_menu)

router.patch('/edit-menu', adminController.edit_admin)

router.delete('/delete-admin', adminController.delete_admin)

router.delete('/delete-menu', adminController.delete_menu)

router.post('/export', adminController.download_order)


module.exports = router