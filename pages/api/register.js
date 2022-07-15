import bcrypt from 'bcrypt'
import Users from './models/userModel'

export default async function handler(req, res) {
  const body = req.body;
  const user = await Users.findOne({ email: body.email })
  if (user) {
    res.status(200).json({ message: 'El email ya se encuentra registrado' })
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(body.password, salt)
  const newUser = new Users({ email: body.email, password: hashPass })
  await newUser.save()
  res.status(200).json({ message: 'success' })
}