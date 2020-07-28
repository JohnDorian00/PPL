<template>
  <div style=" background-color: #DAE7F6;">
    <JqxPopover :showCloseButton="true" :title="type" :position="'right'" :selector="'.pop-button'" :theme="theme"
                :arrowOffsetValue="50" :offset="{ left: left, top: top }" ref="Popover">
      <div ref="PopoverContent"></div>
    </JqxPopover>
    <div style="width: 30px; height: 30px; display: block;"></div>
    <div style="width: 30px; height: 30px;  display: block;" class="image-button pop-button" @click="renderMenuParameters"
         ref="renderMenuParametersButton">
      <div
        style="width: 30px; height: 30px; background-image: url(src/public/img/gear_view.png); background-repeat: no-repeat; background-position: center;"></div>
    </div>
    <div style="width: 30px; height: 30px;  display: block;" class="image-button pop-button">
      <div
        style="width: 30px; height: 30px; background-image: url(src/public/img/gear_view.png); background-repeat: no-repeat; background-position: center;"></div>
    </div>
    <div style="width: 30px; height: 30px;  display: block;" class="image-button pop-button">
      <div
        style="width: 30px; height: 30px; background-image: url(src/public/img/gear_view.png); background-repeat: no-repeat; background-position: center;"></div>
    </div>
    <div style="width: 30px; height: 30px;  display: block;" class="image-button pop-button">
      <div
        style="width: 30px; height: 30px; background-image: url(src/public/img/gear_view.png); background-repeat: no-repeat; background-position: center;"></div>
    </div>
  </div>
</template>

<script>

  import appConfig from '@/IERT/js/appConfig';
  import JqxPopover from '@/jqwidgets/jqwidgets-vue/vue_jqxpopover.vue';

  export default {
    name: "SelectorPanelVariantWindows",
    components: {
      JqxPopover
    },
    data() {
      return {
        theme: appConfig.theme,
        type: 'none',
        left: "1px",
        top: "1px"
      }
    },
    methods: {
      updateContentType: function () {

      },
      renderMenuParameters: function () {
        this.$refs.PopoverContent.innerHTML += "Test"
        this.left = this.$refs.renderMenuParametersButton.offsetLeft + "px";
        this.top = this.$refs.renderMenuParametersButton.offsetTop + "px";
      }
    }

  }
</script>

<style scoped>
  .image-button {
    background-color: #DAE7F6;
    cursor: pointer;
  }

  .pop-button {}

  .image-button:hover {
    background-color: #feffff;
    border-radius: 10px;
  }
</style>
