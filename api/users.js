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
<body>
        <div style=" font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;">
        <div style="display: flex; justify-content: center">
            <div
                style="
                    color: #2D3436;
                    margin-top: 50px;
                    margin-bottom: 50px;
                    display: flex;
                    justify-content: center;
                    background-color: #ECF0F1;
                    padding: 5px 50px 20px 50px;
                    width: 40%;
                    border-radius: 10px;
                "
            >
                <div class="sub-container">
                    <div style="display: flex">
                        <img
                            style="width: 150px"
                            class="image"
                            src="https://www.dogdrip.net/dvs/c/20/01/29/d63b61ccdd1fbe519c992782a2e1fac1.png"
                            alt=""
                        />
                    </div>
                    <div
                        style="
                            color: #2D3436;
                            display: flex;
                            flex-direction: column;
                        "
                    >
                        <h1>이메일 주소 인증</h1>
                        <link class="content-container" />
                        <span>저희 서비스를 이용해주셔서 감사합니다 :손인사: </span>
                        <br />
                        <span
                            >고객님, 아래 버튼을 클릭하여 이메일 인증을
                            완료해주세요.
                        </span>
                        <button
                            style="
                                margin: 25px 0 25px 0;
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
                                style="color: #ECF0F1"
                                href="http://13.209.84.245/verification/${userId}"
                                >이메일 인증하기</a
                            >
                        </button>
                        <div
                            style="
                                color: #2D3436;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                font-size: 15px;
                            "
                        >
                            <p>가입을 시도하지 않으셨나요?</p>
                            <a
                                style="text-decoration: none"
                                href="https://www.w3schools.com/css/css_howto.asp"
                                >온라인 고객센터 바로가기</a
                            >
                        </div>
                        <div>
                            <h2
                                style="
                                    font-size: 18px;
                                    font-weight: 400;
                                    margin-bottom: 2px;
                                "
                            >
                                - 펭수 드림 -
                            </h2>
                            <span>The Future of Penguin Cinema</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>	
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