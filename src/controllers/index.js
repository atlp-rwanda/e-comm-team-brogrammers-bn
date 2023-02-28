import HomeServices from "../services"

export default class HomeControllers {
  static async welcome(req, res) {
    let message = await HomeServices.home()
    res.status(200).json(message)
  }
}