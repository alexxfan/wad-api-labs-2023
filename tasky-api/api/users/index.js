import express from 'express';
import User from './userModel';

const router = express.Router(); // eslint-disable-line

// Custom password validation middleware
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  // Define the password validation regular expression
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // Check if the password meets the requirements
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.' });
  }

  // If the password is valid, continue with the next middleware or route handler
  next();
};

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', validatePassword, async (req, res) => {
    if (req.query.action === 'register') {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User({ ...req.body, password: hashedPassword }).save();
      res.status(201).json({
        code: 201,
        msg: 'Successfully created a new user.',
      });
    }
    else {  //Must be an authenticate then!!! Query the DB and check if there's a match
        const user = await User.findOne(req.body);
        if (!user) {
            return res.status(401).json({ code: 401, msg: 'Authentication failed' });
        }else{
            return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' });
        }
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});

export default router;