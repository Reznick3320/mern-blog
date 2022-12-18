import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (user) {
			return res.json({
				message: "Данный емейл уже зайнят!"
			})
		}
		const salt = bcrypt.genSaltSync(3);
		const hash = bcrypt.hashSync(password, salt)


		const newUser = new User({
			username,
			password: hash
		});

		const token = jwt.sign({
			id: newUser._id
		}, process.env.SECRET_KEY, { expiresIn: '18h' });

		await newUser.save();

		res.json({
			newUser,
			token,
			message: 'Регистрация прошла успешно!'
		})

	} catch (e) {
		console.log(e);
		res.json({ message: 'Ошибка при создании пользователя!' })
	}
}

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.json({
				message: 'Пользователь не зарегистрирован!'
			})
		}

		const isPassword = await bcrypt.compareSync(password, user.password);
		if (!isPassword) {
			return res.json({
				message: 'Не верный пароль!'
			})
		}
		const token = jwt.sign({
			id: user._id,
			username: user.username
		}, process.env.SECRET_KEY, { expiresIn: '18h' });

		res.json({
			token,
			user,
			message: 'Вы войшли в систему!'
		})


	} catch (e) {
		console.log(e);
		res.json({ message: 'Ошибка авторизации пользователя!' })
	}
}
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user);
		if (!user) {
			return res.json({
				message: 'Пользователь не зарегистрирован!'
			})
		}
		const token = jwt.sign({
			id: user._id,
			username: user.username
		}, process.env.SECRET_KEY, { expiresIn: '18h' });

		res.json({
			user,
			token
		})
	} catch (e) {
		console.log(e);
		res.json({message: "Нет доступа"})
	}
}
