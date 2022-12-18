import Post from '../models/Posts.js';
import User from "../models/User.js";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'
import Comment from '../models/Comment.js';

export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.user)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

            const newPostWithImage = new Post({
                username: user.username,
                title,
                text,
                imgUrl: fileName,
                author: req.user,
            })

            await newPostWithImage.save()
            await User.findByIdAndUpdate(req.user, {
                $push: { posts: newPostWithImage },
            })

            return res.json(newPostWithImage)
        }

        const newPostWithoutImage = new Post({
            username: user.username,
            title,
            text,
            imgUrl: '',
            author: req.user,
        })
        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.user, {
            $push: { posts: newPostWithoutImage },
        })

        res.json(newPostWithoutImage)
    } catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка создания поста' })
    }
}


export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        if (!posts) {
            return res.json({ message: 'Постов нет' })
        }

        res.json({ posts, popularPosts })
    }
    catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка получение постов' });
    }
}

export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        })
        res.json(post)
    }
    catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка получение постa' });
    }
}

export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const list = await Promise.all(
            user.posts.map(post => {
                return Post.findById(post._id)
            })
        )
        res.json(list)
    }
    catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка получение постa' });
    }
}

export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) {
            return res.json({ message: 'Поста не существует' })
        }
        await User.findByIdAndUpdate(req.user, {
            $pull: { posts: req.params.id }
        })
        res.json({ message: 'Пост удален!' })
    }
    catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка получение постa' });
    }
}


export const updatePost = async (req, res) => {
    try {
        const { title, text, id } = req.body;
        const post = await Post.findById(id);

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));
            post.imgUrl = fileName || ''
        }

        post.title = title;
        post.text = text;
        await post.save();

        res.json({
            post,
            message: 'Пост изменен!'
        })
    }
    catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка изменения постa' });
    }
}

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    } catch (e) {
        console.log(e);
        res.json({ message: 'Ошибка получения коментария' })
    }
}


