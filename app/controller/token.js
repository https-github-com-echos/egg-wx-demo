'use strict'

const Controller = require('egg').Controller

/**
 * @controller user 用户接口
 */
class TokenController extends Controller {
  /**
   * @summary 登录接口
   * @description 获取 Token
   * @router post /api/v1/token
   * @request body createUserRequest *body
   * @response 200 queryUserResponse 创建成功
   */
  async create() {
    const ctx = this.ctx
    const app = this.app
    const v = await new ctx.app.validator.TokenValidator().validate(ctx)
    const loginType = v.get('body.type')
    const {
      USER_EMAIL,
      USER_MINI_PROGRAM,
    } = app.enums.LoginType

    let token = ''
    /* eslint-disable */
    switch (loginType) {
      case USER_EMAIL:
        const email = v.get('body.email')
        const secret = v.get('body.secret')
        const user = await ctx.service.user.findByEmail(email)
        if (!user) {
          throw new app.errs.ParameterException('账号或密码错误')
        }
        token = await ctx.service.token.passwordToToken(secret, user)
        break
      case USER_MINI_PROGRAM:
        const code = v.get('body.code')
        token = await ctx.service.token.wxCodeToToken(code)
        break

      default:
        throw new app.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body = {
      token
    }
  }

  async verify() {

  }
}
module.exports = TokenController