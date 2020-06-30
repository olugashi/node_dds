import { Router, json } from 'express'
import Controller from '../controllers/gpp.controller'

var router = Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', function (req, res) {
  res.json({ message:  'gpp get'})
})

// define the about route
router.get('/about', function (req, res) {
  res.json({ message:  'gpp about'})
})

router.post('/createRoutes',Controller.createRoutes)

export default router