const info = {
  "mail": process.env.SF_USER,
  "password": process.env.SF_PASSWORD,
  "remember": 1
}

console.log(info)
module.exports = info