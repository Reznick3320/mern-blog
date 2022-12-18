import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from 'express-fileupload'

import authRouter from './router/auth.router.js';
import postsRoute from './router/posts.router.js'; 
import commentRouter from './router/comment.router.js';

const PORT = process.env.PORT || 5000;


const app = express();
dotenv.config();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('uploads'));


app.use('/api/auth', authRouter);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentRouter);



async function startApp() {
	try {
		await mongoose.connect(process.env.DB_URL)
		app.listen(PORT, () => console.log(`SERVER STARTED ON PORT - ${PORT}`));
	} catch (e) {
		console.log(e);
	}
}

startApp();
