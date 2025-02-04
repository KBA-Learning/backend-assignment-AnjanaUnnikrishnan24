import express,{json} from 'express';
import dotenv from 'dotenv';
import { userauth } from './Routes/userAuth.js';
import  adminAuth  from './Routes/adminAuth.js';

dotenv.config();
 
const app=express();
app.use(json())

app.use('/',userauth);
app.use('/',adminAuth);

app.get('/',function(req,res){
    res.send("Hello Everyone");
})

app.post('/',function(req,res){
    res.send("Hello Everyone");
})

app.listen(process.env.PORT,function(){
    console.log(`server is listening at ${process.env.PORT}`);
});