const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { GraphQLUpload } = require('graphql-upload');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    employees: async () => {
      try {
        return await Employee.find();
      } catch (err) {
        throw new Error('Failed to fetch employees');
      }
    },
    getEmployee: async (_, { id }) => {
      try {
        return await Employee.findById(id);
      } catch (err) {
        throw new Error('Failed to fetch employee');
      }
    }
  },

  Mutation: {
    signup: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already in use');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

      return {
        id: newUser._id,
        email: newUser.email,
        token
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid email');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid password');

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

      return {
        id: user._id,
        email: user.email,
        token
      };
    },

    addEmployee: async (_, { firstName, lastName, email, department, position, profilePic }) => {
      console.log('🚀 Received values:', {
        firstName, lastName, email, department, position, profilePic
      });

      try {
        let filename = '';
        if (profilePic) {
          const { createReadStream, filename: originalName } = await profilePic;
          const stream = createReadStream();
          const uploadDir = path.join(__dirname, '..', '..', 'uploads');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }

          const uploadPath = path.join(uploadDir, originalName);

          await new Promise((resolve, reject) => {
            stream
              .pipe(fs.createWriteStream(uploadPath))
              .on('finish', resolve)
              .on('error', reject);
          });

          filename = originalName;
        }

        const newEmployee = new Employee({
          firstName,
          lastName,
          email,
          department,
          position,
          profilePic: filename
        });

        return await newEmployee.save();
      } catch (err) {
        console.error(err);
        throw new Error('Failed to add employee');
      }
    },

    updateEmployee: async (_, { id, profilePic, ...updates }) => {
      try {
        let filename = '';

        if (profilePic) {
          const { createReadStream, filename: originalName } = await profilePic;
          const stream = createReadStream();
          const uploadDir = path.join(__dirname, '..', 'uploads');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }

          const uploadPath = path.join(uploadDir, originalName);

          await new Promise((resolve, reject) => {
            stream
              .pipe(fs.createWriteStream(uploadPath))
              .on('finish', resolve)
              .on('error', reject);
          });

          filename = originalName;
          updates.profilePic = filename;
        }

        return await Employee.findByIdAndUpdate(id, updates, { new: true });
      } catch (err) {
        console.error(err);
        throw new Error('Failed to update employee');
      }
    },

    deleteEmployee: async (_, { id }) => {
      try {
        await Employee.findByIdAndDelete(id);
        return 'Employee deleted';
      } catch (err) {
        throw new Error('Failed to delete employee');
      }
    }
  }
};

module.exports = resolvers;
