const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto_hash');
const hexToBin  = require('hex-to-binary');

class Block{
    constructor({timestamp,lastHash,data,hash,nonce,difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

// Genesis block creator Static method //////////////////////    
    static genesis() {
        return new Block(GENESIS_DATA);
    }

// Mined blocks creator Static method ///////////////////////

    static mineBlock({ lastBlock,data }){
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        //const timestamp = Date.now(); 
        let {difficulty} = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock,timestamp})
            hash = cryptoHash(timestamp, lastHash,data,nonce,difficulty);

        } while(hexToBin(hash).substring(0, difficulty) !='0'.repeat(difficulty));

        return new this({timestamp,lastHash,data,difficulty,nonce,hash });
           // hash: cryptoHash(timestamp,lastHash,data,nounce,difficulty)

        
    }

    static adjustDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;
        if (difficulty < 1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
        return difficulty + 1; 

    }


}
module.exports = Block;

