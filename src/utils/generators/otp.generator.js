const crypto = require("crypto");

function generateOTP6() {
  let otp = crypto.randomInt(100000, 1000000).toString();
  let otpTime = Date.now() + 2 * 60 * 1000;

  return { otp, otpTime };
}

module.exports = generateOTP6;