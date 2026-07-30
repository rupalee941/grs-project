# GRS
step 1 => Create a folder name -> GRS
step 2 =>Create a react project with bootstrap,axios,react-router-dom

step 3 =>Create server folder for handle the baackend in the parent folder grs.

# Server
1. initialization the project node app using npm init-y
2. install all require packages .
## Express
Use for logic and creating REST api,s
A REST API (Representational State Transfer Application Programming Interface) is a way for different software systems to communicate over the web using HTTP methods. It follows REST principles, which make APIs simple, scalable, and stateless.
npm i express

# mongoose 
Used for mongoDb database handling.
npm i mongoose 

# dotenv
dotenv is used for store the hidden or senstive credentials like db connection , network port etc
npm i dotenv

# bcrypt.js
it is used for hash the password in the encypted way
npm i bcrypt.js

# nodemon
it is used for handle the serve start action in the realtime.
node
npm i nodemon

# nodemailer
it is used for implement the email sending funcationality to a user .
 npm i nodemailer

#

 # installing all together
 npm i express mongoose dotenv bcryptjs nodemon nodemailer 

 # jsonwebtokens 
  it is used for authentication

  # Schema
  1. Admin Schema = name, email, password
  2. College Schema = name , Description,status,timestamps
  3.Complain Type = ComplaintType  name description status timestamps 


  # client 
  Folder ->pages
  1. Home .jsx
  2. Admin.jsx
  3. UserLogin.jsx
  4. UserRegister.jsx
      Name ,fname , email, mobile, college(select),course(select),session(select),enrollment number (text), password(password), DOB , gender , address 
  5.Folder 
     admin
  6.Folder
     user

import img from 'src'
<img src={img} alt=''>

cmpt id 
Description
status active first status, inactive and delete 
cmp complaint cpm status
View, block and update

view profile for particular students 


Inside the admin to view all users and then the admin will able to see the particular user


discussion forum

Question schema 
user id ,Question , Status, timestamps

Answer schema
Questionid , user id , answer ,status, timestamps