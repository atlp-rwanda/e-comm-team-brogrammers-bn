import { users } from '../database/models'

const checkEmail = async (req, res, next) => {
  try {
    let all = await users.findAll()
    console.log(all)
    next()
  }
  catch(e) {
    console.log(e)
    return res.status(500).json(e)
  }
}
 
export default checkEmail;