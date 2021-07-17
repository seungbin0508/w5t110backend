import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
	const token = req.headers?.authorization?.split('Bearer ')?.[1]

	if (!token) return res.status(401).json({
		errorMessage: '토큰이 없거나 Bearer 타입이 아닙니다.'
	})

	try {
		const { userId } = jwt.verify(token, process.env.JWT_SECRET)

		//todo use userId to find user instance and pass it over through res.locals.userId and return next()
	} catch (e) {
		console.error(e)
		res.status(401).json({
			error: e,
			errorMessage: '토큰 인증을 실패했습니다.'
		})
	}
}

export default auth