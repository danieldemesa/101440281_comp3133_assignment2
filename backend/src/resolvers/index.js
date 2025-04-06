const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    getEmployees: async () => await Employee.find(),
    getEmployee: async (_, { id }) => await Employee.findById(id),
  },

  Mutation: {
    signup: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
      return { id: newUser.id, email: newUser.email, token };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid email');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { id: user.id, email: user.email, token };
    },

    addEmployee: async (_, args, context) => {
      if (!context.req.headers.authorization) throw new Error('Unauthorized');
      const newEmp = new Employee({ ...args });
      return await newEmp.save();
    },

    updateEmployee: async (_, { id, ...updates }, context) => {
      if (!context.req.headers.authorization) throw new Error('Unauthorized');
      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    },

    deleteEmployee: async (_, { id }, context) => {
      if (!context.req.headers.authorization) throw new Error('Unauthorized');
      await Employee.findByIdAndDelete(id);
      return 'Employee deleted';
    },
  },
};

module.exports = resolvers;

