<template>
  <div class="main">
    <div v-if="step == 1">
      <div class="bg-box">
        <img
          style="margin-top: -80px; width: 100%"
          src="../../assets/backgroud.jpg"
          alt
        />
      </div>
      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step == 2" style="padding-bottom: 90px">
      <div class="bg-box">
        <img
          style="margin-top: -80px; width: 100%"
          src="../../assets/backgroud.jpg"
          alt
        />
      </div>
      <div class="box">
        <div style="margin: 48px 0 0 108px">
          <div class="item">
            <p style="font-size: 14px">{{ $t("yAddr") }}</p>
            <el-input
              style="width: 420px"
              disabled
              v-model="address"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">NEAT {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              disabled
              v-model="balance"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("contract") }}</p>
            <el-select
              style="width: 420px"
              v-model="selectContract"
              :placeholder="$t('pleaseSelectContract')"
              value-key="contractAddress"
            >
              <el-option
                v-for="item in contracts"
                :key="item.contract_address"
                :value="item"
                :label="item.contract_address"
              >
                <span style="float: left">{{ item.contract_address }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.amount
                }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="item">
            <p style="font-size: 14px">Token {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              :placeholder="$t('pleaseSelectContract')"
              disabled
              v-model="selectContract.amount"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("toAddr") }}</p>
            <el-input
              style="width: 420px"
              v-model="toAddress"
              :placeholder="$t('toAddr')"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{ $t("amount") }}</p>
            <el-input
              style="width: 420px"
              v-model="amount"
              :placeholder="$t('amount')"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">Gas Limit</p>
            <el-input
              style="width: 420px"
              v-model="limit"
              placeholder="Gas Limit"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">Gas Price</p>
            <el-input
              style="width: 420px"
              v-model="price"
              placeholder="Gas Price"
            ></el-input>
          </div>

        </div>
        <el-button @click="sendTx" class="gt" type="danger">{{
          $t("gt")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import BigNumber from "bignumber.js";
import neatapi from "neatioapi";
const Utils = neatapi.utils;
export default {
  data() {
    return {
      step: 2,
      balance: 0,
      address: "",
      privateKey: "",
      contracts: [],
      selectContract: "",
      toAddress: "",
      amount: "",
      limit: "100000",
      price: "",
    };
  },
  components: {
    Access,
    EyeInput,
  },
  created() {
    this.getGasPrice();
  },
  mounted() {
    this.collectAccount();
  },
  methods: {
    async collectAccount () {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        this.address = accounts[0];
        this.getBalance();
        this.getGasPrice();
      } catch (e) {
        console.log('request accounts error:', e);
        this.info("error", this.$t("reqeustAccountsError"));
      }
    },

    getBalance () {
      ethereum
        .request({
          method: 'eth_getBalance',
          params: [this.address]
        })
        .then( (result) => {
            console.log('balance', result);
            this.balance = Utils.toNEAT(result)
          }
        )
        .catch( (error) => {
            console.log('error', error)
          }

        )

    },

    getGasPrice() {
      ethereum
        .request({
          method: 'eth_gasPrice',
          params: []
        })
        .then((result) => {
            console.log('gasprice', result);
            this.price = Utils.toNEAT(result);
          }
        )
        .catch((error) => {
            console.log('error', error)
          }

        )
    },

    unlock(account) {
      this.step = 2;
      this.address = account.address;
      this.privateKey = account.privateKey;
      this.step = 2;
      axios.post(this.address).then((res) => {
        this.balance = new BigNumber(parseInt(res.balance, 16))
          .dividedBy(Math.pow(10, 18))
          .toString();
      });
      axios
        .get("/api/account/contracts", { params: { address: this.address } })
        .then((res) => {
          this.contracts = res.data;
          if (this.selectContract) {
            for (let c of this.contracts) {
              if (c.contract_address == this.selectContract.contract_address) {
                this.selectContract = c;
              }
            }
          }
        });
    },
    sendTx() {
      if (!this.selectContract || !this.selectContract.contract_address) {
        this.info("error", this.$t("pleaseSelectContract"));
        return;
      }
      if (!neatapi.utils.isAddress(this.toAddress)) {
        this.info("error", this.$t("errAddr"));
        return;
      }
      if (isNaN(this.amount) || this.amount <= 0) {
        this.info("error", this.$t("errAmount"));
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

      if (this.limit < 21000) {
        this.info("error", this.$t("errLimitLess"));
        return;
      }

      if (this.price > 0.0005) {
        this.info("error", this.$t("errPriceBig"));
        return;
      }

      if (this.selectContract.amount < this.amount) {
        this.info("error", this.$t("contractNotEnough"));
        return;
      }
      let data = neatapi.abi.encodeParams(
        ["address", "uint256"],
        [
          this.toAddress,
          new BigNumber(
            Math.round(
              this.amount * Math.pow(10, this.selectContract.decimals)
            )
          ),
        ]
      );
      let contractMethod = neatapi.abi.methodID("transfer", ["address", "uint256"]);
      rpc
        .sendSignTx({
          gasPrice: this.price,
          gas: this.limit,
          to: this.selectContract.contract_address,
          value: 0,
          account: { address: this.address, privateKey: this.privateKey },
          data: contractMethod + data.substring(2),
        })
        .then((res) => {
          this.$alert("hash:" + res, "success", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });
          let timer = setTimeout(() => {
            this.unlock({ address: this.address, privateKey: this.privateKey });
            clearTimeout(timer);
          }, 10000);
        });
    },
  },
};
</script>

<style scoped>
.info {
  display: inline-block;
  margin-left: 10px;
  margin-top: 50px;
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
}
</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

