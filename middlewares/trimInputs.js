/**
 * Trims input in req.body
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const trimInputs = (req, res, next) => {
  for (const index in req.body) {
    req.body[index] = typeof req.body[index] === 'string'
      ? req.body[index].trim() : req.body[index];
  }
  next();
};

export default trimInputs;
