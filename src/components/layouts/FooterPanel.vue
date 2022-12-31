<template>
  <div class="footer-panel">
    <div class="footer-box">
      <div class="t-and-c">   <a
                  href="https://neatio.net/pages/terms.html"
                  target="_blank"
                  rel="noopener"
                  ><span style="color:#ddd">Terms</span></a> © 2022 Neatio</div>

      <div class="social">
        <ul>
              <!-- DISCORD -->
              <li class="">
                <a
                  href="http://discord.neatio.net"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/dd-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- TELEGRAM -->
              <li class="">
                <a
                  href="https://t.me/neat_io"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/tg-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- TWITTER -->
              <li class="">
                <a
                  href="https://twitter.com/neat_io"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/tw-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- FACEBOOK -->
              <li class="">
                <a
                  href="https://www.facebook.com/NeatioNet"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/fb-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- REDDIT -->
              <li class="">
                <a
                  href="https://www.reddit.com/r/neatio/"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/rd-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- BITCOINTALK -->
              <li class="">
                <a href="https://bitcointalk.org/index.php?topic=5377414" 
                target="_blank" 
                rel="noopener"
                  ><img
                    src="../../assets/images/social/bt-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              <!-- GITHUB -->
              <li class="">
                <a
                  href="https://github.com/neatlab/neatio"
                  target="_blank"
                  rel="noopener"
                  ><img
                    src="../../assets/images/social/gh-icon.png"
                    alt=""
                    width="24"
                /></a>
              </li>

              



            </ul>
      </div>
      <div class="contact">contact@neatio.net</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FooterPanel'
  }
</script>

<style lang="scss">
  .footer-panel {
    height: 80px;
    color: #FFFFFF;
    background-color: #24292f; 
  }
.footer-box {
  width: 1200px;
      display: flex;
 justify-content: center;
 margin: 0 auto;
}

  .t-and-c {
    text-align: left;
    display: inline-block;
    padding: 25px;
    color: #ddd
  }

.social {
  padding-right: 40px;
    ul {
    
      li {
        display: inline-block;
        margin-top:5px;
        margin-left:5px;
        margin-right:5px;
      }
    }
}
 
 
  .contact {
    text-align: right;
    display: inline-block;
    padding: 25px;
    color:#ddd;
  }


</style>

