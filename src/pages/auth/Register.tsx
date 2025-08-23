import React from 'react';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { debug } from '../../utils/debug';

export const Register: React.FC = () => {
  debug.render('Register');
  return <RegisterForm />;
};