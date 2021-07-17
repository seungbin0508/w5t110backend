import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
	const token = req.headers?.authorization?.split('Bearer ')?.[1]

	if (!token) return res.status(401).json({
		errorMessage: '토큰이 없거나 Bearer 타입이 아닙니다.'
	})

	try { const decoded = jwt.verify(token, process.env.JWT_SECRET)} catch (e) {
		console.error(e)
		next(e)
	}
}

export default auth