<template>
  <JqxWindow :max-height="1999999"
             :max-width="190000"
             :min-width="937"
             :min-height="510"
             :position="{ x: 150, y: 150 }"
             :id="id"
             :theme="theme"
             :closeButtonSize="0"
             @addStation="addStation">

    <!--    Верхний бар-->
    <div ref="header" style="position: relative;">
      <div style="display: inline;">{{title}}</div>
      <div style="display: inline; position: absolute; top:0; right: 0;
                  margin-top: 6px; margin-right: 5px; z-index: 99999999999999; cursor: pointer;" @click="closeWindows"
      >
        <div class="collapse-button">
          <img class="collapse-button" src="@/style/images/minus.png">
        </div>
        <div class="expand-button">
          <img class="expand-button" src="@/style/images/full-screen.png">
        </div>
        <div id="exit-button" class="close-button" @click="closeWindows">
          <img class="close-button" src="@/style/images/closing.png" @click="closeWindows">
        </div>
      </div>
    </div>

    <!--      Контент-->
    <div ref="content" style=" top: 0; width: 100%; background-color: rgba(0,0,255,0); ">

      <!--      Таблица-->
      <div
        style="background-color: rgba(255,0,0,0); width: 100%; position: relative; top: 0; margin-right: 60px; height: calc(100% - 76px)">
        <JqxSplitter :width="'100%'" :height="'100%'" :theme="theme" :splitBarSize="30" @resize="onResize"
                     :panels="panels">

          <div>
            <JqxExpander style="border: none;" ref="feedExpander" :theme="theme"
                         :width="'100%'" :height="'calc(100% - 25px)'"
                         :toggleMode="'none'" :showArrow="false">

              <div class="jqx-hideborder" style="width: 100%; text-align: center">
                Выберите участки для расчета
              </div>

              <div style="padding: 0px;">
                <Preloader v-if="!isLoaded"/>
                <JqxTabs ref="myTabs" :theme="theme" :scrollable="false" :enableScrollAnimation="true"
                         :width="'100%'" :height="'100%'" :position="'top'" style="border: none;"
                         :animationType="'none'" :selectionTracker='false' @tabclick="onTabclick($event)" >
                  <ul>
                    <li style="margin-left: 10px;">Выбор из списка</li>
                    <li style="margin-right: 10px;">Выбор участка по пути следования</li>
                  </ul>

                  <div style="height:100%; width:100%; overflow: hidden;">
                    <!--           :source="dataAdapter" @rowselect="onRowselect"    -->

                    <JqxGrid v-if="isLoaded" style="position:relative; border: none;" ref="stationGrid" :height="'100%'"
                             :width="'100%'"
                             :columnsmenu="false" :columns="columns" :pageable="false" :autoheight="false"
                             :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                             :enabletooltip="true" :columnsautoresize="false" :editable="false"
                             :selectionmode="'singlerow'" :source="linesDataAdapter"
                             :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                             @rowselect="onRowselect"
                    >

                    </JqxGrid>
                  </div>

                  <div style="height: calc(100%); width:100%; overflow: hidden; position:relative;">

                    <div style="text-align: center; margin: 5px; ">Сформируйте путь следования, вдоль которого будут выбраны участки</div>

                    <div style="height: calc(100% - 110px)">
                      <JqxGrid v-if="isLoaded" style="border: none; position:relative;" ref="stationGrid" :height="'100%'"
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
                    <div style="position: absolute; bottom: 0; width: 100%">

                      <div style="display : block; width: 100%">

                        <div style="display : inline-block;">
                          <JqxButton ref="buttonAddStations" @click="createAddStation" :height="button_height+'px'"
                                        :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                                        :theme="theme" style="display : inline-block; margin-left: 5px"
                          ><span class="nobr">Добавить станцию&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </JqxButton>
                        </div>

                        <div style="display : inline-block; float: right">
                          <JqxButton ref="closeButton" @click="clearStations" :height="button_height+'px'"
                                     :textImageRelation="'imageBeforeText'" :textPosition="'center'"
                                     :theme="theme" style="display : inline-block; margin-right: 8px"
                          ><span class="nobr">Очистить&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </JqxButton>
                        </div>

                      </div>

                      <div style="display : block; width: 100%">
                        <JqxButton ref="closeButton" @click="makeLinesList" :height="button_height+'px'"
                                   :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                                   :theme="theme" style="margin-left: 5px;"
                        ><span class="nobr">Сформировать список участков&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </JqxButton>
                      </div>

                    </div>
                  </div>
                </JqxTabs>
              </div>

            </JqxExpander>

          </div>

          <div>
            <JqxExpander style="border: none;" ref="feedExpander" :theme="theme"
                         :width="'100%'" :height="'100%'"
                         :toggleMode="'none'" :showArrow="false">

              <div class="jqx-hideborder" style="width: 100%; text-align: center">
                Выбранные участки
              </div>

              <div class="jqx-hideborder jqx-hidescrollbars" style="padding: 0px;">

                <JqxTree ref="myTree" :theme="theme"
                         :width="'100%'" :height="'100%'">
                  <ul>
                    <li item-expanded="true" id="t1">
                      <span item-title="true">News and Blogs</span>
                      <ul>
                        <li>
                          <span item-title="true">Favorites</span>
                          <ul>
                            <li>
                              <span item-title="true">ScienceDaily</span>
                            </li>
                            <li>
                              <span item-title="true">ScienceDaily 2</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </JqxTree>

              </div>
            </JqxExpander>
          </div>

        </JqxSplitter>
      </div>


      <!--      Нижнее меню (кнопки)-->
      <ul class="btn-group" :height="button_height">

        <li>
          <JqxButton ref="createWindowAddStation"
                     :height="button_height"
                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                     :theme="theme" :style="{'display': 'inline-block'} "
          ><span class="nobr">Сохранить&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </JqxButton>
        </li>

        <li class="last">
          <JqxButton class="button" ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"
                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                     :theme="theme" :style="{ 'display': 'inline-block'}"
          ><span class="nobr">Закрыть&nbsp;&nbsp;</span>
          </JqxButton>
        </li>

        <li class="helper"></li>
      </ul>

    </div>
  </JqxWindow>
</template>

<script>
  import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
  import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
  import appConfig from "@/IERT/js/appConfig";
  import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
  import XmlQuery from "@/IERT/js/xmlQuery";
  import Rows from "@/IERT/vue/tabel/flex-row";
  import Preloader from "@/IERT/vue/Preloader";
  import globalData from "@/IERT/js/globalData";
  import JqxSplitter from "@/jqwidgets/jqwidgets-vue/vue_jqxsplitter";
  import JqxExpander from "@/jqwidgets/jqwidgets-vue/vue_jqxexpander";
  import JqxTree from "@/jqwidgets/jqwidgets-vue/vue_jqxtree";
  import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel";
  import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
  import Vue from 'vue';
  import JqxTabs from "@/jqwidgets/jqwidgets-vue/vue_jqxtabs";

  export default {
    components: {
      JqxWindow,
      JqxButton,
      JqxGrid,
      Preloader,
      Rows,
      JqxSplitter,
      JqxExpander,
      JqxTree,
      JqxPanel,
      JqxListBox,
      JqxTabs,
    },

    name: "WorkVariant",
    props: ["id", "title", "closeWindows", "state", "row", "stations"],
    data() {
      return {
        theme: appConfig.windowsTheme,
        isLoaded: false,
        button_height: 30,
        columns: [
          {text: 'Начало участка', datafield: 'start_name'},
          {text: 'Конец участка', datafield: 'end_name'},
          {text: 'Наличие привязки', datafield: 'exist_in_cdl', width: 124},
        ],
        stationsColumns: [
          {text: 'Основные станции пути следования', datafield: 'name'},
        ],
        linesDataAdapter: new jqx.dataAdapter(this.linesSource),
        stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),
        selectedStationsDataAdapter: new jqx.dataAdapter(this.selectedStationsSource),
        panels: [{size: '50%', min: 327, collapsible: false}, {min: 160, size: '50%', collapsible: false}],
        gsVar: null,
        selectedRow: null,

      }
    },

    // Слушатели переменных
    watch: {
      // Отключение кнопки рефреш во время подгрузки
      isLoaded: function () {
      },
    },

    methods: {
      // Поиск станции по айди
      findStationInDB(stations_id) {
        let r = this.$parent.connectDB(), t = this;

        r.onsuccess = function () {
          let db = r.result,
            objectStore = db.transaction("stations").objectStore("stations");

          for (let key in stations_id) {
            let stationReq = objectStore.get(stations_id[key]);
            stationReq.onsuccess = function () {
              if (stationReq.result) {
                t.selectedStationsSource.localdata.push(stationReq.result);
              }
              else {
                console.warn("Станция с id " + stations_id[key] + " не найдена");
              }
            }
          }
        }
      },

      calcUchs(json) {
        let t = this, linesList = "";
        t.isLoaded = false;

        for (let key in json) {
          if (key === "0") {
            linesList += json[key].uch_id;
            continue;
          }
          linesList += ',' + json[key].uch_id;
        }

        // Загрузка участков
        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
          querySet: "CALCULATE_UCHS"
        });

        xmlQuery.clearFilter();
        xmlQuery.setFilter("VAR_ID", this.row.var_id, "text");
        xmlQuery.setFilter("UCH_LIST", linesList, "text");

        xmlQuery.query('json',
          function (json) {
            // t.linesSource.datafields = [
            //   {name: 'start_name', type: 'string'},
            //   {name: 'end_name', type: 'string'},
            //   {name: 'exist_in_cdl', type: 'string'},
            // ]
            // t.linesSource.localdata = json.rows;
            t.isLoaded = true;
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
        )

      },

      // Формирование списка участков по пути следования
      makeLinesList() {
        let t = this, stationsList = "";
        t.isLoaded = false;

        for (let key in this.stationsSource.localdata) {
          if (key === '0') {
            stationsList += this.stationsSource.localdata[key].stan_id;
            continue;
          }
          stationsList += "_" + this.stationsSource.localdata[key].stan_id;
        }

        // Загрузка участков
        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
          querySet: "UCHS_ON_PATH"
        });

        xmlQuery.clearFilter();
        xmlQuery.setFilter("VAR_ID", this.row.var_id, "text");
        xmlQuery.setFilter("LIST", stationsList, "text");

        xmlQuery.query('json',
          function (json) {
               t.calcUchs(json.rows);
            // t.linesSource.datafields = [
            //   {name: 'start_name', type: 'string'},
            //   {name: 'end_name', type: 'string'},
            //   {name: 'exist_in_cdl', type: 'string'},
            // ]
            // t.linesSource.localdata = json.rows;
            t.isLoaded = true;
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
        )
      },

      // Добавление станции
      addStation(station) {
        this.stationsSource.localdata.push(station);
        this.$refs.stationGrid.updatebounddata('cells');
      },

      // Удаление станции по выделению
      deleteStation() {
        let station;
        station = this.$refs.stationGrid.getrowdata(this.$refs.stationGrid.getselectedrowindex());
        if (station) {
          this.stationsSource.localdata.splice(station.boundindex, 1);
          this.$refs.stationGrid.updatebounddata('cells');
        } else {
          console.log("Не выбрана станция для удаления");
        }
      },

      // Очистка списка станций
      clearStations() {
        this.stationsSource.localdata = [];
        this.$refs.stationGrid.updatebounddata('cells');
      },

      appendSavedParams() {
        let left, right, tabIndex;

        // Делить экранов, сплиттер
        if ((left = localStorage.getItem("EditWindowLeftPanelSize")) && (right = localStorage.getItem("EditWindowRightPanelSize"))) {
          this.panels[0].size = left;
          this.panels[1].size = right;
        }

        // Индекс вкладки
        if (tabIndex = localStorage.getItem("TabIndex")) {
          this.$refs.myTabs.select(tabIndex);
        }

      },

      onTabclick: function (event) {
        localStorage.setItem("TabIndex", event.args.item);
      },

      onResize() {
        localStorage.setItem("EditWindowLeftPanelSize", Math.round(parseFloat(this.panels[0].size.replace(/,/g, '%'))) + "%");
        localStorage.setItem("EditWindowRightPanelSize", Math.round(parseFloat(this.panels[1].size.replace(/,/g, '%'))) + "%");
      },

      Preload() {
        let t = this;
        t.isLoaded = false;

        // Загрузка участков
        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
          querySet: "LOAD_LINES"
        });

        xmlQuery.clearFilter();
        xmlQuery.setFilter("VAR_ID", this.row.var_id, "text");

        xmlQuery.query('json',
          function (json) {
            t.linesSource.datafields = [
              {name: 'start_name', type: 'string'},
              {name: 'end_name', type: 'string'},
              {name: 'exist_in_cdl', type: 'string'},
            ]
            t.linesSource.localdata = json.rows;
            t.isLoaded = true;
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
        )
      },

      onRowselect($event) {
        this.selectedRow = $event.args.row;
        // console.log(this.selectedRow);
      },

      // Окно изменения варианта
      createAddStation() {
        this.$emit('createAddStationWindow', this.id)
      },

    },

    beforeCreate: function () {
      this.linesSource = {
        datatype: 'json',
      };

      this.stationsSource = {
        datatype: 'json',
      }

      this.selectedStationsSource = {
        datatype: 'json'
      }
    },

    created() {
      this.stationsSource = {
        datafields : [
          {name: 'name', type: 'string'},
        ],
        localdata : []
      };

      this.selectedStationsSource = {
        datafields : [
          {name: 'name', type: 'string'},
        ],
        localdata : []
      }

      this.gsVar = this.row.var_gs_var_id;
      this.Preload();
    },

    mounted() {
      // Применение сохраненных параметров
      this.appendSavedParams();
      this.findStationInDB([1,2,3,4]);
    },
  }
</script>


<style scoped>
  .jqx-expander-content {
    height: 100% !important;
  }

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
