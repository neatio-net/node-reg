<template>
  <div class="main">
    <div class="dashboard" >
      VALIDATOR DASHBOARD
    </div>
    <div v-if="step == 1">    

      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step == 2" style="padding-bottom: 90px">

     <div class="box1" >
           <div class="not-connected" v-show="address == ''">
           Please Unlock Your MetaMask wallet!
           </div>
         <div class="wallet-address" v-show="address != ''">
              <span style="color:lightgrey" > Validator Address:</span> 
               <div class="address-title" v-show="address != ''">
              {{address}}
              </div>
          </div>

          <div class="balance-details" v-show="address != ''">
                   <div class="wallet-balance-available" v-show="address !== ''">
           <span style="color:lightgrey">Available Balance:</span>  <span style="color:#a6ff33">{{fullbalance}}</span>  NEAT
          </div>
            <div class="wallet-balance-available">
           <span style="color:lightgrey">Collateral Locked:</span> <span style="color:#a6ff33">{{staking}}</span>  NEAT 
           <button class="rippleUnreg" @click="unRegister">unregister</button>
          </div>
            <div class="wallet-balance-available">
           <span style="color:lightgrey">Unclaimed Rewards:</span> <span style="color:#a6ff33">{{rewards}}</span>  
           <router-link to="/claimReward"
                  ><button class="rippleClaim">claim</button></router-link
                >
          </div>
          </div>

      </div>


    
      <div class="box2" v-show="address != ''">
        <div style="margin: 48px 0 0 108px">
            <!-- ADDRESS -->     
          <div class="item" >
            <p style="font-size: 14px">Validator Public Key (256 char long)</p>
            <input class="inputs"
              style="width: 420px;background-color:#000"
              v-model="nodePublicKey"
              placeholder="Public key"
            >
          </div>
          <div class="item">
            <p style="font-size: 14px">Validator private key (64 char long)</p>
            <input class="inputs"
              style="width: 420px;background-color:#000"
              v-model="nodePrivateKey"
              placeholder="Private key"
            >
          </div>
           <div class="item">
            <p style="font-size: 14px">Pool Commission (default 15%)</p>
            <input class="inputs"
              style="width: 420px;background-color:#000"
              v-model="commission"
              placeholder="Commission"
              
            >
          </div> 
          <div class="item">
            <p style="font-size: 14px">Amount to be locked</p>
            <input class="inputs"
              style="width: 420px;background-color:#000"
              v-model="amount"
              placeholder="Amount"
            >
          </div>
        </div>
 
        <div class="btn">
          <button id="gtButton" @click="registerValidator">{{ "PROCEED" }}</button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import BigNumber from "bignumber.js";
import neatioapi from "neatioapi";
import axios from "axios";

const Utils = neatioapi.utils;
const Nat = require("neatioapi").nat;
const Url = 'https://rpc.neatio.net';
const RPC = require("neatioapi").rpc;

export default {
  data() {
    return {
      step: 2,
      balance: "",
      fullbalance:"",
      address: "",
      privateKey: "",
      nodePublicKey: "",
      nodePrivateKey: "",
      commission: 15,
      staking:"",
      rewards:"",
      amount:"",
      limit: "21000",
      price: "",
    };
  },
  components: {
    Access,
    EyeInput,
  },

  mounted() {
    this.connectAccount();
    this.initialize();
  },
  methods: {


    initialize () {
      ethereum.on("chainChanged", (_chainId) => {        
        this.getGasPrice();
        this.getBalance ()
        this.getBalanceDetail()
      });

      ethereum.on("accountsChanged", (_accounts) => {
        this.address = _accounts[0];
        this.getBalance ()
        this.getBalanceDetail();
      })
    },


    async connectAccount () {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        this.address = accounts[0];
        this.getBalance ()
        this.getBalanceDetail();
        this.getGasPrice();
      } catch (e) {
        console.log("request accounts error:", e);
      }
    },


    getBalance () {
      ethereum
        .request({
          method: "eth_getBalance",
          params: [this.address]        
        })      
        .then( (result) => {
          this.balance = Utils.toNEAT(result)
        }
        )       
        .catch( (error) => {
            console.log("Error", error)
          }
       )
    },
    
    getBalanceDetail() {
        const valData = {
        jsonrpc: "2.0",
        method: "neat_getBalanceDetail",
        params: [`${this.address}`, "latest", true],
        id: 1,
      };
      axios.post(Url, valData )
        .then((response) => {
          this.fullbalance = Utils.toNEAT(
            Nat.toString(response.data.result.balance)
          ),
          this.staking = Utils.toNEAT(
              Nat.toString(response.data.result.delegateBalance)
          ),
          this.rewards = Utils.toNEAT(
              Nat.toString(response.data.result.rewardBalance)
          );
        })
        .catch( (error) => {
            console.log('error', error)            
          }

       )

    },

    getGasPrice() {
      ethereum
        .request({
          method: "eth_gasPrice",
          params: []
        })
        .then((result) => {
            console.log("gasprice", result);
            this.price = Utils.toNEAT(result);
          }
        )
        .catch((error) => {
            console.log('error', error)
          }

        )
    },



    // REGISTER
    async registerValidator() {
      if (
        this.nodePublicKey.indexOf("0x") === 0 &&
        this.nodePublicKey.length !== 258
      ) {
        this.info("error", this.$t("errPublicKey"));
        return;
      }
      if (
        this.nodePublicKey.indexOf("0x") !== 0 &&
        this.nodePublicKey.length !== 256
      ) {
        this.info("error", this.$t("errPublicKey"));
        return;
      }
      if (this.nodePublicKey.indexOf("0x") !== 0) {
        this.nodePublicKey = "0x" + this.nodePublicKey;
      }

      if (
        this.nodePrivateKey.indexOf("0x") === 0 &&
        this.nodePrivateKey.length !== 66
      ) {
        this.info("error", this.$t("errPrivatekey"));
        return;
      }
      if (
        this.nodePrivateKey.indexOf("0x") !== 0 &&
        this.nodePrivateKey.length !== 64
      ) {
        this.info("error", this.$t("errPrivatekey"));
        return;
      }
      if (this.nodePrivateKey.indexOf("0x") !== 0) {
        this.nodePrivateKey = "0x" + this.nodePrivateKey;
      }

      if (
        isNaN(this.commission) ||
        Math.floor(this.commission) !== this.commission ||
        this.commission !== 15
      ) {
        this.info("error", this.$t("errCommission"));
        return;
      }
      if (isNaN(this.limit) || this.limit <= 0) {
        this.info("error", this.$t("errLimit"));
        return;
      }
      if (isNaN(this.price) || this.price < 0) {
        this.info("error", this.$t("errPrice"));
        return;
      }

      if (this.price < 0.0000005) {
        this.price = '0.0000005'
      }

      if (this.limit < 21000) {
        this.info("error", this.$t("errLimitLess"));
        return;
      }

      if (this.price > 0.000005) {
        this.info("error", this.$t("errPriceBig"));
        return;
      }
      
      let send = RPC(Url);

      let contractMethod = neatioapi.abi.methodID("Register", [
        "bytes",
        "bytes",
        "uint8",
      ]);

      let signature = await send("neat_signAddress", [
        this.address,
        this.nodePrivateKey,
      ]);
      

      let data = neatioapi.abi.encodeParams(
        ["bytes", "bytes", "uint8"],
        [this.nodePublicKey, signature, this.commission]
      );


      const params = [
        {
          from: this.address,
          to: "0x0000000000000000000000000000000000000505",
          gas: Utils.toHex(this.limit),
          gasPrice: this.price,
          value: Utils.toHex(Utils.fromNEAT(this.amount)),
          data: contractMethod + data.substring(2)
        },
      ];

      ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((result) => {
          console.log('hash', result);
          this.$alert(result, "Validator successfully registered!", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });

          setTimeout(() => {
            this.getBalance();
          }, 2000)
        })
        .catch((error) => {
          console.log('tx error', error)
        });
    },
    // UNREGISTER
    async unRegister() {
        let contractMethod = neatioapi.abi.methodID("UnRegister", []);
              const params = [
        {
          from: this.address,
          to: "0x0000000000000000000000000000000000000505",
          gas: Utils.toHex(this.limit),
          gasPrice: Utils.toHex(Utils.fromNEAT(this.price)),
          value: "0x0",
          data: contractMethod
        },
      ];

      ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((result) => {
          console.log('hash', result);
          this.$alert(result, "Validator successfully unregistered!", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });

          setTimeout(() => {
            this.getBalance();
          }, 4000)
        })
        .catch((error) => {
          console.log('tx error', error)
        });

    }   
       
  },
};
</script>

<style scoped>

button {
	border: none;
   min-width: 40px;
	font-family: Arial, Helvetica, sans-serif;
	text-transform: uppercase;
	cursor: pointer;
	color: #00ffff;
	box-shadow: inset 0 0 0.1em #00ffff, 0 0 0.1em #00ffff;
	border: #00ffff solid 1px;
	background-color: #24292f;
  border-radius: 4px;
	outline: none;
  margin: 0px 0px 0px 60px;
  }
  
.info {
  display: inline-block;
  margin-left: 10px;
  margin-top: 50px;
}

.address-title {
  margin-bottom:5px;
 
  margin-top:10px;
  width: 420px
}

.wallet-address {
  margin-bottom:5px;
  margin-left: 108px;
  margin-top:10px;
  width: 420px
}

.inputs {
    background-color: #000;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%; 
}

.wallet-balance-available {
  margin-bottom:5px;
}

.balance-details {
  margin-left: 120px;
  margin-top:10px;
}
 .dashboard{
    font-size:24px;
    font-weight:500;
    color: #00ffff;
    padding: 60px;  
    
 }


.rippleClaim {
  font-size: 12px;
  min-width: 100px;
	background-position: center;
	transition: background 0.4s;
  float: right;
 
  }

  .rippleClaim:hover {
  color: #000;  
	text-transform: uppercase;
	background: #00ffff radial-gradient(circle, transparent 1%, #00ffff 1%) 
	center/15000%; 
  }

  .ripple:active {
	background-color: #00ffff;
	background-size: 100%;
	transition: background 0s;
  }

  .rippleUnreg {
  font-size: 12px;
  min-width: 100px;
  color: #00ffff;
	background-position: center;
	transition: background 0.4s;
  float: right;
 
  }

  .rippleUnreg:hover {
  color: #fff;  
	text-transform: uppercase;
	background: red radial-gradient(circle, transparent 1%, red 1%) 
	center/15000%; 
  }

  .ripple:active {
	background-color: red;
	background-size: 100%;
	transition: background 0s;
  }


 .not-connected {
    font-size:16px;
    font-weight:240;
    color: #00ffff;
    margin: auto;
    color: #a6ff33;


 }
.neatio {
  display: inline-block;
  font-size: 18px;
  vertical-align: 5px;
}
.item {
  width: 540px;
  display: inline-block;
  vertical-align: top;
  height: 118px;
}
.gt {
  width: 280px;
  height: 44px;
  margin-left: 450px;
  margin-top: 50px;
  color: #000;
}

.button {
  color:#000;
  text-align: center;
   width: 50%;
  margin: 0 auto;

}

.btn {
  display: flex;
}
    #gtButton {
      width: 240px;
      height: 40px;
      color: #000000;
      border: 1px solid #000;
      border-radius: 4px;
      background-color: #00ffff;
      font-size: 16px;
      cursor: pointer;
      margin: 0 auto;
      margin-top: 50px;
    }

    #gtButton:hover {
      background-color: #a6ff33;
    }

</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

