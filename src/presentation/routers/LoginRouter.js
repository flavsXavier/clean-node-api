const HttpResponse = require('../helpers/HttpResponse');
const InvalidParamError = require('../helpers/InvalidParamError');
const MissingParamError = require('../helpers/MissingParamError');

module.exports = class LoginRouter {
  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route(httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email)
        return HttpResponse.badRequest(new MissingParamError('email'));
      if (!this.emailValidator.isValid(email))
        return HttpResponse.badRequest(new InvalidParamError('email'));
      if (!password)
        return HttpResponse.badRequest(new MissingParamError('password'));
      const accessToken = await this.authUseCase.auth({ email, password });
      if (!accessToken) return HttpResponse.unauthorizedError();
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      // Show log of error is good for production
      // console.error(error);
      return HttpResponse.serverError();
    }
  }
};