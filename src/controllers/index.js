import HomeServices from '../services';

// eslint-disable-next-line require-jsdoc
export default class HomeControllers {
  // eslint-disable-next-line require-jsdoc
  static async welcome(req, res) {
    const message = await HomeServices.home();
    res.status(200).json(message);
  }
}
