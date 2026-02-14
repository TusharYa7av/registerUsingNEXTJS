import { log } from "console"
import { connect } from "mongoose"

const mongodbUrl = process.env.MONGOOSEDB_URL
if(!mongodbUrl){
  throw new Error("mongodb url is not found.")
}

let cached = global.mongoose

if  (!cached) {
 cached = global.mongoose = {conn:null,promise:null}
}

const connectDb = async ()=> {
  if(cached.conn){
    log("cached db connected")
    return cached.conn
  }

  if(!cached.promise){
    connect(mongodbUrl).then((c)=>c.connection)
  }

  try {
    cached.conn = await cached.promise 
    log("db connected")
  } catch (error) {
    throw error
  }

  return cached.conn
}

export default connectDb