import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from './lib/connectDB';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';

connectDB();

export default NextAuth({

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await User.findOne({ email })
        if (!user) {
          throw new Error("Email no registrado")
        }
        if (user) return signinUser({ password, user })
      }
    })
  ],
  pages: {
    signIn: "/signin"
  },
  secret: "secret",
  database: process.env.MONGODB_URI,
})

const signinUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Por favor, ingrese una contraseña")
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error("Contraseña incorrecta.");
  }
  return user;
}