import React, {useEffect, useRef, useState} from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moralis from 'moralis';
import {abi} from '../abi/abi'
import BigNumber from 'bignumber.js';


const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const contract = CONTRACT_ADDRESS;

const MintFees = () => {
    const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, user} =
    useMoralis();

    const Web3Api = useMoralisWeb3Api();
    
    const ABI = abi;
    const [toggleSuccess, setToggleSuccess] = useState(false);

    const [acctBalance, setAcctBalance] = useState(0);

    const fetchNativeBalance = async () => {
        const options = {
            chain: 'ropsten',
            address: contract
        }
        
        const balance = await Web3Api.account.getNativeBalance(options);
        
        let str = balance.balance * ('1e' + 18).toLocaleString();
        let num = Number(str);

        let bigNum = new BigNumber(num);
        let formatBigNumber = [...bigNum.c.slice(0, -1).toString()];
        
        formatBigNumber.splice(1, 0, '.').join('');
        // console.log(formatBigNumber.join(''));
        // num = num.toPrecision(14)
        let formmatedBigNumber = formatBigNumber.join('');
        // console.log(typeof formmatedBigNumber);
        // console.log(formmatedBigNumber)
        if(formmatedBigNumber === '.') {
            formmatedBigNumber = '0'
        }

        setAcctBalance(formmatedBigNumber + ' ETH');
        
    }

    const collect = async () => {
        const account = (user.get('ethAddress'));
        const contract = CONTRACT_ADDRESS;

        console.log(contract);
        console.log(account);
        console.log('collect button clicked')

        const options = {
            contractAddress: CONTRACT_ADDRESS,
            functionName: "ownerWithdraw",
            abi: ABI,
        };
        console.log(options)

        const tx = await Moralis.executeFunction({...options}).then((res, err) => {
            if(err) {
                console.log(err);
            }
            console.log('ropten etherscan here: \n', 'https://ropsten.etherscan.io/tx/'+res.hash);

            if(res) {
                console.log(res)
                setToggleSuccess(true);
            }

        })
    }

    useEffect(() => {
     if(isAuthenticated){
         enableWeb3();
     }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchNativeBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            {toggleSuccess? 
                <div>
                    
                <div className="alert alert-success" role="alert">
                    <div>You have collected your minting fees of {acctBalance}</div>
                    <div>Check out the transaction link below</div>
                </div>
                    <div>
                        <h2>Collected successfully</h2>
                    </div>
                    
                </div>
            : 
                <div>
                    <h1>Collect Mint Fees of {acctBalance}</h1>
                    <h5>Only the owner of the mint can claim minting fees.</h5>
                </div>
            }
            

            {toggleSuccess? 
                <div>

                    <img id='mint-fees-img' src='https://cdn.pixabay.com/photo/2022/05/12/06/00/ethereum-7190848_960_720.jpg' alt='nft chain'></img>
                    <div>
                        
                    </div>
                </div> 
            : 
               <div>
                    <img id='mint-fees-img' src='https://cdn.pixabay.com/photo/2022/01/06/14/41/blockchain-6919617_960_720.jpg' alt='nft chain'></img>
                    <div>
                        <button className='btn glowing' id='mint-button-collect' onClick={collect}>Collect </button>
                    </div>
               </div>
            }
            
        </div>
    )
}

export default MintFees