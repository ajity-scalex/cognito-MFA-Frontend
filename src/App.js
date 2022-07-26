import React from 'react';
import { Account } from './components/Accounts';
import Signup from './components/SignUp';
import Login from './components/Login';
import Status from './components/Status';
import MFA from './components/MFA';

export default () => {
  return (
    <Account>
      <Status />
      <Signup />
      <Login />
      <MFA />
    </Account>
  );
};



