import joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = joi.extend(joiPasswordExtendCore);

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default async function ProfileValidation(data) {
  const Schema = joi.object({
    username: joi.string().min(3).label('username'),
    email: joi.string().email().label('email'),
    password: joiPassword
      .string()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .label('password'),
    gender: joi
      .string()
      .lowercase()
      .valid(
        'male',
        'female',
        'both',
        'none'
      )
      .label('gender')
  });

  // eslint-disable-next-line no-return-await
  return await Schema.validate(data, {
    abortEarly: false
  });
}
