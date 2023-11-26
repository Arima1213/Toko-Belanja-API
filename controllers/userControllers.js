const { User, Photo } = require('../models'); // Change 'user' to 'User'
const { generateToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');
const formatCurrency = require('../helpers/FormatCurrency');

class UserController {
  static async register(req, res) {
    try {
      const { full_name, password, gender, email } = req.body;

      if (!['male', 'female'].includes(gender)) {
        throw {
          code: 400,
          message: 'Invalid gender. Gender must be either "male" or "female".',
        };
      }

      const userData = await User.findOne({
        where: {
          email: email,
        },
      });

      if (userData) {
        throw {
          code: 404,
          message: 'User already registered!',
        };
      }

      const result = await User.create({
        full_name,
        password,
        gender,
        email,
      });

      res.status(201).json({
        id: result.id,
        full_name: result.full_name,
        email: result.email,
        gender: result.gender,
        balance: result.formattedBalance,
        createdAt: result.created,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const userData = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!userData) {
        throw {
          code: 404,
          message: 'user not registered!',
        };
      }

      const isCorrect = comparePassword(password, userData.password);

      if (!isCorrect) {
        throw {
          code: 401,
          message: 'Incorrect password!',
        };
      }

      const token = generateToken({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
      });

      res.status(200).json({
        token,
      });
    } catch (error) {
      res.status(error.code || 500).json(error);
    }
  }

  static async UpdateUserById(req, res) {
    try {
      const { full_name, email } = req.body;

      const id = res.locals.User.id;

      const [updatedRowsCount, updatedRows] = await User.update(
        { full_name, email },
        {
          where: {
            id,
          },
          returning: true,
        }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json({
          id: updatedRows[0].id,
          full_name: updatedRows[0].full_name,
          email: updatedRows[0].email,
          createdAt: updatedRows[0].createdAt,
          updatedAt: updatedRows[0].updatedAt,
        });
      } else {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async DeleteUserById(req, res) {
    try {
      const id = res.locals.User.id;

      const deletedRowCount = await User.destroy({
        where: {
          id,
        },
      });

      if (deletedRowCount > 0) {
        res
          .status(200)
          .json({ message: `Your account has been deleted successfully` });
      } else {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async topup(req, res) {
    try {
      const idUser = res.locals.User;
      const { balance } = req.body;

      const userData = await User.findOne({
        where: idUser.id,
      });

      if (!Number.isInteger(balance) || balance <= 0) {
        return res.status(400).json({ message: 'Invalid topup amount.' });
      }

      const updatedBalance = userData.balance + balance;

      if (updatedBalance >= 100000000) {
        return res
          .status(400)
          .json({ message: 'Balance limit exceeded. Cannot top up.' });
      }

      const updatedUser = await User.update(
        { balance: updatedBalance },
        { where: { id: userData.id }, returning: true }
      );

      res.status(200).json({
        message: `Your Balance Updated Successfully to ${formatCurrency(
          updatedUser[1][0].dataValues.balance
        )}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = UserController;
