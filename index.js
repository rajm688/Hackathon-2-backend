import express from "express";
import {MongoClient} from "mongodb"
import bcrypt from "bcrypt";
const app = express();
const PORT = 9200;
app.use(express.json());
const users = [];
const MONGO_URL = "mongodb://localhost"
async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongo is connected")
    return client;
}
const client =  await createConnection();
  app.get("/signup", (req, res) => {
  res.send();
});
app.get("/dashboard" ,async (req,res)=>{
  const token = await client.db("crm").collection("users").find({})
  res.send(token)
})
app.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt, hashedpassword);
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password:hashedpassword ,
    };
    users.push(user);
    res.send("signup success");
  } catch{
    console.log("error in try block")
  }
});
app.post("/login",async (req,res)=>{
const user = users.find(user=>user.email === user.body.email )
if(user == null){
    return res.send("user not found")
}
try{
    if(await bcrypt.compare(req.body.password, user.password)){
        res.send("success")
    }else{
        res.send("something went wrong")
    }

}catch{
    console.log("error in try block")
}
})
app.listen(PORT, () => console.log("app started"));
