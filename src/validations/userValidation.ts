import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
  isAdmin: Joi.boolean(),
});

export default userSchema;
