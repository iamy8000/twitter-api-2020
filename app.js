const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
const app = express()

//websocket
const http = require('http')
const server = http.createServer(app)
const sessionParser = session({ secret: "12345", resave: false, saveUninitialized: false })

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const passport = require('./config/passport')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'itismyserect', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(express.static("public"))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(sessionParser)

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.user = helpers.getUser(req)
  next()
})


app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./config/websocketConfig').websocket(app, sessionParser, server, port)
require('./routes')(app)

module.exports = app