<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@font-face {
  font-family: "Pirulen";
  src: local("Pirulen"),
   url(./fonts/pirulen.ttf) format("truetype");

} 

@font-face {
  font-family: "Alien";
  src: local("Alien"),
   url(./fonts/alien.ttf) format("truetype");

} 

@font-face {
  font-family: "Computer";
  src: local("Computer"),
   url(./fonts/cmunbbx.ttf) format("truetype");

} 

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00ffff;
  min-width: 1200px;
  font-family: Computer;
}
.main {
  /* background-image:  url('assets/hero-bk.jpg'); #24243e, #302b63, #24243e*/
  /* background-blend-mode: multiply; */
  background: linear-gradient(to left, #24243e, #302b63, #24243e);
  /* background-color: #2c3e50; */
  background-size: cover;

}

.boxe {
  margin: 60px;
}
.box1 {
  width: 1200px;
  height: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  border-width: 1px;
  background: transparent;
  display: flex;
  border-radius: 10px;
  margin: 0px auto 0px auto;
  position: relative;
  text-align: left;
  box-sizing: 1px;
  border: none;
  box-shadow: 0 0 60px #000;
  
}

.box2 {
  width: 1200px;
  height: auto;
  padding-bottom: 50px;
  border-style: solid;
  border-width: 1px;
  background: transparent;
  margin: 0px auto 0px auto;
  position: relative;
  text-align: left;
  box-sizing: 1px;
  border: none;
  box-shadow: 0 0 60px #000;
  border-radius: 10px;
}


.aw {
  color: rgba(102, 102, 102, 1);
  font-size: 34px;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #00ffff;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #00ffff;
  background: #00ffff;
}
.el-radio__inner:hover {
  border: 1px solid #00ffff;
}
.sk {
  color: rgba(102, 102, 102, 1);
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
}
.skbtn {
  width: 416px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid #ddd;
  line-height: 50px;
  cursor: pointer;
  color: #ddd;
  text-align: center;
  font-size: 14px;
}



.bg-box {
  overflow: hidden;
  height: 188px;
  width: 100%;
}
.el-input__inner {
  background-color: #000;
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: #00ffff;
}
.el-select .el-input__inner:focus {
  border-color: #00ffff;
}
.el-select-dropdown__item.selected {
  color: #00ffff;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: #00ffff;
}
</style>
