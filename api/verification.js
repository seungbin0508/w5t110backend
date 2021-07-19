/**
 * 회원 계정 생성 시 보낸 인증 이메일을 통해 호출되며
 * 정상적으로 진행이 완료된 경우 회원 db의 이메일 인증 필드가 참이 됩니다.
 */

import express from 'express'

const router = express.Router()

router.get('/:userId', (req, res) => {

})

export default router