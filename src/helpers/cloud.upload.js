import cloudinary from '../configs/cloudinary';

/**
 * upload class
 */
export default class CloudUpload {
  /**
   * @param {Object} file
   * @returns {result} return the urls
   */
  static async single(file) {
    const result = await cloudinary.uploader.upload(file.path);
    return result;
  }

  /**
   * @param {Object} files
   * @param {Function} callback
   * @returns {result} return the urls
   */
  static async multi(files) {
    const results = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const newPath = await this.single(file);
      results.push(newPath);
    }
    return results;
  }
}
