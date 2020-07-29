<template>
  <div style="width: 100%; height: 100%; white-space:nowrap; position: relative">

    <div style="display: inline-block; width: 200px; height: 100%; position: relative">
      <JqxGrid   style="position:relative;" ref="myGrid" :height="'100%'" :width="'100%'"
                 :columnsmenu="false"  :pageable="false" :autoheight="false"
                 :columnsresize="true"
                 :sortable="true" :altrows="true"
                 :enabletooltip="true" :columnsautoresize="true" :editable="false" :selectionmode="'singlerow'"
                 :theme="theme" :filterable="true" :filtermode="'excel'" :sortmode="'columns'" :showfilterrow="true">
      </JqxGrid>
    </div>

    <div style="display: inline-block; width: calc(100% - 200px - 10px); height: 100%; position: relative; float: right; ">
      <JqxGrid v-if="isLoaded" style="position:relative; border: none;" ref="stationGrid" :height="'100%'" :width="'100%'"
               :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
               :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
               :enabletooltip="true" :columnsautoresize="false" :editable="false"
               :selectionmode="'singlerow'" :source="stationsSource"
               :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
               @rowselect="onRowselect" @preAddStation="addStation"
      >
      </JqxGrid>
    </div>

  </div>

</template>

<script>
  import appConfig from "@/IERT/js/appConfig";
  import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
  import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
  import JqxDockPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxdockpanel.vue";
  import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel.vue";
  import Rows from "@/IERT/vue/tabel/flex-row";
  import Columns from "@/IERT/vue/tabel/flex-collum";
  import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid";

  export default {
    components: {
      Columns,
      Rows,
      JqxWindow,
      JqxButton,
      JqxDockPanel,
      JqxPanel,
      JqxGrid,

    },
    name: "AddStationContent",
    props: ["id", "title", "closeWindows", "state", "userData"],
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
          // componentName: ""
        }, {
          id: 2,
          flex: true,
          flexSize: 2,
          data: "<div style='width: 100%; height: 100%; border: 1px solid black; box-sizing:border-box;'>dsa</div>",
          // componentName: "AddStationTableStations"
        }],

        stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),

        isLoaded : true,

        stationsColumns: [
          {text: 'Код станции', datafield: 'esr'},
          {text: 'Наименование', datafield: 'name'},
        ],

        selectedRow : null,

        station: null,
      }
    },

    beforeCreate() {
      this.stationsSource = {
        datatype: 'json',
      }
    },

    created() {
      this.stationsSource = {
        datafields : [
          {name: 'esr', type: 'string'},
          {name: 'name', type: 'string'},
        ],
        localdata : this.userData.stations
      }
      window.addEventListener('resize', this.updateSizeWindows);
      setTimeout(this.updateSizeWindows, 200);
    },

    mounted() {

    },

    destroyed() {
      window.removeEventListener('resize', this.updateSizeWindows)
    },
    methods: {
      addStation() {
        console.log(1234);
        this.$emit('addStation', this.station)
      },

      updateSizeWindows: function () {
        this.dragArea = {
          left: 0,
          top: 32,
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight - 75
        };
      },

      updateSizeContent: function () {
        this.height.contentHeight = (this.$refs.MainContent.clientHeight - 140) + 'px';
        this.height.contentHeight = (this.$refs.MainContent.clientWidth - 140) + 'px';
        this.$refs.columns.updateWidth();
      },

      initContent: function () {
        this.updateSizeContent();
      },

      onRowselect($event) {
        this.selectedRow = $event.args.row;
        this.station = this.userData.stations[this.selectedRow.boundindex];
      },
    }
  }
</script>

<style scoped lang="scss">
  $border-color: #99bce8;
  $background-color: #DAE7F6;
  $color-head: #04408C;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  .background-color {
    color: #04408C;
    text-shadow: none;
    border-color: $border-color;
    background-color: $background-color;
  }

  .main-content {
    color: black;
    text-shadow: none;
    border-color: $border-color;
    display: table;
    background-color: white;
    height: 100%;
    width: 100%;
  }

  .img-24-style {
    cursor: pointer;
    height: 24px;
    width: 24px;
  }

  .flex-css {
    -js-display: flex;
    display: flex;
  }

  .flex-row-css {
    -js-display: flex;
    display: flex;
    -js-flex-direction: row;
    flex-direction: row;
  }

  .flex-coll-css {
    -js-display: flex;
    display: flex;
    -js-flex-direction: column;
    flex-direction: column;
  }

  .flex-1-1-1 {
    flex: 1 1 1px;
    -js-flex: 1 1 1px;
  }

  .triangle {
    border: 30px solid transparent;
    border-bottom: 30px solid $background-color;
    border-left: 30px solid $background-color;
    height: 0;
    width: 0;
  }

  .triangle-15 {
    border: 15px solid transparent;
    border-bottom: 15px solid $background-color;
    border-left: 15px solid $background-color;
    height: 0;
    width: 0;
  }
</style>
