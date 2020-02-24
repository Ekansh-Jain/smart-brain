const express=require('express');
const bodyParser= require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex');
const app = express();
app.use(bodyParser.json());
app.use(cors());


const register=require('./controllers/register');
const image=require('./controllers/image');
const signin=require('./controllers/signin');
const profile=require('./controllers/profile');

const db= knex({
	client: 'pg',
	  connection: {
	    host : '127.0.0.1',
	    user : 'postgres',
	    password : 'ej@8958242590',
	    database : 'smartbrain'
	  }
});



app.get('/',(req,res)=>{res.send(database.users)})
app.post('/signin',(req,res)=>{signin.handleSignin(req,res,db,bcrypt)});
app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)});
app.get('/profile/:id',(req,res)=>{	profile.handleProfile(req,res,db)})
app.put('/image',(req,res)=>{image.handleImage(req,res,db)});
app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res,db)});


app.listen(3002,()=>{
	console.log('app is running');
})


