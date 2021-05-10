const Block = require('./block');
const cryptoHash = require('./crypto_hash');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()]; //*** The Blockchain ***//

    }

    addBlock( {data} ){
        const newBlock = Block.mineBlock({
            lastBlock:this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock)

    }

    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        } ;

        for(let i= 1 ; i < chain.length; i++){
            const block = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;
            const {timestamp, lastHash, hash,nonce,difficulty, data} = block;
            
            if (lastHash !== actualLastHash) return false;
      
            const validatedHash = cryptoHash(timestamp, lastHash, data,nonce,difficulty);
            if (hash !== validatedHash) return false

            if (Math.abs(lastDifficulty-difficulty) > 1) return false
        };
        return true;

    }

    replaceChain(chain){
        if (chain.length <= this.chain.length){
            console.log('Incoming chain must be longer');
            return ;
        }

        if (!Blockchain.isValidChain(chain)){
            console.log('Incoming chain must be Valid');
            return ;
        }
        console.log('replacing chain with', chain);
        this.chain = chain;
    }




}

module.exports = Blockchain;