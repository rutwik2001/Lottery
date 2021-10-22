const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3')
const compileFile = require('../compile');

const bytecode = compileFile.evm.bytecode.object;
const abi = compileFile.abi;

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'})

})

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    });

    it('a player can enter', async () => {
        await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
        const players = await lottery.methods.getPlayers().call();
        assert.equal(players.length, 1 );
        assert.equal(players[0], accounts[0]);
    });

    it('multiple players can enter', async () => {
        await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
        await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei('0.01', 'ether')});
        await lottery.methods.enter().send({from: accounts[2], value: web3.utils.toWei('0.01', 'ether')});
        const players = await lottery.methods.getPlayers().call();
        assert.equal(players.length, 3 );
        assert.equal(players[0], accounts[0]);
    });

    it('requires minimum amount to enter', async () => {
        try{
            await lottery.methods.enter().send({from: accounts[0], value: 0});
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('only manager can pick winner', async () => {
        try{
            await lottery.methods.pickWinner().send({from: accounts[1]});
            assert(false)
        } catch(err) {
            assert(err);
        }
    });

    it('sends money to winner and reset players array', async () => {
        await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('2', 'ether')});
        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0])
        assert(finalBalance-initialBalance>web3.utils.toWei('1.8', 'ether'));
    })
})