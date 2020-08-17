<template>
  <div>
    <JqxWindow ref="mainWin"
               :width="600"
               :height="500"
               :max-height="190000"
               :min-height="241"
               :max-width="190000"
               :min-width="455"
               :position="{ x: 40, y: 40 }"
               :title="title"
               :theme="theme"
               :id="modalId"
               :is-modal="true"
               :auto-open="false">
      <div>
        Header
      </div>

      <div ref="MainContent" style="width: 100%; height: 100%; position: absolute">
        <!--        white-space:nowrap;-->

        <div style="height: calc(100% - 100px);">

<!--          <div style="display: inline-block; width: 200px; height: 100%; position: relative">-->
<!--            <JqxGrid style="position:relative;" ref="myGrid" :height="'100%'" :width="'100%'"-->
<!--                     :columnsmenu="false" :pageable="false" :autoheight="false"-->
<!--                     :columnsresize="true"-->
<!--                     :sortable="true" :altrows="true"-->
<!--                     :enabletooltip="true" :columnsautoresize="true" :editable="false" :selectionmode="'singlerow'"-->
<!--                     :theme="theme" :filterable="true" :filtermode="'excel'" :sortmode="'columns'"-->
<!--                     :showfilterrow="true">-->
<!--            </JqxGrid>-->
<!--          </div>-->

          <div
              style="display: inline-block; width: calc(100% - 200px - 10px + 210px); height: 100%; position: relative; float: right; ">
            <JqxGrid v-if="isLoaded" style="position:relative; border: none;" ref="stationGrid" :height="'100%'"
                     :width="'100%'"
                     :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
                     :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                     :enabletooltip="true" :columnsautoresize="false" :editable="false"
                     :selectionmode="'singlerow'" :source="stationsSource"
                     :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                     @rowselect="onRowselect"
            >
            </JqxGrid>
          </div>
        </div>


        <div style="width: 100%; display : block;">
          <ul class="btn-group" :height="button_height">
<!--            <li>-->
<!--              <JqxButton class="button" ref="buttonAdd" :height="button_height" @click="delElem"-->
<!--                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"-->
<!--                         :theme="theme" :style="{'display': 'inline-block'} "-->
<!--              ><span class="nobr">Добавить&nbsp;&nbsp;&nbsp;</span>-->
<!--              </JqxButton>-->

<!--            </li>-->
            <li class="last">
              <JqxButton class="button" ref="closeButton" @click="hideModal" :width="120" :height="button_height+'px'"
                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                         :theme="theme" style="display: inline-block;"
              ><span class="nobr">Закрыть&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </JqxButton>
            </li>
            <li class="helper"></li>
          </ul>
        </div>

      </div>

    </JqxWindow>
  </div>
</template>

<script>

import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
import appConfig from "@/IERT/js/appConfig";
import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
import Rows from "@/IERT/vue/tabel/flex-row";
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
    Rows,
    JqxListBox,
    JqxInput,
    JqxForm
  },

  name: "AddStation",

  // props: ["id", "title", "closeWindows", "parentWindow", "stations"],
  props: ["id", "parentWindow", "title", "locStations", "theme"],

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

ul {
  text-align: justify;
  /* Лекарство для IE6-7*/
  text-justify: newspaper;
}

ul li {
  display: inline-block;
  text-align: left;
  /* эмуляция inline-block для IE6-7*/
/ / display: inline;
/ / zoom: 1;
}

ul li.helper {
  width: 100%;
  height: 0;
  visibility: hidden;
}

.last {
  margin-right: 100px
}

.nobr {
  white-space: nowrap;
}

.button {
  display: inline-block;
  margin-right: 10px;
  margin-left: 10px;

}

.btn-group {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

.collapse-button {
  display: inline;
  cursor: pointer;
  width: 12px;
  height: 12px;
  margin-top: 4px;
  margin-right: 1px;
  margin-left: 1px;
}

.expand-button {
  display: inline;
  cursor: pointer;
  width: 12px;
  height: 12px;
  margin-right: 1px;
  margin-left: 1px;
}

.close-button {
  display: inline;
  cursor: pointer;
  width: 12px;
  height: 12px;
  margin-right: 1px;
  margin-left: 1px;
}


</style>

