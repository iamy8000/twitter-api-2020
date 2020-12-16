const followshipController = require('../controllers/followshipController')
const db = require('../models')
const User = db.User
const Followship = db.Followship
const helpers = require('../_helpers')

const followshipServices = {
  addFollowing: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    return Followship.create({
      followerId: USERID,
      followingId: req.body.id
    }).then(followship => {
      callback({ status: 'success', message: ''})
    })
  },
}

module.exports = followshipServices