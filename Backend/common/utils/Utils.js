
class Utils {

  constructor(){
    this.isValidEmail = this.isValidEmail.bind(this);
  }

   isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}

export default new Utils();
