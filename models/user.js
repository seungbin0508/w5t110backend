import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true
	},
	hashed_password: {
		type: String,
		required: true
	}
})

export default mongoose.model('User', userSchema)