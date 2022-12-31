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
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00bfff;
  min-width: 1200px;
  font-family: Helvetica;
}
.main {
  background-image:  url('assets/hero-bg-new.jpg');
  background-blend-mode: multiply;
  background-color: #2c3e50;
  background-size: cover;

}

.box1 {
  width: 1200px;
  height: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: azure;
  background: #000;
  display: flex;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0px auto 0px auto;
  position: relative;
  text-align: left;
}

.box2 {
  width: 1200px;
  height: auto;
  padding-bottom: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: azure;
  background: #191c20;
  margin: 0px auto 0px auto;
  position: relative;
  text-align: left;
}


.aw {
  color: rgba(102, 102, 102, 1);
  font-size: 34px;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #00bfff;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #00bfff;
  background: #00bfff;
}
.el-radio__inner:hover {
  border: 1px solid #00bfff;
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
  border-color: #00bfff;
}
.el-select .el-input__inner:focus {
  border-color: #00bfff;
}
.el-select-dropdown__item.selected {
  color: #00bfff;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: #00bfff;
}
</style>
