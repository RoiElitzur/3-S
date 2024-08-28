import http from "http";
import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import routerUsers from './routes/user.js'
import routerToken from './routes/token.js'
import routerCourse from './routes/course.js'
import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static('src'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser());
app.set('view engine', 'ejs');
// app.use('/Chats', routerChats);
app.use('/Users', routerUsers);
app.use('/Tokens', routerToken);
app.use('/Courses',routerCourse);
mongoose.connect("mongodb://127.0.0.1:27017/3S", {
    useNewUrlParser: true,
    useUnifiedTopology: true});


const server = http.createServer(app);
const port = 12345;
server.listen(port, () => {});
