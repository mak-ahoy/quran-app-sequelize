import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const User = sequelize.define('User', {
    email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    
  }
}, {
  timestamps: false
}
);

export default User;
