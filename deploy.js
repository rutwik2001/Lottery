const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compileFile = require('./compile');

const bytecode = compileFile.evm.bytecode.object;
const abi = compileFile.abi;

const provider = new HDWalletProvider(
    'lumber turkey make flash reveal legend leaf trip elevator note embark unit',
    'https://goerli.infura.io/v3/32881d7ec0eb4a199983753af133d054'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(abi)
        .deploy({data: '0x' +bytecode})
        .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0] });
    console.log(abi);
    console.log('Contract deployed to ', result.options.address);
}
deploy();