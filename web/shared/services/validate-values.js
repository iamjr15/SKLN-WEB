export const validateService = {
  validateEmail(emailToValidate) {
    const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailExpression.test(emailToValidate)) {
      return true
    } else {
      return false
    }
  },
  validateNumeric(providedValue) {
    if (
      (providedValue >= 48 && providedValue <= 57) ||
      providedValue === 8 ||
      providedValue === 46 ||
      providedValue === 37 ||
      providedValue === 38 ||
      providedValue === 39 ||
      providedValue === 40
    ) {
      return true
    } else {
      return false
    }
  },
  validatePassword(password) {
    const passwordExpression = /^[a-zA-Z0-9]{8,}$/
    if (passwordExpression.test(password)) {
      return true
    } else {
      return false
    }
  }
}
