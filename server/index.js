const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')

const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())

  function wwwRedirect(req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
      var newHost = req.headers.host.slice(4)
      return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
    }
    next()
  }

  server.set('trust proxy', true)
  server.use(wwwRedirect)

  server.get(`/u/yoginth.test`, (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600')
    console.log(req.headers['user-agent'])
    if (req.headers['user-agent'] === 'googlebot') {
      return res.status(200).json({ gm: 'gm' })
    } else {
      return handle(req, res)
    }
  })

  server.all('*', (req, res) => {
    // res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Cache-Control', 'no-store')
    return handle(req, res)
  })

  server.disable('x-powered-by')

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
