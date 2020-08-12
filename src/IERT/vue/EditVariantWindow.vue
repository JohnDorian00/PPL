<template>
  <div>

    <div>
      <JqxWindow :max-height="1999999"
                 :max-width="190000"
                 :min-width="937"
                 :min-height="510"
                 :width="1250"
                 :position="{ x: 150, y: 150 }"
                 :id="id"
                 :theme="theme"
                 :closeButtonSize="0"
                 :keyboard-close-key="NaN"
      >

        <!--    Верхний бар-->
        <div ref="header" style="position: relative;">
          <div style="display: inline;">{{ title }} ///</div>
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

                    <JqxTabs ref="myTabs" :theme="theme" :scrollable="false" :enableScrollAnimation="true"
                             :width="'100%'" :height="'100%'" :position="'top'" style="border: none;"
                             :animationType="'none'" :selectionTracker='false' @selected="onTabclick($event)">
                      <ul>
                        <li style="margin-left: 10px;">Выбор из списка</li>
                        <li style="margin-right: 10px;">Выбор участка по пути следования</li>
                      </ul>

                      <div style="height:100%; width:100%; overflow: hidden;">
                        <!--           :source="dataAdapter" @rowselect="onRowselect"    -->
                        <Preloader v-if="!isLinesLoaded" style="position: relative"/>
                        <JqxGrid v-show="isLinesLoaded" style="position:relative; border: none;" ref="linesGrid"
                                 :height="'100%'"
                                 :width="'100%'"
                                 :columnsmenu="false" :columns="columns" :pageable="false" :autoheight="false"
                                 :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                                 :enabletooltip="true" :columnsautoresize="false" :editable="false"
                                 :selectionmode="'singlerow'" :source="linesSource"
                                 :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                                 @rowselect="onRowselect"
                        >

                        </JqxGrid>
                      </div>

                      <div style="height: calc(100%); width:100%; overflow: hidden; position:relative;">

                        <div style="text-align: center; margin: 5px; ">Сформируйте путь следования, вдоль которого будут
                          выбраны участки
                        </div>

                        <div style="height: calc(100% - 110px)">


                          <!--                       v-if="isLinesLoaded"   <Preloader v-if="!isLinesLoaded" style="position:relative;"/>-->


                          <JqxGrid style="border: none; position:relative;" ref="stationGrid"
                                   :height="'100%'"
                                   :width="'100%'" :enablehover="false"
                                   :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
                                   :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                                   :enabletooltip="true" :columnsautoresize="false" :editable="false"
                                   :selectionmode="'singlerow'" :source="stationsSource"
                                   :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                                   @rowselect="deleteStationToModal($event)"
                          >
                          </JqxGrid>
                        </div>
                        <div style="position: absolute; bottom: 0; width: 100%">

                          <div style="display : block; width: 100%">

                            <div style="display : inline-block;">
                              <JqxButton ref="buttonAddStations" @click="showModal" :height="button_height+'px'"
                                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                                         :theme="theme" style="display : inline-block; margin-left: 5px"
                              ><span class="nobr">Добавить станцию&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                              </JqxButton>
                            </div>

                            <div style="display : inline-block; float: right">
                              <JqxButton @click="clearStations" ref="buttonClearStations" :height="button_height+'px'"
                                         :textImageRelation="'imageBeforeText'" :textPosition="'center'"
                                         :theme="theme" style="display : inline-block; margin-right: 8px"
                              ><span class="nobr">Очистить станции&nbsp;&nbsp;&nbsp;&nbsp;</span>
                              </JqxButton>
                            </div>

                          </div>

                          <div style="display : block; width: 100%">
                            <JqxButton @click="makeLinesList" ref="buttonMakeLines" :height="button_height+'px'"
                                       :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                                       :theme="theme" style="margin-left: 5px;" :disabled="true"
                            ><span
                                class="nobr">Сформировать список участков&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
                             :width="'100%'" :height="'calc(100% - 25px)'"
                             :toggleMode="'none'" :showArrow="false">

                  <div class="jqx-hideborder" style="width: 100%; text-align: center">
                    Выбранные участки
                  </div>

                  <div style="height: 100%; padding: 0;">
                    <div>
                      <Preloader v-if="!isLoaded"/>
                    </div>

                    <jqxTreeGrid v-show="isLoaded && !isLoco" style="border: none; position:relative;"
                                 ref="selectedGrid"
                                 :height="'100%'"
                                 :width="'100%'" @rowBeginEdit="rowEdit($event)" @rowEndEdit="rowEndEdit($event)"
                                 :columnsmenu="false" :columns="selectedStationsColumns" :pageable="false"
                                 :autoheight="false"
                                 :sortable="true" :altRows="true" :columnsResize="true" :showfilterrow="true"
                                 :enabletooltip="true" :columnsautoresize="false" :editable="true"
                                 :selectionMode="'custom'" :source="selectedStationsSource"
                                 :theme="theme" :filterable="false" :filterMode="'advanced'" :sortmode="'columns'"
                    >
                    </jqxTreeGrid>

                    <jqxTreeGrid v-show="isLoaded && isLoco" style="border: none; position:relative;"
                                 ref="selectedGridLoco"
                                 :height="'100%'"
                                 :width="'100%'" @rowBeginEdit="rowEdit($event)" @rowEndEdit="rowEndEdit($event)"
                                 :columnsmenu="false" :columns="selectedStationsColumns" :pageable="false"
                                 :autoheight="false" :source="stationsSource"
                                 :sortable="true" :altRows="true" :columnsResize="true" :showfilterrow="true"
                                 :enabletooltip="true" :columnsautoresize="false" :editable="true"
                                 :selectionMode="'custom'"
                                 :theme="theme" :filterable="false" :filterMode="'default'" :sortmode="'columns'"
                    >
                    </jqxTreeGrid>
                  </div>
                </JqxExpander>
              </div>

            </JqxSplitter>
          </div>


          <!--      Нижнее меню (кнопки)-->
          <ul class="btn-group" :height="button_height">

            <li>
              <JqxButton ref="createWindowAddStation"
                         :height="button_height" @click="test"
                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                         :theme="theme" :style="{'display': 'inline-block'} "
              ><span class="nobr">Сохранить&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </JqxButton>
            </li>


            <li>
              <JqxButton class="button" ref="buttonClear" @click="clearLines" :height="button_height+'px'"
                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                         :theme="theme" :style="{ 'display': 'inline-block'}"
              ><span class="nobr">Очистить выбранные участки&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </JqxButton>
            </li>
            <li class="last">
              <JqxButton class="button" ref="buttonClose" @click="closeWindows" :width="120"
                         :height="button_height+'px'"
                         :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                         :theme="theme" :style="{ 'display': 'inline-block'}"
              ><span class="nobr">Закрыть&nbsp;&nbsp;</span>
              </JqxButton>
            </li>

            <li class="helper"></li>
          </ul>

        </div>
      </JqxWindow>
    </div>

    <div>
      <AddStation ref="modal" :parentWindow="this" :title="'Добавление путей по станциям'"
                  :locStations="locStations" :id="id" @station-deleted="addStation">

      </AddStation>
    </div>

  </div>


</template>

<script>
import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
import appConfig from "@/IERT/js/appConfig";
import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
import XmlQuery from "@/IERT/js/xmlQuery";
import Rows from "@/IERT/vue/tabel/flex-row";
import Preloader from "@/IERT/vue/Preloader";
import JqxSplitter from "@/jqwidgets/jqwidgets-vue/vue_jqxsplitter";
import JqxExpander from "@/jqwidgets/jqwidgets-vue/vue_jqxexpander";
import JqxTree from "@/jqwidgets/jqwidgets-vue/vue_jqxtree";
import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel";
import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
import JqxTabs from "@/jqwidgets/jqwidgets-vue/vue_jqxtabs";
import JqxTreeGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxtreegrid";
import AddStation from "@/IERT/vue/windows/AddStation/AddStation";

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
    JqxTreeGrid,
    AddStation,
  },

  name: "WorkVariant",
  props: ["id", "title", "closeWindows", "state", "row", "stations"],
  data() {
    return {
      theme: appConfig.windowsTheme,
      isLoaded: true,
      isLinesLoaded: true,
      button_height: 30,
      columns: [
        {text: 'Начало участка', datafield: 'start_name'},
        {text: 'Конец участка', datafield: 'end_name'},
        {text: 'Наличие привязки', datafield: 'exist_in_cdl', width: 124},
      ],
      stationsColumns: [
        {text: 'Основные станции пути следования', datafield: 'name'},
      ],
      selectedStationsColumns: [
        {text: 'Название участка', datafield: 'line_name', editable: false},
        {text: 'Тех. скорость, км/ч', datafield: 'tech_spd', editable: false},
        {
          text: 'Уч. скорость, км/ч', datafield: 'line_spd',
          validation: function (cell, value) {
            if (value.toString().length < 1) {
              return {message: "Name should be minimum 1 characters", result: false};
            }
            return true;
          }
        },
        {text: 'Коэф. потр.', datafield: 'koef_potr', editable: false},
        {
          text: 'Кол-во поездов', datafield: 'trains_amount',
          validation: function (cell, value) {
            if (value.toString().length < 1) {
              return {message: "Name should be minimum 1 characters", result: false};
            }
            return true;
          }
        },
        {text: 'Потребность лок.', datafield: 'trains_need', editable: false},
      ],

      linesDataAdapter: new jqx.dataAdapter(this.linesSource),
      stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),
      selectedStationsDataAdapter: new jqx.dataAdapter(this.selectedStationsSource),

      panels: [{size: '50%', min: 327, collapsible: false}, {min: 226, size: '50%', collapsible: false}],
      gsVar: null,
      selectedRow: null,
      stationsList: [],
      deletedStationsStack: [],
      makeLinesListDisableFlag: true,
      deletedLine: null,
      locStations: this.stations,
      isLoco: false,
    }
  },

  // Слушатели переменных
  watch: {
    // Отключение кнопки рефреш во время подгрузки
    isLoaded: function () {
    },

    isLinesLoaded: function () {
      // this.$refs.buttonAddStations.disabled = !this.isLinesLoaded;
      this.refreshLinesGrid();
    },

    makeLinesListDisableFlag: function () {
      this.$refs.buttonMakeLines.disabled = this.makeLinesListDisableFlag;
    },

  },

  methods: {
    test() {
      this.isLoco = !this.isLoco;
      // this.$refs.selectedGrid.render();
      console.log(this.isLoco);
    },

    loadStationsFromIndexedDB() {
      let t = this;

      let openRequest = t.$parent.connectDB();

      // Загрузка станций в IndexedDB
      openRequest.onsuccess = function () {
        let db = openRequest.result;
        // продолжить работу с базой данных, используя объект db
        db.onversionchange = function () {
          db.close();
          alert("База данных устарела, пожалуста, перезагрузите страницу.")
        };

        let lines = db.transaction("stations", "readonly").objectStore("stations");

        let transaction = lines.getAll();

        transaction.onsuccess = function () {
          t.locStations = transaction.result;
          t.$refs.modal.refreshGrid();
        }
        transaction.onerror = function () {
          console.log("Ошибка загрузки станций из IndexedDB");
        }
      }
    },

    // Показать окно добавления станций
    showModal() {
      this.$refs.modal.showModal();
    },

    // Сохранение изменений участков
    saveSelectedLines() {
      console.log(this.$refs.linesGrid.isBindingCompleted());
      console.log(this.$refs.stationGrid.isBindingCompleted());
      // let t = this;
      // // t.isLinesLoaded = false;
      //
      // // Сохранение участков
      // let xmlQuery = new XmlQuery({
      //   url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
      //   querySet: "SAVE_UCH_DATA2"
      // });
      //
      // xmlQuery.clearFilter();
      // xmlQuery.setFilter("VAR_ID", this.row.var_id, "text");
      // xmlQuery.setFilter("test", {"1":1, "2":"test"}, "object");
      // console.log(xmlQuery.getFilter("test"));
      //
      // // xmlQuery.query('json',
      // //   function (json) {
      // //
      // //     xmlQuery.destroy();
      // //   },
      // //
      // //   function (ER) {
      // //     xmlQuery.destroy();
      // //     console.log("Error save data");
      // //     console.log(ER);
      // //   }
      // // )
    },

    // Конец редактирования строки
    rowEndEdit(e) {
      let row = e.args.row;
      console.log(row);

      if (row.editable) {
        row.tech_spd = Math.round(row.line_spd / row.v_prop * 1000) * 0.001;

        // TODO считывание 0E-20
        // koef_potr = Math.round((t_prost  + len / v_uch) / 24 * 1000) * 0.001;
        //portebnost` = Math.round(train_count * ((t_prost  + len / v_uch) / 24 )*1000) * 0.001;
      }
    },

    // disable non-editable rows
    rowEdit(e) {
      if (!e.args.row.editable) {
        this.$refs.selectedGrid.endRowEdit(0, true);
      }
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

    // Сортировка участков по exist_in_cdl и по алфавитному порядку (start_name)
    linesSort() {
      this.linesSource.localdata.sort(function (a, b) {
        let nameA = a.start_name,
            nameB = b.start_name,
            existInCDLA = a.exist_in_cdl,
            existInCDLB = b.exist_in_cdl;

        if (existInCDLA > existInCDLB) {
          return -1
        } else if (existInCDLA < existInCDLB) {
          return 1
        } else {
          if (nameA > nameB)
            return 1
          if (nameA < nameB) //сортируем строки по возрастанию
            return -1
        }

        return 0 // Никакой сортировки
      })
    },

    refreshAllTables() {
      this.refreshLinesGrid();
      this.refreshStationsGrid();
      this.refreshSelectedLinesGrid();
    },

    refreshLinesGrid() {
      if (this.$refs.linesGrid && (this.$refs.myTabs.selectedItem === 0 || this.$refs.myTabs.selectedItem === "0")) {
        // console.log("update lines");
        this.$refs.linesGrid.updatebounddata("cells");
      }
    },

    refreshStationsGrid() {
      // localStorage.getItem("TabIndex") === "1"
      if (this.$refs.stationGrid && (this.$refs.myTabs.selectedItem === 1 || this.$refs.myTabs.selectedItem === "1")) {
        // console.log("update stations");
        this.$refs.stationGrid.updatebounddata("cells");
      }
    },

    refreshSelectedLinesGrid() {
      if (this.$refs.selectedGrid) {
        this.$refs.selectedGrid.updateBoundData("cells");
      }
    },

    selectLine(line) {
      let t = this;
      let index = this.linesSource.localdata.findIndex(item => item.uch_id == line.uch_id),
          item = this.linesSource.localdata[index];

      // Добавить участок в правый грид
      this.calcUchs([item.uch_id]);

    },

    unselectStationGrid() {
      let t = this;
      setTimeout(function () {
        t.$refs.stationGrid.clearselection();
      }, 1)
    },

    clearLines() {
      this.selectedStationsSource.localdata = [];
      this.refreshAllTables();
    },

    // Загрузка участков в IndexedDB
    loadLines() {
      let t = this;
      t.isLinesLoaded = false;

      // Загрузка участков
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "LOAD_LINES"
      });

      xmlQuery.clearFilter();
      xmlQuery.setFilter("VAR_ID", this.row.var_id, "text");

      xmlQuery.query('json',
          function (json) {
            if (json.rowsAffected === 0) {
              console.warn("Ошибка получения участков с сервера");
              return
            }

            t.linesSource.datafields = [
              {name: 'start_name', type: 'string'},
              {name: 'end_name', type: 'string'},
              {name: 'exist_in_cdl', type: 'string'},
              {name: 'start_stan', type: 'string'},
              {name: 'end_stan', type: 'string'},
              {name: 'uch_id', type: 'string'},

            ]
            t.linesSource.localdata = json.rows;
            t.linesSort();

            let openRequest = t.$parent.connectDB();
            // Загрузка станций в IndexedDB
            openRequest.onsuccess = function () {
              let db = openRequest.result;
              // продолжить работу с базой данных, используя объект db
              db.onversionchange = function () {
                db.close();
                alert("База данных устарела, пожалуста, перезагрузите страницу.")
              };
              let transaction = db.transaction("lines", "readwrite");
              let lines = transaction.objectStore("lines");
              lines.clear();

              let obj;

              for (let i = 0; i < json.rows.length; i++) {
                obj = {
                  uch_id: json.rows[i].uch_id,
                  start_stan: json.rows[i].start_stan,
                  start_name: json.rows[i].start_name,
                  end_stan: json.rows[i].end_stan,
                  end_name: json.rows[i].end_name,
                  exist_in_cdl: json.rows[i].exist_in_cdl,
                }
                lines.add(obj);
              }
              transaction.oncomplete = function () {
                console.log("Участки обновлены");
              };
              transaction.onerror = function () {
                if (event.target.error.name === "ConstraintError") {
                  console.log("Станция с таким id уже существует, ", obj); // обрабатываем ошибку
                  event.preventDefault(); // предотвращаем отмену транзакции
                  event.stopPropagation(); // предотвращаем всплытие ошибки
                } else {
                  // транзакция будет отменена
                  // обработать ошибку в transaction.onabort
                  console.log("Ошибка обновления станций, ", event.target);
                }
              }
            };

            t.isLinesLoaded = true;

            t.refreshLinesGrid();

            xmlQuery.destroy();
          },

          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
      )
    },

    // Загрузка расшифровки кодов локомотивов
    loadLocoCodes() {
      let t = this;

      // Загрузка участков
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "LOAD_LOCO_CODES"
      });

      xmlQuery.query('json',
          function (json) {
            let openRequest = t.$parent.connectDB();
            // Загрузка станций в IndexedDB
            openRequest.onsuccess = function () {
              let db = openRequest.result;
              // продолжить работу с базой данных, используя объект db
              db.onversionchange = function () {
                db.close();
                alert("База данных устарела, пожалуста, перезагрузите страницу.")
              };
              let transaction = db.transaction("locoCodes", "readwrite");
              let locoCodes = transaction.objectStore("locoCodes");
              locoCodes.clear();

              let obj;

              for (let i = 0; i < json.rows.length; i++) {
                obj = {
                  kod_gr: json.rows[i].kod_gr,
                  name: json.rows[i].name,
                }
                locoCodes.put(obj);
              }
              transaction.oncomplete = function () {
                console.log("Коды локомотивов обновлены");
              };
              transaction.onerror = function () {
                console.log("Ошибка обновления кодов локомотивов, ", event.target);
              }
            };
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
      )
    },

    // Загрузка расшифровки кодов участков
    loadLinesCodes() {
      let t = this;

      // Загрузка участков
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "LOAD_UCHS_CODES"
      });

      xmlQuery.query('json',
          function (json) {
            let openRequest = t.$parent.connectDB();
            // Загрузка станций в IndexedDB
            openRequest.onsuccess = function () {
              let db = openRequest.result;
              // продолжить работу с базой данных, используя объект db
              db.onversionchange = function () {
                db.close();
                alert("База данных устарела, пожалуста, перезагрузите страницу.")
              };
              let transaction = db.transaction("linesCodes", "readwrite");
              let linesCodes = transaction.objectStore("linesCodes");
              linesCodes.clear();

              let obj;

              for (let i = 0; i < json.rows.length; i++) {
                obj = {
                  vid_uch: json.rows[i].vid_uch,
                  sname_vid: json.rows[i].sname_vid,
                }
                linesCodes.put(obj);
              }
              transaction.oncomplete = function () {
                console.log("Коды участков обновлены");
              };
              transaction.onerror = function () {
                console.log("Ошибка обновления кодов участков, ", event.target);
              }
            };

            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
      )
    },

    // Поиск участков по айди
    findLinesInDB() {
      let r = this.$parent.connectDB(), t = this;

      r.onsuccess = function () {
        let db = r.result,
            objectStore = db.transaction("lines", "readonly").objectStore("lines");

        t.selectedStationsSource.localdata = [];

        for (let key in t.stationsList) {
          let linesReq = objectStore.get(t.stationsList[key]);
          linesReq.onsuccess = function () {
            if (linesReq.result) {
              let obj = {
                line_name: linesReq.result.start_name + " - " + linesReq.result.end_name,
                tech_spd: "",
                line_spd: "",
                koef_potr: 0,
                trains_amount: "",
                trains_need: 0,
              };
              t.selectedStationsSource.localdata.push(obj);
              t.$refs.selectedGrid.updatebounddata('cells');
            } else {
              console.warn("Станция с id " + t.stationsList[key] + " не найдена");
            }
          }
        }
      }
    },

    // Поиск станции по айди
    findStationInDB(stations_id) {
      let r = this.$parent.connectDB(), t = this;

      r.onsuccess = function () {
        let db = r.result,
            objectStore = db.transaction("stations", "readonly").objectStore("stations");

        for (let key in stations_id) {
          let stationReq = objectStore.get(stations_id[key]);
          stationReq.onsuccess = function () {
            if (stationReq.result) {
              t.selectedStationsSource.localdata.push(stationReq.result);
            } else {
              console.warn("Станция с id " + stations_id[key] + " не найдена");
            }
          }
        }
      }
    },

    // Поиск участков
    calcUchs(stationsList) {
      let t = this, linesList = "";
      t.isLoaded = false;

      // Выключение грида с участками
      if (t.$refs.myTabs.selectedItem === 0 || t.$refs.myTabs.selectedItem === "0") {
        t.$refs.linesGrid.disabled = true;
      }


      for (let key in stationsList) {
        if (key === "0") {
          linesList += stationsList[key];
          continue;
        }
        linesList += ',' + stationsList[key];
      }

      // Загрузка участков
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "CALCULATE_UCHS"
      });

      xmlQuery.clearFilter();
      xmlQuery.setFilter("VAR_ID", t.row.var_id, "text");
      xmlQuery.setFilter("UCH_LIST", linesList, "text");

      xmlQuery.query('json',
          function (json) {

            let r = t.$parent.connectDB();

            r.onsuccess = function () {

              let db = r.result,
                  linesCodesTR = db.transaction("linesCodes", "readonly"),
                  linesCodes = linesCodesTR.objectStore("linesCodes");

              if (json.rowsAffected > 0) {

                let linesSet = new Set(),
                    locoSet = new Set(),
                    linesArr = [],
                    locoArr = [];

                stationsList.forEach(function (item) {
                  linesSet.add(item);
                })

                json.rows.forEach(function (item, i, arr) {
                  linesSet.add(item.uch_id);
                  locoSet.add(item.kod_gr);

                  let lineCodesR = linesCodes.get(item.kat_id);

                  lineCodesR.onsuccess = function () {
                    item.kat_id_name = lineCodesR.result.sname_vid;
                  }

                });

                linesCodesTR.oncomplete = function () {

                  let linesTR = db.transaction("lines", "readonly"),
                      lines = linesTR.objectStore("lines");

                  linesSet.forEach(function (item) {
                    let linesR = lines.get(item);

                    linesR.onsuccess = function () {
                      linesArr.push({uch_id: item, line: linesR.result});
                    }

                  })

                  linesTR.oncomplete = function () {

                    let locoCodesTR = db.transaction("locoCodes", "readonly"),
                        locoCodes = locoCodesTR.objectStore("locoCodes");

                    locoSet.forEach(function (item) {
                      let locoR = locoCodes.get(item);

                      locoR.onsuccess = function () {
                        locoArr.push({kod_gr: item, kod_gr_name: locoR.result.name})
                      }
                    })

                    locoCodesTR.oncomplete = function () {
                      t.addToSelectedGrid(linesArr, json.rows, locoArr);

                      // // Удаление строчки из левого грида
                      // let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                      // t.linesSource.localdata.splice(index, 1);
                      // t.unselectLinesGrid();
                      // t.refreshLinesGrid();

                      // Включение грида с участками
                      if (t.$refs.myTabs.selectedItem === 0 || t.$refs.myTabs.selectedItem === "0") {
                        t.$refs.linesGrid.disabled = false;
                      }
                    }
                    locoCodesTR.onerror = function () {
                      console.log(event.target);
                    }
                  }
                  linesTR.onerror = function () {
                    console.log(event.target);
                  }
                }

                linesCodesTR.onerror = function () {
                  console.log(event.target);
                }


                // // Удаление строчки из левого грида
                // let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                // t.linesSource.localdata.splice(index, 1);
                // t.unselectLinesGrid();
                // t.refreshLinesGrid();

                //   let request = lines.get(json.rows[0].uch_id);
                //
                //   request.onsuccess = function () {
                //
                //     // Выделенный участок
                //     let line = request.result;
                //
                //     if (!line) {
                //       console.log("Отсутствует список участков в IndexedDB или запись не найдена");
                //       return
                //     }
                //
                //     //let linesCodes = db.transaction("linesCodes", "readonly").objectStore("linesCodes");
                //
                //     // Выделенная информация под участок
                //     let linesInfo = [];
                //     for (let key in json.rows) {
                //       // console.log(json.rows[key].kod_gr);  kod_gr  kat_id
                //       linesInfo.push(json.rows[key]);
                //     }
                //
                //
                //
                //     // добавление участков в дерево правого грида
                //     t.addToSelectedGrid(line, linesInfo);
                //
                //     //TODO добавление участков в дерево правого грида (по группам локомотивов)
                //
                //     // Удаление строчки из левого грида
                //     let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                //     t.linesSource.localdata.splice(index, 1);
                //     t.unselectLinesGrid();
                //     t.refreshLinesGrid();
                //   }
                //   // Если нет привязки, то в правый грид добавляется только название участка
                // } else {
                //   for (let key in stationsList) {
                //     let r = lines.get(stationsList[key]);
                //
                //     r.onsuccess = function () {
                //       let line = r.result;
                //       t.selectedStationsSource.localdata.push({
                //         line_name: line.start_name + " - " + line.end_name,
                //         children: [],
                //       });
                //
                //       let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                //       console.log("Отсутствует привязка к участку", t.linesSource.localdata.splice(index, 1)[0]);
                //       t.isLoaded = true;
                //       t.refreshLinesGrid();
                //       t.refreshSelectedLinesGrid();
                //     }
                //   }
              }
            }
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
      )
    },

    unselectLinesGrid() {
      let t = this;
      if (t.$refs.linesGrid && (this.$refs.myTabs.selectedItem === 0 || this.$refs.myTabs.selectedItem === "0")) {
        setTimeout(function () {
          t.$refs.linesGrid.clearselection();
        }, 1)
      }
    },

    // Добавление в правый грид
    addToSelectedGrid(lines, lineInfo, locos) {
      let t = this;

      console.log(lines);
      console.log(lineInfo);
      console.log(locos);

      let stationObj,
          locoObjs = [];


      // По участкам
      lines.forEach(function (lineCode) {
        stationObj = {};
        let secondChildrens = [],
            thirdChildrens = [];

        // Set loco_name of 1 elem
        let lokoNameSet = new Set();
        lineInfo.filter((item) => {
          if (item.uch_id === lineCode.uch_id) {
            // console.log("added to loco set ", item.loko_name);
            lokoNameSet.add(item.loko_name);
          }
        })

        secondChildrens = [];
        lokoNameSet.forEach(function (locoName) {
          thirdChildrens = [];
          lineInfo.filter((item) => {
            if (item.uch_id === lineCode.uch_id && item.loko_name === locoName) {
              thirdChildrens.push({
                line_name: item.kat_id_name,
                tech_spd: 0,
                line_spd: item.v_uch,
                koef_potr: 0,
                trains_amount: item.train_count,
                trains_need: 0,
                lineInfo: item,
                editable: true
              })
            }
          })
          secondChildrens.push({line_name: locoName, editable: false, children: thirdChildrens});
        })


        stationObj = {
          line_name: lineCode.line.start_name + " - " + lineCode.line.end_name,
          root: true,
          editable: false,
          children: secondChildrens,
        }

        console.log(stationObj);

        t.selectedStationsSource.localdata.push(stationObj);

      })
      t.refreshSelectedLinesGrid();

      // По локомотивам


      t.isLoaded = true;

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
            t.stationsList = [];
            if (json.rowsAffected < 1) {
              console.log("Отсутствуют участки между данными станциями");
              t.isLoaded = true;
              return
            }

            json.rows.filter(function (item) {
              t.stationsList.push(item.uch_id);
            })

            t.selectedStationsSource.localdata = [];
            t.calcUchs(t.stationsList);
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

    deleteStationToModal(e) {
      let index = e.args.rowindex;
      let row = this.deleteStation(index)[0];
      this.$refs.modal.addElem(row);

      this.unselectStationGrid();
    },

    // Добавление станции
    addStation(row) {
      this.stationsSource.localdata.push(row);
      this.stationsSort();
      this.refreshStationsGrid();

      // this.$refs.stationGrid ? this.$refs.stationGrid.unselectrow(this.$refs.stationGrid.getselectedrowindex()) : null;

      if (this.stationsSource.localdata.length > 1) {
        this.makeLinesListDisableFlag = false;
      }
    },

    // Удаление станции
    deleteStation(index) {
      let deletedRow = this.stationsSource.localdata.splice(index, 1);
      this.stationsSort();
      this.refreshStationsGrid();

      if (this.stationsSource.localdata.length < 2) {
        this.makeLinesListDisableFlag = true;
      }

      return deletedRow;
    },

    // Очистка списка станций
    clearStations() {
      this.stationsSource.localdata = [];
      this.refreshAllTables();
      this.makeLinesListDisableFlag = true;

      // this.selectedStationsSource.localdata = [];
      // this.$refs.selectedGrid.updatebounddata('cells');
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

    onTabclick: function (e) {
      localStorage.setItem("TabIndex", e.args.item);
      this.refreshAllTables();
    },

    onResize() {
      localStorage.setItem("EditWindowLeftPanelSize", parseFloat(this.panels[0].size.replace(/,/g, '%')) + "%");
      localStorage.setItem("EditWindowRightPanelSize", parseFloat(this.panels[1].size.replace(/,/g, '%')) + "%");
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
      this.selectedRow = this.linesSource.localdata[$event.args.row.boundindex];
      this.selectLine($event.args.row);
    },
  },

  beforeCreate() {
    this.linesSource = {
      datatype: 'json',
    };

    this.stationsSource = {
      datatype: 'json',
    };

    this.selectedStationsSource = {
      datatype: 'json'
    };
  },

  created() {
    this.stationsSource = {
      datafields: [
        {name: 'name', type: 'string'},
      ],
      localdata: []
    };

    this.linesSource = {
      localdata: []
    }

    this.selectedStationsSource = {
      datafields: [

        {name: 'line_name', type: 'string'},
        {name: 'tech_spd', type: 'string'},
        {name: 'line_spd', type: 'string'},
        {name: 'koef_potr', type: 'string'},
        {name: 'trains_amount', type: 'string'},
        {name: 'trains_need', type: 'string'},
        {name: 'children', type: 'array'},
      ],
      hierarchy:
          {
            root: 'children'
          },
      localdata: [
        {
          "line_name": "Nancy1",
          "tech_spd": "12",
          "line_spd": "12",
          "koef_potr": "0",
          "trains_amount": "123",
          "trains_need": "456",
          "children": [
            {
              "test": "test",
              "line_name": "Nancy2",
              "tech_spd": "12",
              "line_spd": "12",
              "koef_potr": "0",
              "trains_amount": "123",
              "trains_need": "456",
              "editable": true,
            },
          ]
        },

      ]
    }
    this.gsVar = this.row.var_gs_var_id;

    // this.$root.$children[0].loadStations();
  },

  mounted() {
    // Применение сохраненных параметров
    this.appendSavedParams();
    this.loadLinesCodes();
    this.loadLocoCodes();
    this.loadLines();
    this.loadStationsFromIndexedDB();
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
