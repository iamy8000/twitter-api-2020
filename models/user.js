'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Chat)
    User.hasMany(models.Chatmessage)
    User.hasMany(models.Message)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(User, {
      through: models.Subscribe,
      foreignKey: 'subscribingId',
      as: 'Subscribers'
    })
    User.belongsToMany(User, {
      through: models.Subscribe,
      foreignKey: 'subscriberId',
      as: 'Subscribings'
    })

  };
  return User;
};