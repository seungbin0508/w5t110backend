import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		match: /^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]+/i,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		match: /01\d-\d{3,4}-\d{4}/,
		required: true
	},
	birthday: {
		type: String,
		match: /^\d{4}[01]\d[0-3]\d$/,
		required: true
	}
})

userSchema.pre('save', async function (next) {
	const user = this
	// a newly created document would return true from this.isModified('password')
	if (!user.isModified('password')) return next()

	/*
		-----Former code using callback-----
		bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt) {
			if (err) return next(err)

			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) return next(err)

				user.password = hash
				next()
			})
		})
	*/

	// -----Enhanced code using async/await-----
	try {
		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		user.password = await bcrypt.hash(user.password, salt)
		return next()
	} catch (e) {
		console.error(e)
		return next(e)
	}
})
// todo 입력받은 비밀번호 인증 필요
// https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
export default mongoose.model('User', userSchema)