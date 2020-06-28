import { Router, json } from 'express'
import connector from './RTIConnector';


var router = Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('gpp get')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About gpp')
})

router.post('/setPoint', function (req, res) {
    console.log(req.body)
    const container = req.app.get('context')
    const rti_connector = container.get("rti_connector")
    rti_connector.writeData( req.body,'circle');
    res.json(req.body)
  })
export default router