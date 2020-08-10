<template>
  <div>
    <JqxWindow :width="600"
               :height="500"
               :max-height="190000"
               :min-height="241"
               :max-width="190000"
               :min-width="455"
               :position="{ x: 40, y: 40 }"
               :title="title"
               :id="id"
               :theme="theme"
               @preAddStation="addStation"
               :is-modal="true">
      <div>
        Header
      </div>

      <div ref="MainContent" style="width: 100%; height: 100%; position: absolute">
<!--        white-space:nowrap;-->

      <div style="height: calc(100% - 100px);">
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
                   @rowselect="onRowselect"
          >
          </JqxGrid>
        </div>
      </div>


        <div style="width: 100%; display : block;">
          <ul class="btn-group" :height="button_height">
            <li>
              <JqxButton class="button" ref="buttonAdd" :height="button_height" @click="addStation"
                          :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                          :theme="theme" :style="{'display': 'inline-block'} "
              ><span class="nobr">Добавить&nbsp;&nbsp;&nbsp;</span>
              </JqxButton>

            </li>
            <li class="last">
              <JqxButton class="button" ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"
                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                         :theme="theme" style="display: inline-block;"
              ><span class="nobr">Закрыть&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </JqxButton>
            </li>
            <li class="helper"></li>
          </ul>
        </div>

      </div>

    <!--    Верхний бар-->
<!--    <div ref="header" style="position: relative;">-->
<!--      <div style="display: inline;">{{title}}</div>-->
<!--      <div style="display: inline; position: absolute; top:0; right: 0;-->
<!--                  margin-top: 6px; margin-right: 5px; z-index: 99999999999999; cursor: pointer;" @click="closeWindows"-->
<!--      >-->
<!--        <div  class="collapse-button" >-->
<!--          <img class="collapse-button" src="@/style/images/minus.png">-->
<!--        </div>-->
<!--        <div class="expand-button" >-->
<!--          <img class="expand-button" src="@/style/images/full-screen.png">-->
<!--        </div>-->
<!--        <div id="exit-button" class="close-button" @click="closeWindows">-->
<!--          <img class="close-button"  src="@/style/images/closing.png" @click="closeWindows">-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash;      Контент&ndash;&gt;-->
<!--    <div ref="content" style=" top: 0; width: 100%; height: 50%; background-color: rgba(0,0,255,0); ">-->
<!--      <Preloader style="height: calc(100% - 100px)" v-if="!isLoaded" />-->
<!--      &lt;!&ndash;      Нижняя часть окна&ndash;&gt;-->
<!--      <div style="display: inline-block; border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;-->
<!--       background-color: rgba(255,0,0,0); width: calc(100%); height: calc(100% - 200px); right: 0; position: relative; margin: 10px"-->
<!--      >-->


<!--        <JqxListBox v-show="isLoaded" ref="listBox" :theme="theme" :height="'100%'" :width="'100%'" @select="onListBoxSelect"-->
<!--                    :source="listBoxSource" :style="{'display': 'block'}">-->

<!--        </JqxListBox>-->

<!--      </div>-->

<!--      &lt;!&ndash;      Нижнее меню (кнопки)&ndash;&gt;-->
<!--      <ul class="btn-group" :height="button_height">-->
<!--        <li>-->
<!--          <JqxButton  ref="createWindowNewVariant" @click="" :height="button_height"-->
<!--                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"-->
<!--                      :theme="theme" :style="{'display': 'inline-block'} "-->
<!--          ><span class="nobr">Создать&nbsp;&nbsp;&nbsp;</span>-->
<!--          </JqxButton>-->

<!--        </li>-->
<!--        <li class="last">-->
<!--          <JqxButton class="button" ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"-->
<!--                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"-->
<!--                     :theme="theme" style="display: inline-block;"-->
<!--          ><span class="nobr">Закрыть&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
<!--          </JqxButton>-->
<!--        </li>-->
<!--        <li class="helper"></li>-->
<!--      </ul>-->
<!--    </div>-->
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

      props: ["id", "title", "closeWindows", "parentWindow", "stations"],

      data() {
        return {
          theme: appConfig.windowsTheme,
          isLoaded: true,
          button_height: 30,
          listBoxSource: [0,1,2,3,4,5,6],
          rows: [{
            id: 1,
            flex: true,
            flexSize: 1,
            data: "<div style='width: 100%; height: 100%; border: 1px solid black; box-sizing:border-box;'></div>",
            componentName: 'AddStationContent'
          }, {
            id: 2,
            static: true,
            height: 100,
            data: "<div style='width: 100%; height: 100%; border: 1px solid black; box-sizing:border-box;'></div>",
            componentName: 'AddStationLowerMenu'
          }],
          dragArea: {
            left: 0,
            top: 32,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 75
          },
          elementSize: {
            mainContent: {width: 690, height: 659},
            rowsHeightHeader: {leftPanel: 35, mainContent: 645}
          },
          height: {contentHeight: 660},
          station : null,
          stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),

          stationsColumns: [
            {text: 'Код станции', datafield: 'esr'},
            {text: 'Наименование', datafield: 'name'},
          ],

          selectedRow : null,

        }
      },

      methods: {
        addStation() {
          if (this.station) {
            let index = this.stations.indexOf(this.station);
            this.parentWindow.$parent.addStation(this.station, index);

            // Удаление станции из списка
            this.stations.splice(index, 1);
            this.$refs.stationGrid.updatebounddata('cells');
            this.$refs.stationGrid.unselectrow(index);
          }
        },

        onRowselect($event) {
          this.selectedRow = $event.args.row;
          this.station = this.stations[this.selectedRow.boundindex];
        },
      },

      mounted() {
        // console.log(this.parentWindow);
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
          localdata : this.stations
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

