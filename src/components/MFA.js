import React, {useEffect, useState, useContext} from 'react';
import { AccountContext } from './Accounts';

export default () => {
    const [userCode, setUserCode] = useState('');
    const [enabled, setEnabled] = useState(false);
    const[image, setImage] = useState('');

    const {getSession} = useContext(AccountContext);

    useEffect(()=>{
        getSession().then(({mfaEnabled}) => {
            setEnabled(mfaEnabled)
        })
    }, [])

    const getQRCode = () => {
        getSession().then(({ accessToken, headers }) => {
            accessToken = accessToken
            console.log(accessToken);
            const uri = `http://localhost:3000/api/v1/mfa/qrcode/?accessToken=${accessToken}`;
            // console.log(headers);

            fetch(uri).then((payload) => payload.json())
            .then(res => setImage(res.data))
            .catch(err => console.error(err))
        })
    }
    const enableMFA = (event) => {
        event.preventDefault();

        console.log(userCode);
        getSession().then(({ user, accessToken, headers }) => {
            accessToken = accessToken
            const uri = `http://localhost:3000/api/v1/mfa/validatemfa/?accessToken=${accessToken}&userCode=${userCode}`;
            // console.log(headers);

            fetch(uri, {method:'POST'}).then((payload) => payload.json())
            .then(res => {
                if(res.Status && res.Status === 'SUCCESS') {
                    setEnabled(true);

                    const settings = {
                        PreferredMFA: true,
                        Enabled: true
                    }
                    user.setUserMfaPreference(null, settings, ()=>{});
 
                } else {
                    if (res.code === 'EnableSoftwareTokenMFAException') {
                        alert('Incorrect 6-digit code!')
                      } else if (res.code === 'InvalidParameterException') {
                        alert('Please provide a 6-digit number')
                      }
                }
            })
            .catch(err => console.error(err))
        })

    }


    return (
      <div>
        <h1>Multi-Factor Authentication</h1>
        {enabled ? (
          <div>MFA is enabled</div>
        ) : image ? (
          <div>
            <h3>Scan this QR code: </h3>
            <img src={image} />

            <form onSubmit={enableMFA}>
              <input
                value={userCode}
                onChange={(event) => setUserCode(event.target.value)}
              />
              <button type='Submit'>Submit Code</button>
            </form>
          </div>
        ) : (
          <button onClick={getQRCode}>Enable MFA</button>
        )}
      </div>
    ); 
}