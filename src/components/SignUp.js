import React, {useState} from 'react';
import UserPool from '../UserPool';

export default () => {
    
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

    const onSubmit = event => {
        event.preventDefault();
      
        UserPool.signUp(email, password, [], null, (err, data) => {
          console.log(email +" "+ password);
          if(err)
            console.error(err);
          else
            console.log(data);
        });
      };

      return (
        <div>
            <form onSubmit={onSubmit}>
              <input value={email} onChange={event => setEmail(event.target.value)}/>
              <input value={password} onChange={event => setPassword(event.target.value)}/>
              <button type='submit'>SignUp</button>
            </form>
        </div>
          );
}