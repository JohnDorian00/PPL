<template>
    <div>
      <JqxGrid></JqxGrid>
    </div>
</template>

<script>
    import Columns from "@/IERT/vue/tabel/flex-collum";
    import Rows from "@/IERT/vue/tabel/flex-row";
    import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
    import JqxButton from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
    import JqxDockPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxdockpanel";
    import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel";
    import appConfig from "@/IERT/js/appConfig";
    import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid";

    export default {
      components: {
        Columns,
        Rows,
        JqxWindow,
        JqxButton,
        JqxDockPanel,
        JqxPanel,
        JqxGrid
      },
      name: "AddStationTableStations",
      props: ["id", "title", "closeWindows", "state"],
      data() {
        return {
          theme: appConfig.windowsTheme,
          dragArea: {
            left: 0,
            top: 32,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 75
          },

          height: {contentHeight: 660},
          rows: [{
            id: 1,
            flex: true,
            flexSize: 1,
            data: "<div style='width: 100%; height: 100%; border: 1px solid black; box-sizing:border-box;'>asd</div>",
            componentName: ""
          }, {
            id: 2,
            flex: true,
            flexSize: 2,
            data: "<div style='width: 100%; height: 100%; border: 1px solid black; box-sizing:border-box;'>dsad</div>",
            componentName: "AddStationTableStations"
          }]
        }
      },
    }
</script>

<style scoped>

</style>
