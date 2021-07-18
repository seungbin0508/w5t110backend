import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const auth = async (req, res, next) => {
	const token = req.headers?.authorization?.split('Bearer ')?.[1]

	if (!token) return res.status(401).json({
		errorMessage: '토큰이 없거나 Bearer 타입이 아닙니다.'
	})

	try {
		// payload = { userId, name }
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(payload.userId)
		user ? Object.assgin(user, res.locals) : res.status(401).json({
			errorMessage: '존재하지 않는 사용자입니다.'
		})
		//todo use userId to find user instance and pass it over through res.locals.userId and return next()
		console.log(res.locals.user)
		next()
	} catch (e) {
		console.error(e)
		res.status(401).json({
			error: e,
			errorMessage: '토큰 인증을 실패했습니다.'
		})
	}
}

export default auth

