<template>
  <transition appear name="fade">
    <JqxWindow ref="mainWin"
               :width="455"
               :height="431"
               :max-height="190000"
               :min-height="173"
               :max-width="190000"
               :min-width="242"
               :position="{ x: 40, y: 40 }"
               :title="title"
               :theme="theme"
               :id="modalId"
               :is-modal="true"
               :auto-open="false"
               :drag-area="dragArea">
      <div>
        Header
      </div>

      <div ref="MainContent">

        <JqxGrid style="position:relative; border: none;" ref="stationGrid" :height="'100%'"
                 :width="'100%'"
                 :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
                 :sortable="true" :altrows="true" :columnsresize="false" :showfilterrow="true"
                 :enabletooltip="true" :columnsautoresize="false" :editable="false"
                 :selectionmode="'singlerow'" :source="stationsSource"
                 :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                 @rowselect="onRowselect" :scrollbarsize="20"
        >
        </JqxGrid>

      </div>

    </JqxWindow>
  </transition>
</template>

<script>

import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
import Preloader from "@/IERT/vue/Preloader";
import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
import JqxInput from "@/jqwidgets/jqwidgets-vue/vue_jqxinput";
import JqxForm from "@/jqwidgets/jqwidgets-vue/vue_jqxform";


export default {
  components: {
    JqxWindow,
    JqxButton,
    JqxGrid,
    Preloader,
    JqxListBox,
    JqxInput,
    JqxForm
  },

  name: "AddStation",

  props: ["id", "parentWindow", "title", "locStations", "theme", "dragArea"],

  data() {
    return {
      modalId: "modal" + this.id,
      isLoaded: true,
      button_height: 30,
      listBoxSource: [0, 1, 2, 3, 4, 5, 6],

      elementSize: {
        mainContent: {width: 690, height: 659},
        rowsHeightHeader: {leftPanel: 35, mainContent: 645}
      },
      height: {contentHeight: 660},
      station: null,
      stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),

      stationsColumns: [
        {text: 'Код станции', datafield: 'esr'},
        {text: 'Наименование', datafield: 'name'},
      ],

      selectedRow: null,
      isOpenModal: true,

      state : true,

    }
  },

  methods: {
    addElem(row) {
      this.stationsSource.localdata.push(row);
      this.stationsSort();
    },

    delElem(args) {
      let index = args.rowindex;
      let deletedRow = this.stationsSource.localdata.splice(index, 1)[0];
      this.$emit("station-deleted", deletedRow);
      this.stationsSort();
      this.refreshGrid();
    },

    refreshGrid() {
      if (this.$refs.stationGrid) {
        this.stationsSource.localdata = this.locStations;
        this.stationsSort();
        this.$refs.stationGrid.updatebounddata('cells');
      }
    },

    showModal() {
      this.refreshGrid();
      this.$refs.mainWin.open();
    },

    hideModal() {
      this.$refs.mainWin.hide();
    },

    unselectGrid() {
      let t = this;
      setTimeout(function () {
        t.$refs.stationGrid.clearselection();
      }, 1)
    },

    onRowselect(e) {
      this.delElem(e.args);
      this.unselectGrid();
    },

    // Сортировка станций по имени по возрастанию
    stationsSort() {
      this.stationsSource.localdata.sort(function (a, b) {
        let nameA = a.name,
            nameB = b.name;

        if (nameA > nameB)
          return 1
        if (nameA < nameB) //сортируем строки по возрастанию
          return -1

        return 0 // Никакой сортировки
      })
    },
  },

  mounted() {
  },

  beforeCreate() {
    this.stationsSource = {
      datatype: 'json',
    }
  },

  created() {
    this.stationsSource = {
      datafields: [
        {name: 'esr', type: 'string'},
        {name: 'name', type: 'string'},
      ],
      localdata: this.locStations
    }
  },


}
</script>

<style scoped>

</style>

