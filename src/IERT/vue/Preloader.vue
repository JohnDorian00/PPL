<template>
  <div style="width: 100%; height: 100%; position: absolute;">
    <div id="app-content" style="width: 100%; height: 100%; position: fixed; z-index: 1; left: 0; top: 0;"></div>
    <div id="app-loader"
         style="width: 100%; height: 100%; position: fixed; z-index: 9999; left: 0; top: 0; background-color: #3272ca">
      <div style="height: 35%"></div>
      <div
        style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); width: 416px; height: 416px;">
        <p style="text-align: center; position: relative;">
          <img style="position: absolute; top:-50%; left:0;" width="416" height="416"
               src="src/public/img/icon_earth.png" class="logo-css-animation" alt="ИЭРТ"/>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Preloader",
  }
</script>

<style scoped>
  .logo-css-animation {
    animation: rotate-animate 3s infinite ease-in-out;
  }

  @keyframes rotate-animate {
    0% {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(360deg)
    }
  }
</style>
