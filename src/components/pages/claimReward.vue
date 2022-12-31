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

        <div class="not-connected" v-show="address == ''">
           Please Unlock Your MetaMask wallet!
           </div>
         <div class="wallet-address" v-show="address != ''">
              <span style="color:lightgrey" > Unclaimed rewards:</span> 
               <div class="rewards-title" v-show="address != ''">
              {{rewards}}
              </div>
          </div>


      </div>


    
      <div class="box2">
        <div style="margin: 48px 0 0 108px">
            <!-- ADDRESS -->     

          <div class="item2">
            <p style="font-size:14px;">Amount To Be Claimed</p>
            <input class="inputs"
              style="width: 420px;background-color:#000"
              v-model="amount"
              placeholder="Amount"
            >
          </div>
        </div>
 
        <div class="btn">
          <button id="gtButton" @click="claimReward">{{ "LET'S CLAIM" }}</button>
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


    // CLAIM
    claimReward() {
      if (isNaN(this.amount)) {
        this.info("error", this.$t("rewardNumber"));
        return;
      }
      if (+this.amount <= 0) {
        this.info("error", this.$t("rewardGt"));
        return;
      }

     let gasFee = new BigNumber(this.price).multipliedBy(new BigNumber(this.limit));
      if (new BigNumber(gasFee).gt(new BigNumber(this.balance))) {
        this.info("error", this.$t("notEnough"));
        return;
      }


      let contractMethod = neatioapi.abi.methodID("WithdrawReward", [
        "address",
        "uint256"
      ]);

      let data = neatioapi.abi.encodeParams(
        ["address", "uint256"],
        [this.address, new BigNumber(this.amount).multipliedBy(Math.pow(10, 18))]
      );


      const params = [
        {
          from: this.address,
          to: "0x0000000000000000000000000000000000000505",
          gas: Utils.toHex(this.limit),
          gasPrice: Utils.toHex(Utils.fromNEAT(this.price)),
          value: "0x0",
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
          this.$alert(result, "Claim was successful!", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });

          setTimeout(() => {
            this.getBalance();
            this.getFullBalance();
          }, 4000)
        })
        .catch((error) => {
          console.log('tx error', error)
        });
    },

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
	color: #00BFFF;
	box-shadow: inset 0 0 0.1em #00BFFF, 0 0 0.1em #00BFFF;
	border: #00BFFF solid 1px;
	background-color: #24292f;
  border-radius: 4px;
	outline: none;
  margin: 0px 0px 0px 20px;
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

.rewards-title {
  margin-bottom:5px;
  color:#a6ff33;
  margin-top:10px;
  width: 420px
}

.wallet-address {
  margin-bottom:5px;
  margin-left: 148px;
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
    color: #00bfFf;
    padding: 80px;  
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
	background: #00BFFF radial-gradient(circle, transparent 1%, #00BFFF 1%) 
	center/15000%; 
  }

  .ripple:active {
	background-color: #00BFFF;
	background-size: 100%;
	transition: background 0s;
  }

  .rippleUnreg {
  font-size: 12px;
  min-width: 100px;
  color: #00bfff;
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
    color: #00bfFf;
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

.item2 {
  width: 540px;
  /* display: inline-block; */
  vertical-align: top;
  height: 118px;
  margin: 0 auto;
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
      background-color: #00bfff;
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

