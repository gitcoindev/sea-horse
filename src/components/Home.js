import React, {useEffect, useState, useRef} from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Cards from "./Cards";
// import Moralis from 'moralis';

const Home = () => {
    const {isAuthenticated, user, setUserData, isUserUpdating} = useMoralis();
    const Web3Api = useMoralisWeb3Api();

    let account;

    const [toggleUserData, setToggleUserData] = useState(false);
    const [toggleSuccess, setToggleSuccess] = useState(false);
    const [toggleLogoutMessage, settoggleLogoutMessage] = useState(false);

    const [toggleNameInput, setToggleNameInput] = useState(true);

    const [usersName, setUsersName] = useState()
    const [acctBalance, setAcctBalance] = useState(0);

    const usersFirstName = useRef('');

    if(isAuthenticated) {
        account = (user.get('ethAddress'))
    }

    if(!user)  {
        settoggleLogoutMessage(true);
    }

    const handleAccountInfoClick = () => {
        setToggleUserData(!toggleUserData)
    }

    const handleNameInputClick = (e) => {
        e.preventDefault();
        const name = usersFirstName.current.value;
        console.log(name);

        setToggleNameInput(true);
        setUsersName(name);
        setUserData({
        username: name
        })
        usersFirstName.current.value = ''
        console.log(user.attributes);
    }

    const fetchNativeBalance = async () => {
        const options = {
            chain: 'ropsten'
        }
        
        const balance = await Web3Api.account.getNativeBalance(options);
        setAcctBalance(balance.balance)
        console.log(balance)
    }

    useEffect(() => {
        fetchNativeBalance();
        // console.log('Is this working?')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    
    useEffect(() => {   
        if(isAuthenticated) {
            setToggleUserData(true);
            setToggleSuccess(true);

            setTimeout(() => {
                setToggleSuccess(false)
            }, 4000);
        
            setTimeout(() => {
                setToggleUserData(false)
            }, 8000)

        //    console.log(user)
           setUsersName(user.attributes.username)

        }
       

    }, [user, isAuthenticated, usersName])

    return (
        <div>
        <div>
        {toggleSuccess? 
            <div className="alert alert-success" role="alert">
              You have logged in succesfully
            </div>
            : 
            <></>
          }
          {toggleLogoutMessage? 
            <div className="alert alert-danger" role="alert">
              You have logged out
            </div>
            : 
            <></>
          }
          </div>
          {isAuthenticated?
          <div>
          <div >
            {toggleUserData?
              <div className="row">
              <div id='welcome-div' onClick={handleAccountInfoClick}>
                <h5 className="welcome-text">Your user id is: {user.id}</h5>
                <h5 className="welcome-text">Your eth account is: {account}</h5>
                <h5 className="welcome-text">Your balance is: {acctBalance}</h5>
              </div>
              </div>
              :
              <div id='welcome-div-hidden' onClick={handleAccountInfoClick}>
                Account Info
              </div>}   
          </div>
            
            <div>
            {usersName ?  
              <div>
                <div>
                    <h4>Welcome {usersName}</h4>
                </div>
                <div>
                <Cards />
                </div>
              </div>
            : 
            <div id="name">
              <div className="input-group mb-6" style={{alignItems: "center"}}>
                <input type="text" className="form-control" placeholder="Whats your name?" aria-label="Your name" aria-describedby="basic-addon2" ref={usersFirstName}/>
                <div className="input-group-append">
                  <button className="btn btn-primary"  onClick={handleNameInputClick} disabled={isUserUpdating}>Button</button>
                </div>
              </div>
            </div>
            }
            </div>
          </div>
          : 
          <div className='login-message'>
          <h2> Please login to interact with Sea Horse</h2>
          </div>
          }
          
        </div>
    )
}

export default Home


 // if(balanceResult) {
        //     // setBalance(balanceResult)
        //     // console.log(balanceResult);
        //     // console.log(balance)
        //     NativeBalance().then((res) => {
        //         console.log('where is this coming in ___', res)
        //         setBalance(res);

        //     })
        // };


    // async function NativeBalance() {
    //     const {data: balance, error, isLoading} = useNativeBalance({ chain: "ropsten" });
    //     if(error) {
    //         return error
    //     }
        
    //     await balance
    //     console.log(balance)
    //     let formatForValue = balance.balance
    //     console.log(formatForValue);
    //     setBalance(formatForValue);
    //     // return (<div>{formatForValue}</div>)
    // }

    
    
    //   console.log(balanceResult);


    // useEffect(() => {
    //     console.log(balance)

    //     if(balance === '0') {
    //         NativeBalance().then((res) => {
    //             console.log(res);
    //         });
    //         // let finalBalance = Object.values(NativeBalance())
    //         // console.log(finalBalance);
    //         // setBalance(finalBalance);
    //     }
      
       
    // }, [balance])