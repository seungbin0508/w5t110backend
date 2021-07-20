import express from 'express'
import { User } from '../models/index.js'
import auth from '../middlewares/auth.js'
import smtpTransport from '../services/email.js'

const router = express.Router()

router.post('/', async (req, res) => {
	const { email } = req.body
	try {
		const { _id: userId } = await User.create(req.body)

		const template = `
<div style=" font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
sans-serif;">

<div
	style="
		color: #2d3436;
		display: flex;
		justify-content: center;
		background-color: #ecf0f1;
		height: 390px;
		width: 500px;
		border-radius: 10px;
	"
>
	<div class="sub-container">
		<div>
			<img
				style="width: 80px"
				class="image"
				src="https://www.dogdrip.net/dvs/c/20/01/29/d63b61ccdd1fbe519c992782a2e1fac1.png"
				alt=""
			/>
		</div>
		<div style="color: #2d3436">
			<h1 style="font-size: 20px">이메일 주소 인증</h1>
			<link style="font-size: 10px" />
			<span style="font-size: 15px"
				>저희 서비스를 이용해주셔서 감사합니다 👋
			</span>
			<div>
				<span style="font-size: 15px"
					>고객님, 아래 버튼을 클릭하여 이메일 인증을
					완료해주세요.
				</span>
			</div>

			<button
				style="
					margin: 25px 0 0 0;
					width: 120px;
					height: 40px;
					background-color: rgb(60, 117, 238);
					border: none;
					border-radius: 5px;
					color: white;
					font-weight: 600;
					font-size: 15px;
				"
			>
				<a
					target="_blank"
					style="color: #ecf0f1; text-decoration: none"
					href="http://13.209.84.245/verification/${userId}"
					>이메일 인증하기</a
				>
			</button>

			<div style="color: #2d3436; font-size: 15px">
				<p>가입을 시도하지 않으셨나요?</p>
				<a
					style="text-decoration: none"
					href="https://www.w3schools.com/css/css_howto.asp"
					>온라인 고객센터 바로가기</a
				>
			</div>
			<div>
				<span>- The Future of Penguin Cinema -</span>
			</div>
		</div>
	</div>
</div>

		`
		const mailOptions = {
			from: process.env.MAIL_ID,
			to: email,
			subject: '롯데 시네마 회원가입 인증 메일',
			html: template
		}

		await smtpTransport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err)
				return res.status(400).json({
					errorMessage: '회원 가입 인증 메일 발송을 실패했습니다.'
				})
			}
			console.log(info.envelope)
			console.log(info.messageId)
			return res.sendStatus(201)
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json(err)
	}
})

/** All methods but POST has to go through auth middleware **/
router.all('/:userId', auth, (req, res, next) => {
	const { userId } = req.params

	// Ensure if the id in path and token are identical
	if (userId !== String(res.locals.user._id)) {
		return next(new Error('토큰의 아이디와 경로의 아이디가 다릅니다.'))
	}

	next()
})

router.get('/:userId', async (req, res) => {
	const { userId } = req.params
	try {

		// Remove unnecessary fields, i.e. password in this circumstances, for security issue.
		const user = await User.findById(userId).select('-password')
		res.send(user)
	} catch (err) {
		console.error(err)
		res.send(400)
	}
})

router.put('/:userId', async (req, res) => {
	const { userId } = req.params
	try {

		// Update everything that came in inside req.body
		await User.findByIdAndUpdate(userId, req.body)
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

router.delete('/:userId', async (req, res) => {
	const { userId } = req.params
	try {
		await User.findByIdAndDelete(userId)
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

export default router