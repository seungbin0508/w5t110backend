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
		// todo 비밀번호 암호화 필요
		// https://dlrow.tistory.com/entry/mongoose-password-%EC%95%94%ED%98%B8%ED%99%94
		// https://www.google.com/search?q=mongoose+password+hashing&oq=mongoose+password+hashing&aqs=chrome..69i57.5903j0j7&sourceid=chrome&ie=UTF-8
		// https://developer-mac.tistory.com/55
		// https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
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

export default mongoose.model('User', userSchema)