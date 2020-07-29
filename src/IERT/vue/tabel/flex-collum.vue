<template>
  <div style="height: 100%; width: 100%;" ref="main">
    <div v-for="row in rowsWidth" v-bind:key="row.id" style="height: 100%; display: inline-block;"
         v-bind:style="{ width: row.width + 'px'}" v-if="row.width !== 0">
      <div v-bind:key="row.id" style="height: 100%;" v-bind:style="{ width: row.width + 'px'} "
           v-html="row.data" v-if="(row.componentName === undefined)"></div>
      <component style="width: 100%; height: 100%;" v-if="(row.componentName !== undefined)"
                 v-bind:is="row.componentName" v-bind:key="row.id"></component>
    </div>
  </div>
</template>

<script>
  // import LeftPanelVariantWindows from '@/IERT/vue/windows/VariantWindows/component/LeftPanel';
  // import SelectorPanelVariantWindows from '@/IERT/vue/windows/VariantWindows/component/SelectotorPanel';
  import AddStationTableStations from "@/IERT/vue/windows/AddStation/components/AddStationTableStations";

  export default {
    components: {
      AddStationTableStations
    },
    name: "columns",
    props: ["rowsProps"],
    data() {
      return {
        isResize: false,
        updateTimeoutId: undefined,
        rows: [],
        rowsWidth: []
      }
    },
    methods: {
      updateWidth: function () {
        let widthFree = this.$refs.main.clientWidth,
          staticElements = this.rowsWidth.filter(element => element.static === true),
          freeSizeElements = this.rowsWidth.filter(element => element.flex === true)
        staticElements.forEach(function (value) {
          widthFree = widthFree - value.width;
          value.width = parseInt(value.width.toString())
        })
        let size = 0;
        freeSizeElements.forEach(function (value) {
          size = size + parseInt(value.flexSize);
        })
        let onePart = widthFree / size;
        freeSizeElements.forEach(function (value) {
          value.width = onePart * value.flexSize
          widthFree = widthFree - value.width;
        })
        this.rowsWidth = staticElements.concat(freeSizeElements).sort((a, b) => {
          return (1 - 2 * (a.id < b.id))
        });
      }
    },
    mounted() {
      for (let g = 0; g < this.rowsProps.length; g++) {
        this.rowsWidth[g] = {
          id: this.rowsProps[g].id,
          static: this.rowsProps[g].static,
          flex: this.rowsProps[g].flex,
          width: parseInt(this.rowsProps[g].width),
          data: this.rowsProps[g].data,
          flexSize: parseInt(this.rowsProps[g].flexSize),
          componentName: (this.rowsProps[g].componentName) ? this.rowsProps[g].componentName : undefined,
          options: (this.rowsProps[g].options) ? this.rowsProps[g].options : {}
        }
      }
      this.updateWidth();
    },
    destroyed() {
    }
  }
</script>
