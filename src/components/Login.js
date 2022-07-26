import React, {useContext, useState} from 'react';
import { AccountContext } from './Accounts';

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticate } = useContext(AccountContext);
  
  const onSubmit = (event) => {
    event.preventDefault();

    authenticate(email, password)
      .then((payLoad) => {
        const token = payLoad.getAccessToken().getJwtToken()
        console.log("Logged in!", token);
      })
      .catch((err) => {
        console.error("Failed to Login!", err);
      });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};