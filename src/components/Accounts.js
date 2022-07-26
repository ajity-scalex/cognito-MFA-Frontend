import React, { createContext } from "react";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import AWS from 'aws-sdk'

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'ap-south-1' })
const AccountContext = createContext();

const Account = props => {

    const getSession = async () => 
         await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if(user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject(err);
                    } else {

                        const accessToken = session.accessToken.jwtToken

                        const mfaEnabled = await new Promise((resolve) => {
                            cognito.getUser(
                              {
                                AccessToken: accessToken,
                              },
                              (err, data) => {
                                if (err) resolve(false)
                                else
                                  resolve(
                                    data.UserMFASettingList &&
                                      data.UserMFASettingList.includes('SOFTWARE_TOKEN_MFA')
                                  )
                              }
                            )
                          });
                        resolve({user, session, mfaEnabled, accessToken});
                    }
                });
            } else {
                reject();
            }
        });
    

    const authenticate = async (Username, Password) => 
        await new Promise((resolve, reject) => {
            const user = new CognitoUser({Username, Pool});
            const authDetails = new AuthenticationDetails({Username, Password});
            user.authenticateUser(authDetails, {
                onSuccess: data =>{
                    console.log('OnSuccess:',data);
                    resolve(data);
                },
    
                onFailure: err =>{
                    console.log('onFailure:', err);
                    reject(err);
                },
    
                totpRequired: () => {
                    const token = prompt('Please enter your 6-digit token')
                    user.sendMFACode(
                      token,
                      {
                        onSuccess: () => (window.location.href = window.location.href),
                        onFailure: () => alert('Incorrect code!'),
                      },
                      'SOFTWARE_TOKEN_MFA'
                    )
                  },
            });
        });
    

    const logout = () => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.signOut();
      }
    };

    return (
        <AccountContext.Provider value={{
            authenticate,
            getSession,
            logout
            }}>
                {props.children}
    
        </AccountContext.Provider>
    )
};

export { Account, AccountContext };
