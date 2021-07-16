import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		match: /^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]+/i,
		required: true
	},
	hashed_password: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		match: /01\d-\d{3,4}-\d{4}/,
		required: true
	}
})

export default mongoose.model('User', userSchema)