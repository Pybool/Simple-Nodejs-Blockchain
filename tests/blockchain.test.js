const Block = require('./block');
const Blockchain = require('./blockchain');
const cryptoHash = require('./crypto_hash');

describe('Blockchain()', () =>{
    let blockchain, newchain, originalChain;
    beforeEach(() => {
    blockchain = new Blockchain();
    newchain = new Blockchain();
    originalChain = blockchain.chain;
    })
    
    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0] ).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({data: newData});
        expect(blockchain.chain[blockchain.chain.length-1].data ).toEqual(newData);
    });


describe('isValidChain()', () =>{
    describe('When the chain does not start with the genesis block', () => {
        it('returns false', () => {
            blockchain.chain[0]= {data: 'fake-genesis'};
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
    });

    describe('When the chain starts with the genesis block and has multiple blocks', () => {
        beforeEach(() =>{
            blockchain.addBlock({data:'Bitcoin'});
            blockchain.addBlock({data:'Ethereum'});
            blockchain.addBlock({data:'Tron'});
        });
        describe('and a lastHash reference has changed', () => {
            it('returns false', () => {
                

                blockchain.chain[2].lastHash = 'broken-lastHash';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('and the chain contains a block with an invalid field', () => {
           
            it('returns false', () => {
               
                blockchain.chain[2].data = 'some-bad-and-evil-data';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

            });

        describe('and the chain contains a block with a jumped difficulty', () => {
        
            it('returns false', () => {
                
                const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                const timestamp = Date.now();
                const nonce = 0;
                const difficulty = lastBlock.difficulty - 3 ;
                const data = [];
                const lastHash = lastBlock.hash;

                const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
                const badBlock = new Block({timestamp, lastHash, nonce, difficulty,data});
                blockchain.chain.push(badBlock);

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

            });    

        describe('and the chain does not contain any invalid blocks', () => {
           
            it('returns true', () => {
                
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
            });

     });
    });
  }); 
 }); 

 describe ('replaceChain()', () => {
     let errorMock, logMock;
     beforeEach(() =>{
        errorMock = jest.fn();
        logMock = jest.fn();
        global.console.log = logMock;
     });
   describe('when the new chain is not longer', () => {
        it('does not replace the chain', () => {

            newchain.chain[0] = {new:'chain'};
            blockchain.replaceChain(newchain.chain);
            expect(blockchain.chain).toEqual(originalChain);
        });
   });
   describe ('when the new chain is longer', () =>{

    beforeEach(() =>{
       newchain.addBlock({data:'Bitcoin'});
       newchain.addBlock({data:'Ethereum'});
       newchain.addBlock({data:'Tron'});
    });

    describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
            newchain.chain[2].hash = 'some-fake-hash';
            blockchain.replaceChain(newchain.chain);
            expect(blockchain.chain).toEqual(originalChain);
        });
    });


    describe('and the chain is valid', () => {});
        it('does replace the chain', () => {
            blockchain.replaceChain(newchain.chain);
            expect(blockchain.chain).toEqual(newchain.chain);

    });
   });

 });

 });
});
