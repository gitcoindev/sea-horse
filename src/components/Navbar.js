import React, {useEffect, useState} from 'react';
import { useMoralis } from "react-moralis";
import logo from '../logo/seahorse.jpg';
import unstoppableDomainsLogo from '../logo/uns-logo.png';
import {uauth} from '../connectors';
import {UAuthMoralisConnector} from '@uauth/moralis';

const Navbar = () => {
  const {authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis();

  const [userAddress, setUserAddress] = useState('');
  const [userFullAddress, setUserFullAddress] = useState('');
  const [addressLink, setAddressLink] = useState('');

  const getUserAddress = async () => {
    let fullAddress = await user.get("ethAddress");
    let addressArray = await [...fullAddress];

    let addressCut = await addressArray.splice(4, 34, '...');
    addressCut = [];

    console.log('should be empty array --> ', addressCut)
    setUserFullAddress(fullAddress);

    console.log(userFullAddress)
    setAddressLink('https://ropsten.etherscan.io/address/'+fullAddress);

    addressArray = addressArray.join('')
    console.log(addressArray);
    // console.log(addressCut);

    setUserAddress(await addressArray);
    console.log(await userAddress);
  }


  const loginWithUnstoppable = async () => {

    if(!isAuthenticated) {
      try {
        const uauthMoralisConnector = new UAuthMoralisConnector();
        await authenticate(uauth);

        let domainDetails = uauthMoralisConnector.uauth.user().then().catch();
        let domain = (await domainDetails).sub;

        console.log("Logged in via domain: " + domain);
        console.log("Domain owner: " + (await domainDetails).wallet_address);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const login = async () => {
    
    if(!isAuthenticated) {
      await authenticate({signingMessage: 'Welcome to Sea Horse. You must sign this message to authenticate your awesome self!'})
      .then((user) => {
        console.log(user);
      })
      .catch(function(err) {
        console.log(err);
      })
    }
  }

  useEffect(() => {
    if(isAuthenticated){
      console.log('is authenticated');
      getUserAddress();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const logOut = async () => {
    await logout();
    console.log('You have been logged out!')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id='navbar'>
        <a href='/'>
          <img src={logo} id='logo' style={{maxHeight: '30px', borderRadius: '6px', padding: '2px'}} alt='logo'/>
        </a>
        <a className="navbar-brand" href="/">Sea Horse</a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item active">
          <a className="nav-link" href="/">
            Home <span className="sr-only">(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/mint">
            Mint
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/explore">
            Explore
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/marketplace">
            Marketplace
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href={addressLink} target='_blank' rel='noreferrer'>
            Etherscan.io
          </a>
        </li>
        
      </ul>
    </div>
    <div className='login-logout-div'>
      {isAuthenticated?
        <div>
          <button id='logout' onClick={logOut} disabled={isAuthenticating}><a id='formatted-address' className='disabled' href='/'>{userAddress}</a> Logout 
          <img id='x-img' src="https://www.downloadclipart.net/thumb/17661-power-button-red-vector-thumb.png"  alt="power off logoff" />
          </button>

        </div>
      : 
        <div>
          <button id='loginWithUnstoppable' onClick={loginWithUnstoppable}><img id='formatted-address' src={unstoppableDomainsLogo} alt="unslogin" /> Login with Unstoppable</button>
          <button id='login' onClick={login}> 🦊 MetaMask Login </button>
        </div>
      }
    </div> 
  </nav>
  );
}

export default Navbar