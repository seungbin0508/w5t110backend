import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
	const token = req.headers?.authorization?.split('Bearer ')?.[1]

	try { const decoded = jwt.verify(token, process.env.JWT_SECRET)} catch (e) {
		console.error(e)
		next(e)
	}
}

export default auth