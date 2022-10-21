const bcrypt = require('bcryptjs')
const {
  newUser,
  allUsers,
  updateUser,
  deleteUser,
} = require('../models/userModel')
const { showError, sendEmail } = require('../helpers')

exports.create = async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const completeName = `${firstName} ${lastName}`
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)
  const payload = {
    firstName,
    lastName,
    email,
    password: hashPassword,
    createDate: new Date(),
    updateDate: new Date(),
  }

  try {
    await newUser(payload)
    await sendEmail(email, completeName)

    payload.password = undefined
    res.status(200).json({
      message: 'Usuario creado con exito',
      code: 201,
      payload,
    })
  } catch (e) {
    showError(res, e)
  }
}
exports.showAll = async (req, res) => {
  try {
    const users = await allUsers()

    users.forEach((user) => {
      delete user.password
    })

    return res.status(200).json(users)
  } catch (e) {
    showError(res, e)
  }
}

exports.update = async (req, res) => {
  const { id } = req.params

  const { firstName, lastName, email, password } = req.body
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)
  const payload = {
    firstName,
    lastName,
    email,
    password: hashPassword,
    updateDate: new Date(),
  }
  try {
    const result = await updateUser(id, payload)
    result[0].password = undefined
    res.status(200).json({ message: 'Usuario actualizado con exito', result })
  } catch (e) {
    showError(res, e)
    console.log(e)
  }
}

exports.destroy = async (req, res) => {
  const { id } = req.params
  try {
    await deleteUser(id)
    return res.status(200).json({
      status: 'Usuario eliminado con exito',
    })
  } catch (e) {
    showError(res, e)
    console.log(e)
  }
}

exports.showById = async (req, res) => {
  const { user } = req

  return res.status(200).json({
    status: 'success',
    user,
  })
}
