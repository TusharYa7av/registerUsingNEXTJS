import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import connectDb from "./db"
import User from "@/app/models/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"


const authOption:NextAuthOptions={
  providers:[
    // login kese kroge or email wale ko bolte hai credentials provider
    CredentialsProvider({
      name:"Credentials",
      credentials:{
        email:{label:'Email',type:'text'},
        password:{label:'Password',type:'password'}
      },
      async authorize(credentials){
        const email=credentials?.email
        const password=credentials?.password
        if (!email || !password) {
          throw new Error("email or password is not found.")
        }
        await connectDb()
        const user = await User.findOne({email})
        if (!user) {
          throw new Error("user not found.")
        }
        
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch) {
          throw new Error("incorrect password")
        }
        return {
          id:user._id,
          name:user.name,
          email:user.email,
          image:user.image,
        }
      },
    }),

    Google({
      clientId:process.env.GOOGLE_CLIENT_ID!,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks:{

    async signIn({account , user}){
      if(account?.provider=="google"){
        await connectDb()
        let existUser = await User.findOne({email:user?.email})
        if(!existUser){
          existUser = await User.create({
            name:user.name,
            email:user?.email
          })
        }
        user.id=existUser._id as string
      }
      return true
    },

    async jwt({token,user}){
        if (user) {
          token.id=user.id
          token.name=user.name
          token.email=user.email
          token.image=user.image
        }
        return token
    },


    // session ke andr user ki detail dalni hai 
    session({session,token}){
      if(session.user){
        session.user.id=token.id as string
        session.user.name=token.name
        session.user.email=token.email
        session.user.image=token.image as string
      }
      return session
    }
  },
  session:{
    strategy:'jwt',
    maxAge:30*24*60*60*1000,
  },
  pages:{
    signIn:'/login',
    error:'/login',
  },
  secret:process.env.NEXTAUTH_SECRET
}
export default authOption