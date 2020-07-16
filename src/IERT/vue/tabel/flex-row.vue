<template>
  <div style="height: 100%; width: 100%;" ref="main">
    <div v-for="row in rowsHeight" v-bind:key="row.id" style="width: 100%;" v-bind:style="{ height: row.height + 'px'} "
         v-html="row.data"></div>
  </div>
</template>

<script>
  export default {
    name: "rows",
    props: ["rowsProps"],
    data() {
      return {
        isResize: false,
        updateTimeoutId: undefined,
        rows: [],
        rowsHeight: []
      }
    },
    methods: {
      updateHeight: function () {
        let heightFree = this.$refs.main.clientHeight,
          staticElements = this.rowsHeight.filter(element => element.static === true),
          freeSizeElements = this.rowsHeight.filter(element => element.flex === true)
        staticElements.forEach(function (value) {
          heightFree = heightFree - value.height;
          value.height = parseInt(value.height.toString())
        })
        let size = 0;
        freeSizeElements.forEach(function (value) {
          size = size + parseInt(value.flexSize);
        })
        let onePart = heightFree / size;
        freeSizeElements.forEach(function (value) {
          value.height = parseInt(onePart * value.flexSize)
          heightFree = heightFree - value.height;
        })
        this.rowsHeight = staticElements.concat(freeSizeElements).sort((a, b) => {
          return (1 - 2 * (a.id < b.id))
        });
      }
    },
    mounted() {
      for (let g = 0; g < this.rowsProps.length; g++) {
        this.rowsHeight[g] = {
          id: this.rowsProps[g].id,
          static: this.rowsProps[g].static,
          flex: this.rowsProps[g].flex,
          height: this.rowsProps[g].height,
          data: this.rowsProps[g].data,
          flexSize: this.rowsProps[g].flexSize
        }
      }
      this.updateHeight();
    },
    destroyed() {
    }
  }
</script>
