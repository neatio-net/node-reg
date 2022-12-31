<template>
  <div class="nav-container">
    <div class="nav-panel">
      <router-link tag="div" to="/" class="common-inline-block ii">
        <img
          src="../../assets/logo-transparent.png"
          alt="neatio logo"
          class="nav-logo logo-neatio common-inline-block"
        />
      </router-link>
      <div class="common-inline-block ic" style="">
        <router-link
          to="/"
          id="home"
          :class="{ 'nav-active': $route.path === '/' }"
          class="pgy"
          >{{ $t("walletInfo") }}</router-link
        >

        <div class="connBtn">
          <button id="connectButton" @click=switchToEtheruemChain> <div class="conColor2">{{address}}</div> </button>
        </div>
   
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MetaMaskOnboarding from '@metamask/onboarding';

export default {
  name: "NavPanel",
  data() {
    return {
      curNav: "Home",
      searchContent: "",
      otherSearch: "",
      currentChainId: '',
      chainId: '0x203',
      testChainId: '0x20d',
      address: '',
      blockchainList: [
        {
          name: this.$t("nav.blockchain.block"),
          url: "/blockchain/blocklist/1",
        },
        {
          name: this.$t("nav.blockchain.transaction"),
          url: "/blockchain/txlist/1",
        },
        {
          name: this.$t("nav.blockchain.token"),
          url: "/blockchain/tokenlist/1",
        },
        {
          name: this.$t("nav.blockchain.account"),
          url: "/blockchain/accountlist/1",
        },
        {
          name: this.$t("nav.blockchain.referendum"),
          url: "/referendum",
        },
      ],
      guidelist: [
        { name: this.$t("nav.enVersion"), url: "/static/help/en.pdf" },
        {
          name: this.$t("nav.cnVersion"),
          url: "/static/help/cn.pdf",
        },
      ],
      isTestNetwork: true,
    };
  },
  created() {
    this.getLocaction();
  },
  mounted() {
    this.initialize();
  },
  methods: {
    hh() {
      console.log(this);
    },
    strTrim(str) {
      str = str + "";
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    highlight(index) {
      this.curNav = index;
    },

    getLocaction() {
      this.isTestNetwork = window.location.hostname.substr(0, 4) === "test" || window.location.hostname.substr(0, 4) === "loca";
    },

    async initialize () {
      this.currentChainId = await ethereum.request({ method: 'eth_chainId' });

      ethereum.on('chainChanged', (_chainId) => {
        this.connectAccount(_chainId)
      });

      ethereum.on('accountsChanged', (_accounts) => {
        this.requestAccount()
      });

      this.requestAccount();
    },
    async requestAccount () {
      this.currentChainId = await ethereum.request({ method: 'eth_chainId' });
      try {
        if (this.currentChainId !== this.chainId) {
          this.connectAccount();
        } else {
          
          this.address = `⦿ Neatio Mainnet`
        }

      } catch (e) {
        console.log('request accounts error:', e);
      }
    },
    async connectAccount () {
      try {
        if (this.currentChainId !== this.chainId) {
          this.address = this.$t('wrongNetwork');
        }else {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          this.address = `${accounts[0].substr(0, 6)}...${accounts[0].slice(-4)}`;
        }
      } catch (e) {
        console.log('request accounts error:', e);
      }
    },
        async switchToEtheruemChain () {
          let chainIds = '0x203';
          let rpc = 'https://rpc.neatio.net';
          let browser = 'https://scan.neatio.net';
          let chainName = 'Neatio Mainnet';

          try {
            this.currentChainId = await ethereum.request({ method: 'eth_chainId' });
            if (this.currentChainId === chainIds) {
              window.alert("Neatio Network has been added to Metamask.")
            }

            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainIds}]
            })

          } catch (e) {
            if (e.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: chainIds,
                    chainName: chainName,
                    nativeCurrency: {
                      name: "NEAT",
                      symbol: "NEAT",
                      decimals: 18
                    },
                    rpcUrls: [rpc],
                    blockExplorerUrls: [browser]
                  }]
                })

                this.currentChainId = await ethereum.request({ method: 'eth_chainId' });
              } catch (e) {
                console.log('add network error', e)
              }
            }
          }
        },
  },
};
</script>

<style lang="scss">
.nav-container {
  box-shadow: 0px 4px 8px 0px rgba(230, 230, 230, 0.6);
  background-color: #24292f;
  height: auto;
  .nav-panel {
    text-align: left;
    box-sizing: border-box;
    width: 1200px;
    margin: 0 auto;
    .logo-neatio {
      width: 60px;
      height: auto;
      /*margin-top: 20px*/
    }
    .ii {
      vertical-align: middle;
    }
    .ic {
      margin-left: 10px;
      width: 1100px;
      & a {
        margin-right: 15px;
        color: #666666;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          color: #00bfff;
          transition: all .3s ease-in-out;
        }
        span {
          vertical-align: middle;
        }
      }
      .d-meun {
        margin-right: 15px;
        color: #666666;
        font-weight: 500;
        position: relative;
        line-height: 22px;

        .nav-icon {
          display: inline-block;
          font-weight: bold;
          margin-left: 5px;
          vertical-align: middle;
          transition: all .3s;
        }

        &:hover{
          .m-title {
            color: #00bfff;
          }
          .nav-icon {
            transform: rotate(180deg);
          }
          .menu-box {
            height: auto;
            padding: 10px 0;
          }
        }
        .menu-box {
          position: absolute;
          top: 22px;
          left: -20px;
          list-style: none;
          margin: 0;
          padding: 0;
          height: 0;
          overflow: hidden;
          /*width: 150px;*/
          background: #ffffff;
          box-shadow:0 0 8px 0 rgb(230,230,230);
          z-index: 100;
          transition: all .5s;
          .menu-item {
            height: 25px;
            line-height: 25px;
            padding: 5px 10px;
            font-size: 16px;
            & > a {
              display: inline-block;
              width: 100%;
              min-width: 125px;
            }
            &:hover {
              background-color: #f3f3f3;
              & > a {
                color: #00bfff;
              }
            }
          }
        }
      }
      .vg {
        position: relative;
        top: -2px;
        display: inline-block;
        height: 55px;
        &:hover > .chain-dropdown {
          display: block !important;
        }
        .chain-dropdown {
          position: absolute;
          width: 110px;
          top: 45px;
          box-shadow: 0px 6px 10px 0px #ccc;
          background-color: #000;
          padding: 10px 15px;
          left: -16px;
          font-size: 14px;
          display: none;
          z-index: 1000;
          .chain-dropdown-i {
            cursor: pointer;
          }
          .chain-dropdown-i:not(:first-child) {
            margin-top: 8px;
          }
          .chain-dropdown-i:hover {
            color: #00bfff;
          }
        }
        .triangle {
          display: inline-block;
          width: 0;
          height: 0;
          border-width: 7px 7px 0;
          border-style: solid;
          border-color: #999 transparent transparent;
          margin-left: 8px;
          vertical-align: middle;
        }
      }
      .nav-active {
        color: #00bfff;
      }
      .triangle-active {
        border-color: #00bfff transparent transparent !important;
      }
    }
    .help:hover {
      color: #00bfff;
      padding-bottom: 2px;
      border-bottom: 2px solid #00bfff;
    }
    .conColor1 {
      color:red;
    }
        .conColor2 {
      color: #a6ff33;
    }
    .iv {
      height: 52px;
      line-height: 52px;
      float: right;
      & input {
        width: 280px;
        box-sizing: border-box;
        height: 37px;
        padding-left: 10px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: 1px solid #ccc;
        border-right: none !important;
        outline: none;
        vertical-align: middle;
      }
      & span {
        display: inline-block;
        width: 53px;
        height: 37px;
        line-height: 3;
        background-color: #3a3cda;
        text-align: center;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
        vertical-align: middle;
      }
      .search-icon {
        background-size: cover;
        display: inline-block;
        width: 24px;
        height: 22px;
      }
    }

    #connectButton {
      width: 165px;
      height: 30px;
      color: #000000;
      border: 1px solid #000;
      border-radius: 4px;
      background-color: #000;
      font-size: 16px;
      cursor: pointer;
    }

    #connectButton:hover {
      background-color: #24292f;
    }
  }
}
.common-inline-block {
  display: inline-block;  
  cursor: pointer; 
}

.connBtn {
  float: right;
}


</style>
