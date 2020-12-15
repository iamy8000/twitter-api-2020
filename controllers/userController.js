const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let account = req.body.account
    let password = req.body.password

    User.findOne({ where: { account: account } }).then(user => {
      console.log(user)
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, introduction: user.introduction
        }
      })
    })
  },
  signUp: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.passwordCheck) {
      return res.json({
        status: 'error',
        message: '所有欄位皆為必填',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        passwordCheck: req.body.passwordCheck
      })
    }
    const accountName = req.body.account.split('')
    if (accountName[0] !== '@') {
      return res.json({
        status: 'error',
        message: '帳號需為＠開頭'
      })
    }
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({
        status: 'error',
        message: '兩次密碼輸入不同！',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
      })
    } else {
      User.findOne({ where: { account: req.body.account } })
        .then(user => {
          if (user) {
            return res.json({
              status: 'error',
              message: '此帳號已被使用，請換一組！',
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: req.body.password,
              passwordCheck: req.body.passwordCheck
            })
          }
        })
        .then(user => {
          User.findOne({ where: { email: req.body.email } })
            .then(user => {
              if (user) {
                return res.json({
                  status: 'error',
                  message: '此信箱已註冊過！',
                  name: req.body.name,
                  account: req.body.account,
                  email: req.body.email,
                  password: req.body.password,
                  passwordCheck: req.body.passwordCheck
                })
              } else {
                User.create({
                  name: req.body.name,
                  account: req.body.account,
                  email: req.body.email,
                  password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                  role: 'User',
                })
                  .then(user => {
                    return res.json({
                      status: 'success',
                      message: '帳號註冊成功！'
                    })
                  })
              }
            })
        })
    }
  },
}

module.exports = userController