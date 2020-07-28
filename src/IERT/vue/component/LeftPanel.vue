<template>
  <div style="width: 100%; height: 100%;">
    <columns :rowsProps="rows"></columns>
  </div>
</template>

<script>

  export default {
    name: "LeftPanelVariantWindows",
    data() {
      return {
        rows: [{
          id: 1,
          static: true,
          width: 30,
          componentName: 'SelectorPanelVariantWindows'
        }, {
          id: 2,
          static: true,
          width: 30,
          data: " <div style='border: 15px solid transparent; border-bottom: 15px solid #DAE7F6; border-left: 15px solid #DAE7F6; height: 100%; box-sizing:border-box; margin-top: 30px;'></div>"
        }]
      }
    }
  }
</script>

<style scoped>

</style>
