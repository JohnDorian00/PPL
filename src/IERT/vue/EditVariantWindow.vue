<template>
  <JqxWindow :max-height="1999999"
             :max-width="190000"
             :min-width="937"
             :min-height="510"
             :width="1250"
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

                <JqxTabs ref="myTabs" :theme="theme" :scrollable="false" :enableScrollAnimation="true"
                         :width="'100%'" :height="'100%'" :position="'top'" style="border: none;"
                         :animationType="'none'" :selectionTracker='false' @tabclick="onTabclick($event)">
                  <ul>
                    <li style="margin-left: 10px;">Выбор из списка</li>
                    <li style="margin-right: 10px;">Выбор участка по пути следования</li>
                  </ul>

                  <div style="height:100%; width:100%; overflow: hidden;">
                    <!--           :source="dataAdapter" @rowselect="onRowselect"    -->
                    <Preloader v-if="!isLinesLoaded"/>
                    <JqxGrid v-show="isLinesLoaded" style="position:relative; border: none;" ref="linesGrid" :height="'100%'"
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
                      <JqxGrid v-if="isLoaded" style="border: none; position:relative;" ref="stationGrid"
                               :height="'100%'"
                               :width="'100%'"
                               :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
                               :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                               :enabletooltip="true" :columnsautoresize="false" :editable="false"
                               :selectionmode="'multiplerowsextended'" :source="stationsSource"
                               :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                               @rowselect="deleteStation"
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
                <Preloader v-if="!isLoaded"/>
                <jqxTreeGrid v-if="isLoaded" style="border: none; position:relative;" ref="selectedGrid"
                             :height="'100%'"
                             :width="'100%'"
                             :columnsmenu="false" :columns="selectedStationsColumns" :pageable="false"
                             :autoheight="false"
                             :sortable="true" :altRows="true" :columnsResize="true" :showfilterrow="true"
                             :enabletooltip="true" :columnsautoresize="false" :editable="true"
                             :selectionMode="'custom'" :source="selectedStationsSource"
                             :theme="theme" :filterable="true" :filterMode="'default'" :sortmode="'columns'"
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
                     :height="button_height" @click=""
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
          <JqxButton class="button" ref="buttonClose" @click="closeWindows" :width="120" :height="button_height+'px'"
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
  import JqxSplitter from "@/jqwidgets/jqwidgets-vue/vue_jqxsplitter";
  import JqxExpander from "@/jqwidgets/jqwidgets-vue/vue_jqxexpander";
  import JqxTree from "@/jqwidgets/jqwidgets-vue/vue_jqxtree";
  import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel";
  import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
  import JqxTabs from "@/jqwidgets/jqwidgets-vue/vue_jqxtabs";
  import JqxTreeGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxtreegrid";

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
          {text: 'Уч. скорость, км/ч', datafield: 'line_spd',
            validation: function (cell, value) {
              if (value.toString().length < 2) {
                return { message: "Name should be minimum 4 characters", result: false };
              }
              return true;
            }
          },
          {text: 'Коэф. потр.', datafield: 'koef_potr', editable: false},
          {text: 'Кол-во поездов', datafield: 'trains_amount',
            validation: function (cell, value) {
              if (value.toString().length < 2) {
                return { message: "Name should be minimum 4 characters", result: false };
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
      }
    },

    // Слушатели переменных
    watch: {
      // Отключение кнопки рефреш во время подгрузки
      isLoaded: function () {
      },

      makeLinesListDisableFlag: function () {
        this.$refs.buttonMakeLines.disabled = this.makeLinesListDisableFlag;
      },

    },

    methods: {
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
        this.$refs.linesGrid.updatebounddata();
        this.$refs.stationGrid.updatebounddata();
        this.$refs.selectedGrid.updateBoundData();
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
        t.stationsSource.localdata.filter((item, index) => {
          t.$refs.stationGrid.unselectrow(index);
          // t.$refs.stationGrid.clearselection();
        });
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
            t.$refs.linesGrid.updatebounddata();

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

      // Поиск участков и их добавление в правый грид
      calcUchs(stationsList) {
        let t = this, linesList = "";
        t.isLoaded = false;
        t.$refs.linesGrid.disabled = true;

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
                lines = db.transaction("lines", "readonly").objectStore("lines");

              if (json.rowsAffected > 0) {
                let request = lines.get(json.rows[0].uch_id);

                request.onsuccess = function () {

                  // Выделенный участок
                  let line = request.result;

                  if (!line) {
                    console.log("Отсутствуют список участков в IndexedDB или запись не найдена");
                    return
                  }

                  //let linesCodes = db.transaction("linesCodes", "readonly").objectStore("linesCodes");

                  // Выделенная информация под участок
                  let linesInfo = [];
                  for (let key in json.rows) {
                    // console.log(json.rows[key].kod_gr);  kod_gr  kat_id
                    linesInfo.push(json.rows[key])
                  }

                  //TODO добавление участков в дерево правого грида
                  t.addToSelectedGrid(line, linesInfo);

                  let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                  t.linesSource.localdata.splice(index, 1);
                  t.$refs.linesGrid.clearselection();
                  t.$refs.linesGrid.updatebounddata();


                  //TODO добавление участков в дерево правого грида (по группам локомотивов)
                }
                // Если нет привязки, то ->
              } else {
                for (let key in stationsList) {
                  let r = lines.get(stationsList[key]);

                  r.onsuccess = function () {
                    let line = r.result;
                    t.selectedStationsSource.localdata.push({
                      line_name: line.start_name + " - " + line.end_name,
                      children: [],
                    });

                    let index = t.linesSource.localdata.findIndex((item) => item.uch_id == line.uch_id);
                    t.linesSource.localdata.splice(index, 1);
                    t.refreshAllTables();
                    console.log("Отсутствует привязка к участку", t.selectedRow);
                  }
                }
              }
            }

            t.isLoaded = true;
            t.$refs.linesGrid.disabled = false;
            xmlQuery.destroy();
          },
          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log(ER);
          }
        )
      },

      addToSelectedGrid(line, lineInfo) {
        console.log(lineInfo);
        let t = this;

        // TODO поиск максимального id
          //maxid();

        // Добавление корня
        let obj = {
          line_name: line.start_name + " - " + line.end_name,
          children: [],
        }

        // Поиск уникальных имен локомотивов
        let lokoNameSet = new Set();
        lineInfo.filter((item) => {
          lokoNameSet.add(item.loko_name);
        })

        // Добавление информации по участку
        let i = 0;
        lokoNameSet.forEach((item) => {
          // Добавление локомотивов участка
          obj.children.push({
            line_name: item,
            children: []
          })

          // Информация об участке
          for (let key in lineInfo) {
            if (lineInfo[key].loko_name === item) {
              obj.children[i].children.push({
                line_name: lineInfo[key].kat_id,
                tech_spd: lineInfo[key].v_uch,
                line_spd: lineInfo[key].v_uch,
                koef_potr: 0,
                trains_amount: lineInfo[key].train_count,
                trains_need: 0,
                bak: {
                  trains_amount: lineInfo[key].b_train_count,
                  spd: lineInfo[key].b_v_uch,
                }
              });
            }
          }
          i++;
        })

        t.selectedStationsSource.localdata.push(obj);
        t.$refs.selectedGrid.updateBoundData();
        console.log(t.selectedStationsSource.localdata);
        
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
            t.findLinesInDB();
            // t.calcUchs();
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
      addStation(station, oldId) {

        // добавить в стек
        station.oldId = oldId;


        this.stationsSource.localdata.push(station);
        this.$refs.stationGrid.updatebounddata('cells');

        this.$refs.stationGrid.unselectrow(this.$refs.stationGrid.getselectedrowindex());
        // t.$refs.stationGrid.clearselection();

        if (this.stationsSource.localdata.length > 1) {
          this.makeLinesListDisableFlag = false;
        }
      },

      // Удаление станции по выделению
      deleteStation() {
        console.log(this.$children);
        // let station;
        // station = this.$refs.stationGrid.getrowdata(this.$refs.stationGrid.getselectedrowindex());
        // if (station) {
        //   this.stationsSource.localdata.splice(station.boundindex, 1);
        //   this.$refs.stationGrid.updatebounddata('cells');
        //   if (this.stationsSource.localdata.length < 2) {
        //     this.makeLinesListDisableFlag = true;
        //   }
        // } else {
        //   console.log("Не выбрана станция для удаления");
        // }
        // this.unselectStationGrid();
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

      onTabclick: function (event) {
        localStorage.setItem("TabIndex", event.args.item);
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

      // Окно изменения варианта
      createAddStation() {
        this.$emit('createAddStationWindow', this.id)
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

      this.selectedStationsSource = {
        datafields: [
          {name: 'EmployeeID', type: 'number'},

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
            "EmployeeID": 1,
            "line_name": "Nancy1",
            "tech_spd": "12",
            "line_spd": "12",
            "koef_potr": "0",
            "trains_amount": "123",
            "trains_need": "456",
            "children": [
              {
                "EmployeeID": 2,
                "test": "test",
                "line_name": "Nancy2",
                "tech_spd": "12",
                "line_spd": "12",
                "koef_potr": "0",
                "trains_amount": "123",
                "trains_need": "456",
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
