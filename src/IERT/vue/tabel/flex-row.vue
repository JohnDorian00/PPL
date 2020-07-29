<template>
  <div style="height: 100%; width: 100%;" ref="main">
    <div v-for="row in rowsHeight" v-bind:key="row.id" style="width: 100%;"
         v-bind:style="{ height: row.height + 'px'}">
      <div v-bind:key="row.id" style="width: 100%;" v-bind:style="{ height: row.height + 'px'} "
           v-html="row.data" v-if="(row.componentName === undefined)"></div>
      <component style="height: 100%; width: 100%;" v-if="(row.componentName !== undefined)"
                 v-bind:is="row.componentName" v-bind="row" v-bind:data="row.data"
                 :userData="userData"></component>
    </div>
  </div>
</template>

<script>
  import JqxButton from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
  import AddStationLowerMenu from "@/IERT/vue/windows/AddStation/components/AddStationLowerMenu";
  import MainWindowContent from "@/IERT/vue/windows/MainWindow/components/MainWindowContent";
  import AddStationContent from "@/IERT/vue/windows/AddStation/components/AddStationContent";

  export default {
    name: "rows",
    props: ["rowsProps", "userData"],
    components: {
      JqxButton,
      AddStationLowerMenu,
      AddStationContent,
      MainWindowContent
    },
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
          value.height = onePart * value.flexSize
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
          height: parseInt(this.rowsProps[g].height),
          data: this.rowsProps[g].data,
          flexSize: parseInt(this.rowsProps[g].flexSize),
          componentName: (this.rowsProps[g].componentName) ? this.rowsProps[g].componentName : undefined,
          options: (this.rowsProps[g].options) ? this.rowsProps[g].options : {}
        }
      }
      this.updateHeight();
    }
  }
</script>
