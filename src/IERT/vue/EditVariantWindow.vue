<template>
    <div>
      <div>
        <transition appear name="fade">
          <JqxWindow :max-height="1999999"
                     :max-width="190000"
                     :min-width="937"
                     :min-height="510"
                     :width="1250"
                     :position="{ x: 150, y: 150 }"
                     :id="id"
                     :theme="theme"
                     @close="closeWindows"
                     v-show="state"
                     :keyboard-close-key="NaN"
                     :ref="'win'"
                     :drag-area="dragArea"
          >

            <!--    Верхний бар-->
            <div ref="header">
              <div>{{ title }}</div>
            </div>


            <div ref="MainContent" style="display: flex; flex-direction: column; padding: 5px; width: 100%; height: 100%">

              <div style="flex: 1 1 auto; margin-bottom: 10px;">
                <JqxSplitter @resize="onResize" style=""
                             :width="'100%'" :height="'100%'" :theme="theme" :splitBarSize="30" :panels="panels">

<!--                  Левая часть окна-->
                  <div>
                    <JqxExpander :theme="theme" :height="'100%'"
                                 :toggleMode="'none'" :showArrow="false" style="padding: 0;" >

                      <div class="jqx-hideborder" style="text-align: center; width: 100%">
                        Выберите участки для расчета
                      </div>

                      <div style="padding: 0;">
                        <JqxTabs ref="myTabs" :theme="theme" :scrollable="false" :enableScrollAnimation="true"
                                  :position="'top'" style="border: none; padding: 0" height="100%"
                                 :animationType="'none'" :selectionTracker='false' @selected="onTabclick($event)">

                          <ul>
                            <li style="margin-left: 10px;">Выбор из списка</li>
                            <li style="margin-right: 10px;">Выбор участка по пути следования</li>
                          </ul>

                          <!--                  Левая вкладка-->
                          <div style="border: none">
                            <Preloader v-if="!isLinesLoaded"/>
                            <JqxGrid v-else style="border: none" ref="linesGrid"
                                     :scrollbarsize="20" :width="'100%'" :height="'100%'"
                                     :columnsmenu="false" :columns="columns" :pageable="false" :autoheight="false"
                                     :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                                     :enabletooltip="true" :columnsautoresize="false" :editable="false"
                                     :selectionmode="'singlerow'" :source="linesSource"
                                     :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                                     @rowdoubleclick="onRowselect($event)"/>
                          </div>

                          <!--                  Правая вкладка-->
                          <div >
                            <div style="display: flex; flex-direction: column; justify-content: space-around;
                                          width: 100%; height: 100%">


                              <div style="flex: 3 1 auto;">
                                <JqxGrid style="border: none; position:relative;" ref="stationGrid"
                                         :height="'100%'"
                                         :width="'100%'" :enablehover="false"
                                         :columnsmenu="false" :columns="stationsColumns" :pageable="false" :autoheight="false"
                                         :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                                         :enabletooltip="true" :columnsautoresize="false" :editable="false"
                                         :selectionmode="'singlerow'" :source="stationsSource"
                                         :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'"
                                         @rowselect="deleteStationToModal($event)" :scrollbarsize="20"/>
                              </div>

<!--                              Buttons right tab-->
                              <div style="flex: 0 0 10px; display: flex; flex-direction: column;">

                                <div style="display: flex; flex-direction: row;">

                                  <div>
                                    <JqxButton ref="buttonAddStations" @click="showModal" :height="button_height+'px'"
                                               :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                                               :theme="theme" style="display : inline-block; margin-left: 5px"
                                    ><span class="nobr">Добавить станцию&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </JqxButton>
                                  </div>

                                  <div>
                                    <JqxButton @click="clearStations" ref="buttonClearStations" :height="button_height+'px'"
                                               :textImageRelation="'imageBeforeText'" :textPosition="'center'"
                                               :theme="theme" style="display : inline-block; margin-right: 8px"
                                    ><span class="nobr">Очистить станции&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </JqxButton>
                                  </div>

                                </div>

                                <div style="width: 100%">
                                  <JqxButton @click="makeLinesList" ref="buttonMakeLines" :height="button_height+'px'"
                                             :textPosition="'center'" style="margin-left: 5px"
                                             :theme="theme" :disabled="true"
                                             value="Сформировать список участков"/>
                                </div>

                              </div>
                            </div>
                          </div>
                        </JqxTabs>
                      </div>
                    </JqxExpander>

                  </div>
<!--                  Правая часть окна-->
                  <div>
                    <JqxExpander :theme="theme"
                                 :width="'100%'" :height="'100%'"
                                 :toggleMode="'none'" :showArrow="false">

                      <div class="jqx-hideborder" style="width: 100%; text-align: center">
                        Выбранные участки
                      </div>

                      <div style="padding: 0;">
                        <Preloader v-if="!isLoaded"/>
                        <jqxTreeGrid v-else style="border: none;"
                                     ref="selectedGrid"
                                     :height="'100%'"
                                     :width="'100%'" @rowBeginEdit="rowEdit($event)" @rowEndEdit="rowEndEdit($event)"
                                     @rowClick="onSelectGridClick($event)" @rowDoubleClick="onSelectGridDClick($event)"
                                     :columnsmenu="false" :columns="selectedStationsColumns" :pageable="false"
                                     :autoheight="false" :rendered="rendered"
                                     :sortable="true" :altRows="true" :columnsResize="true" :showfilterrow="true"
                                     :enabletooltip="true" :columnsautoresize="false" :editable="true"
                                     :selectionMode="'custom'" :source="selectedStationsSource" :editSettings="editSettings"
                                     :theme="theme" :filterable="true" :filterMode="'advanced'" :sortmode="'columns'"
                                     :scrollBarSize="20"/>
                      </div>
                    </JqxExpander>
                  </div>

                </JqxSplitter>
              </div>

              <!--      Нижнее меню -->
              <div style="border-style: solid; border-width: 1px; border-color: rgb(221,221,221);
                          display: flex; flex-direction: row; align-items: center; justify-content:
                          space-around; height: 50px">

                <div id="lowerMenu" style="flex: 1 1 auto; display: flex; flex-direction: row; justify-content: space-around">
                  <!--          style all: cursor: pointer; -->
                  <JqxButton ref="createWindowAddStation"
                             @click="saveSelectedLines"
                             :textPosition="'center'"
                             :theme="theme" :height="button_height+'px'" :value="'&nbsp;Сохранить&nbsp;'"
                             style="margin: 0 2px 0 4px" :width="'120px'"/>

                  <JqxButton ref="buttonClear"
                             @click="clearLines"
                             :textPosition="'center'"
                             :theme="theme" :height="button_height+'px'" :value="'&nbsp;Очистить выбранные участки&nbsp;'"
                             style="margin: 0 2px 0" :width="'220px'"/>
                </div>

                <div style="flex: 1 1 200px; display: flex; flex-direction: row; justify-content: flex-end">
                  <div style="flex: 2 1 auto"/>
                  <div style="flex: 1 1 auto;">

                    <JqxButton ref="buttonClose"
                               @click="closeWindows"
                               :textPosition="'center'" :width="'120px'"
                               :theme="theme" :height="button_height+'px'" :value="'&nbsp;Закрыть&nbsp;'"
                               style="margin: 0 4px 0 2px"/>
                  </div>
                </div>
              </div>
            </div>
          </JqxWindow>
        </transition>
      </div>

      <div>
        <AddStation ref="modal" :parentWindow="this" :title="'Добавление путей по станциям'"
                    :locStations="locStations" :id="id" @station-deleted="addStation" :theme="theme"
                    :dragArea="dragArea">
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
import Preloader from "@/IERT/vue/Preloader";
import JqxSplitter from "@/jqwidgets/jqwidgets-vue/vue_jqxsplitter";
import JqxExpander from "@/jqwidgets/jqwidgets-vue/vue_jqxexpander";
import JqxTree from "@/jqwidgets/jqwidgets-vue/vue_jqxtree";
import JqxPanel from "@/jqwidgets/jqwidgets-vue/vue_jqxpanel";
import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
import JqxTabs from "@/jqwidgets/jqwidgets-vue/vue_jqxtabs";
import JqxTreeGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxtreegrid";
import AddStation from "@/IERT/vue/AddStation";

export default {
  components: {
    JqxWindow,
    JqxButton,
    JqxGrid,
    Preloader,
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
  props: ["id", "title", "closeWindows", "state", "row", "stations", "theme", "dragArea"],
  data() {
    return {
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
            return true
            let isDigitFlag = true;
            if (value.toString().length < 1) {
              return {message: "Поле должно содерджать хотя бы 1 символ", result: false};
            }

            // Формат " (/!обязательно/одна или более цифра) (точка) (ноль или более цифр)"
            let regexp = /^\d+\.*\d*$/;

            if (value.match(regexp) === null) {
              return {message: "Введено не числовое значение", result: false}
            }

            console.log();

            // for (let key in value) {
            //   if (value[key])
            //   console.log(key, value[key]);
            // }


            return true;
          }
        },
        {text: 'Коэф. потр.', datafield: 'koef_potr', editable: false},
        {
          text: 'Кол-во поездов', datafield: 'trains_amount',
          validation: function (cell, value) {
            return true
            if (value.toString().length < 1) {
              return {message: "Name should be minimum 1 characters", result: false};
            }
            return true;
          }
        },
        {text: 'Потребность лок.', datafield: 'trains_need', editable: false},
        {
          text: 'Сброс',
          cellsAlign: 'center',
          width: 150,
          align: "center",
          columnType: 'none',
          editable: false,
          sortable: false,
          dataField: null,
          disabled: false,
          cellsRenderer: (row, column, value) => {
            if (this.$refs.selectedGrid && this.$refs.selectedGrid.getRow(row).level === 2) {
              return "<div style='display: inline-block; margin: 0 auto;' data-row='" + row + "' class='resetButton'></div>";
            }
          },
        }
      ],

      linesDataAdapter: new jqx.dataAdapter(this.linesSource),
      stationsDataAdapter: new jqx.dataAdapter(this.stationsSource),
      selectedStationsDataAdapter: new jqx.dataAdapter(this.selectedStationsSource),

      panels: [{size: '50%', min: 344, collapsible: false}, {min: 226, size: '50%', collapsible: false}],
      gsVar: null,
      selectedRow: null,
      stationsList: [],
      deletedStationsStack: [],
      makeLinesListDisableFlag: true,
      deletedLine: null,
      locStations: this.stations,
      isLoco: false,
      editSettings: {
        saveOnPageChange: true,
        saveOnBlur: true,
        saveOnSelectionChange: true,
        cancelOnEsc: true,
        saveOnEnter: true,
        editOnDoubleClick: true,
        editOnF2: false
      },
      outSource: [],
      oneRowChanged: false,
      savedRow: {},
    }
  },

  // Вычисляемые переменные
  computed: {
    // геттер вычисляемого значения
    disableMakeList: function () {
      // console.log(!(!this.makeLinesListDisableFlag && this.isLinesLoaded));
      return !(!this.makeLinesListDisableFlag && this.isLinesLoaded)
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

    disableMakeList: function () {
      this.$refs.buttonMakeLines.disabled = this.disableMakeList;
    },

    theme: function () {
      console.log(this.theme);
      this.$refs.win.theme = this.theme;
    }

  },

  methods: {
    // Добавить измененную строку в sourceOut, если ее там еще нет
    addRowToSourceOut(row) {
      if (!this.outSource.includes(row)) {
        console.log("Adding row to outSource");
        this.outSource.push(row);
      }
    },

    findLineInSelectedGrid(uid) {
      let source = this.selectedStationsSource.localdata;

      for (let line in source) {
        for (let loco in source[line].children) {
          for (let uch in source[line].children[loco].children) {
            if (source[line].children[loco].children[uch].uid === uid) return source[line].children[loco].children[uch]
          }
        }
      }
      return undefined
    },

    resetRow(e) {
      let lineUid = e.currentTarget.parentElement.parentElement.dataset.key;

      let row = this.findLineInSelectedGrid(lineUid);

      if (!row) {
        console.log("Не удалось сбросить строку, ", row, lineUid);
      }

      if (row.line_spd !== row.lineInfo.b_v_uch || row.trains_amount !== row.lineInfo.b_train_count) {
        row.line_spd = row.lineInfo.b_v_uch;
        row.trains_amount = row.lineInfo.b_train_count;
        this.calcRow(row);
        if (this.$refs.selectedGrid) this.$refs.selectedGrid.updateRow(row.uid, row);
        this.addRowToSourceOut(row);
        console.log("reset row", row);
      }
    },

    deleteLineFromSelectedGrid(row) {
      if (row.level === 0) {
        // Поиск и удаление всех дорог по удаляемому участку из outSource
        row.children.forEach((item) => {
          item.children.forEach(line => {
            let isBeenInSourceOut = this.outSource.findIndex((v) => {
              return v.lineInfo.uch_id === line.lineInfo.uch_id;
            })
            if (isBeenInSourceOut !== -1) {
              this.outSource.splice(isBeenInSourceOut, 1)
            }
          })
        })

        let deletedRow = this.selectedStationsSource.localdata.splice(row.uid, 1)[0];
        console.log(row);
        console.log(deletedRow);
        this.addLine(deletedRow.line);
        this.refreshSelectedLinesGrid();
      }
    },

    onSelectGridDClick(e) {
      let row = e.args.row;
      this.deleteLineFromSelectedGrid(row);
    },

    onSelectGridClick(e) {
      let row = e.args.row, t = this;

      if (row.level === 2) {
        // this.$refs.selectedGrid.beginRowEdit(row.uid);
      } else {
        if (!row.expanded) {
          this.$refs.selectedGrid.expandRow(e.args.key);
        } else {
          this.$refs.selectedGrid.collapseRow(e.args.key);
        }
      }


    },

    // Смена правого тригрид (участок/локомотив)
    changeTreeGrid() {
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

    // Подготовка данных для отправки на сервер
    prepareSoruceOut() {
      let outArr = [];

      if (this.outSource.length > 0) {
        this.outSource.forEach(function (item) {
          outArr.push({
            'uch_id': item.lineInfo.uch_id,
            'kod_gr': item.lineInfo.kod_gr,
            'kat_id': item.lineInfo.kat_id,
            'v_uch' : item.line_spd,
            'train_count': item.trains_amount
          });
        })
        console.log("Строки для сохранения: ", this.outSource);
        this.outSource = [];
        return JSON.stringify(outArr);
      }
    },

    // Сохранение изменений участков
    saveSelectedLines() {
      let t = this;

      // Загрузка участков
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "SAVE_UCH_DATA"
      });

      let out = this.prepareSoruceOut();

      if (!out) return

      xmlQuery.clearFilter();
      xmlQuery.setFilter("JSON_ARR", out, "text");

      xmlQuery.query('json',
          function () {
            console.log("Данные успешно сохранены");
            xmlQuery.destroy();
          },

          function (ER) {
            xmlQuery.destroy();
            console.log("Error save data");
            console.log(ER);
          }
      )

    },

    // Вычисление значений строки по формуле
    calcRow(row) {
      if (row && row.editable) {
        row.tech_spd = (Math.round(row.line_spd / row.lineInfo.v_prop * 1000) * 0.001).toFixed(1);
        row.koef_potr = (Math.round((row.lineInfo.t_prost + row.lineInfo.len / row.line_spd) / 24 * 1000) * 0.001).toFixed(3);
        row.trains_need = (Math.round(row.trains_amount * ((row.lineInfo.t_prost + row.lineInfo.len / row.line_spd) / 24) * 1000) * 0.001).toFixed(3);
      }
      return row
    },

    isDigit(string) {
      // Формат " (/!обязательно/одна или более цифра) (точка) (ноль или более цифр)"
      let regexp = /^\d+\.*\d*$/;
      return string.match(regexp) !== null;
    },

    // Конец редактирования строки
    rowEndEdit(e) {
      let row = e.args.row;
      if (this.savedRow && row && row.level === 2) {
        // Reset значений, если введены неформатные данные (формат указан в isDigit)
        if (!this.isDigit(row.line_spd) || !this.isDigit(row.trains_amount)) {
          if (!this.isDigit(row.line_spd)) row.line_spd = this.savedRow.line_spd;
          if (!this.isDigit(row.trains_amount)) row.trains_amount = this.savedRow.trains_amount;
        }
        this.calcRow(row);
        if ((row.line_spd != this.savedRow.line_spd) || (row.trains_amount != this.savedRow.trains_amount) ) {
          row.changed = true;
          this.addRowToSourceOut(row);
          // TODO выключение кнопки сохранения, если данные не изменены, подумать на реализацией
          this.oneRowChanged = true;
        }
      }
    },

    // disable non-editable rows
    rowEdit(e) {
      if (e.args.row && !e.args.row.editable) {
        this.$refs.selectedGrid.endRowEdit(0, true);
      }
      else {
        if (e.args.row) {
          this.savedRow = {line_spd: e.args.row.line_spd, trains_amount: e.args.row.trains_amount}
        }
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
            endNameA = a.end_name,
            endNameB = b.end_name,
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
          if (nameA === nameB) {
            if (endNameA > endNameB)
              return 1
            if (endNameA < endNameB)
              return -1
          }
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

    // Одиночное добавление участка в правый грид
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

    // Очистка правого грида
    clearLines(bool) {
      let rows = this.$refs.selectedGrid.getRows();
      if (rows.length === 0) return ;
      this.isLoaded = false;
      setTimeout(() => {

        for (let key in rows) {
          rows[key].uid = 0;
          let deletedRow = this.selectedStationsSource.localdata.splice(rows[key].uid, 1)[0];
          this.addLine(deletedRow.line);

        }
        this.refreshSelectedLinesGrid();
        this.outSource = [];
        if (bool) this.isLoaded = true;
      }, 0)
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
            if (json.UCH.length === 0) {
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
            t.linesSource.localdata = json.UCH;
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
              // lines.clear();

              let obj;

              for (let i = 0; i < json.UCH.length; i++) {
                obj = {
                  uch_id: json.UCH[i].uch_id,
                  start_stan: json.UCH[i].start_stan,
                  start_name: json.UCH[i].start_name,
                  end_stan: json.UCH[i].end_stan,
                  end_name: json.UCH[i].end_name,
                  exist_in_cdl: json.UCH[i].exist_in_cdl,
                }
                let addT = lines.add(obj);

                addT.onerror = function () {
                  // console.log("Ошибка добавления участка в db, ", obj);
                }
              }
              transaction.oncomplete = function () {
                console.log("Участки обновлены");
              };
              transaction.onerror = function () {
                if (event.target.error.name === "ConstraintError") {
                  // console.log("Станция с таким id уже существует, ", obj); // обрабатываем ошибку
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

              for (let i = 0; i < json.KOD_GR.length; i++) {
                obj = {
                  kod_gr: json.KOD_GR[i].kod_gr,
                  name: json.KOD_GR[i].name,
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

              for (let i = 0; i < json.VID_URLB.length; i++) {
                obj = {
                  vid_uch: json.VID_URLB[i].vid_uch,
                  sname_vid: json.VID_URLB[i].sname_vid,
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
            // console.log(json.rows);

            let r = t.$parent.connectDB();

            r.onsuccess = function () {

              let db = r.result,
                  linesCodesTR = db.transaction("linesCodes", "readonly"),
                  linesCodes = linesCodesTR.objectStore("linesCodes");

              if (json.UCH.length > 0) {

                let linesSet = new Set(),
                    locoSet = new Set(),
                    linesArr = [],
                    locoArr = [],
                    lineInfoArr = [];

                stationsList.forEach(function (item) {
                  linesSet.add(item);
                })

                json.UCH.forEach(function (item, i, arr) {
                  lineInfoArr.push({index: i, info: item});
                  linesSet.add(item.uch_id);
                  locoSet.add(item.kod_gr);

                  let lineCodesR = linesCodes.get(item.kat_id);

                  lineCodesR.onsuccess = function () {
                    try {
                      item.kat_id_name = lineCodesR.result.sname_vid;
                    } catch (e) {
                      item.kat_id_name = NaN;
                      console.warn("Не найдена расшифровка кода дороги для ", item);
                    }
                  }
                  lineCodesR.onerror = function () {
                    console.log("Ошибка чтения lineCode", item);
                  }

                });

                linesCodesTR.oncomplete = function () {

                  let linesTR = db.transaction("lines", "readonly"),
                      lines = linesTR.objectStore("lines");

                  // console.log(linesSet);

                  linesSet.forEach(function (item) {
                    let linesR = lines.get(item);
                    // console.log(item);

                    linesR.onsuccess = function () {
                      // console.log(linesR);
                      linesArr.push({uch_id: item, line: linesR.result});
                    }
                    linesR.onerror = function () {
                      console.log("Не удалось найти линию по айди, ", item);
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
                      // if (t.addToSelectedGrid(linesArr, json.rows, locoArr)) {
                      //   // t.isLoaded = true;
                      //   setTimeout(() => {
                      //     console.log(t.$refs.selectedGrid.getRows());
                      //   }, 0)
                      //   console.log();
                      // }

                      t.addToSelectedGrid(linesArr, json.UCH, locoArr);



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

              } else {
                console.log("Нет привязок к станции");
                t.isLoaded = true;
                // Включение грида с участками
                if (t.$refs.myTabs.selectedItem === 0 || t.$refs.myTabs.selectedItem === "0") {
                  t.$refs.linesGrid.disabled = false;
                }
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

    addLine(line) {
      let t = this;
      t.linesSource.localdata.push(line);
      t.linesSort();
      t.unselectLinesGrid();
      t.refreshLinesGrid();
    },

    deleteLine(uch_id) {
      let t = this;
      // Удаление строчки из левого грида
      let index = t.linesSource.localdata.findIndex((item) => {
        return item.uch_id === uch_id;
      });

      if (index === -1) return

      t.linesSource.localdata.splice(index, 1);
      t.unselectLinesGrid();
      t.refreshLinesGrid();
    },

    // Добавление в правый грид
    addToSelectedGrid(lines, lineInfo, locos) {
      let t = this;

      // console.log(lines);
      // console.log(lineInfo);
      // console.log(locos);


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
            // console.log("added to loco set ", item.info.loko_name);
            lokoNameSet.add(item.loko_name);
          }
        })
        secondChildrens = [];
        lokoNameSet.forEach(function (locoName) {
          thirdChildrens = [];
          lineInfo.filter((item) => {
            if (item.uch_id === lineCode.uch_id && item.loko_name === locoName) {
              thirdChildrens.push(t.calcRow({
                line_name: item.kat_id_name,
                tech_spd: 0,
                line_spd: item.v_uch,
                koef_potr: 0,
                trains_amount: item.train_count,
                trains_need: 0,
                lineInfo: item,
                editable: true,
                changed: false,
              }))
            }
          })
          secondChildrens.push({line_name: locoName, editable: false, children: thirdChildrens});
        })

        stationObj = {
          line_name: lineCode.line.start_name + " - " + lineCode.line.end_name,
          root: true,
          line: lineCode.line,
          uch_id: lineCode.uch_id,
          editable: false,
          children: secondChildrens,
        }

        t.selectedStationsSource.localdata.push(stationObj);

        t.deleteLine(lineCode.uch_id);

      })
      t.refreshSelectedLinesGrid();

      t.isLoaded = true;

      // Переход к добавленному элементу
      if (lines.length === 1) {
        setTimeout(() => {
          t.$refs.selectedGrid.ensureRowVisible(t.$refs.selectedGrid.getRows().length-1);
        }, 0)
      }

      // TODO По локомотивам

    },

    // Формирование списка участков по пути следования
    makeLinesList() {
      let t = this, stationsList = "";

      t.clearLines(false);
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
            if (json.UCH.length < 1) {
              console.log("Отсутствуют участки между данными станциями");
              t.isLoaded = true;
              return
            }

            json.UCH.filter(function (item) {
              t.stationsList.push(item.uch_id);
            })
            t.calcUchs(t.stationsList);
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
      let t = this;
      for (let i = this.stationsSource.localdata.length - 1; i >= 0; i--) {
        let tmp = {args: {}};
        tmp.args.rowindex = i;
        t.deleteStationToModal(tmp);
      }
      t.refreshStationsGrid();
      this.makeLinesListDisableFlag = true;

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
      // console.log($event);
      this.selectedRow = this.linesSource.localdata[$event.args.row.boundindex];
      this.selectLine($event.args.row.bounddata);
    },

    // Рендер кнопок сброса
    rendered() {
      let t = this;

      if ($(".resetButton").length > 0) {

        jqwidgets.createInstance('.resetButton', 'jqxButton', {
              width: 85,
              // height: 24,
              value: 'Сбросить&nbsp;&nbsp;',
              theme: this.theme,
            });

        $(".resetButton").click(function(e){
          t.resetRow(e);
        });
      }


        // $(".resetButton").forEach(item => {
        //   item.addEventListener("click", event => {
        //     console.log(1232131);
        //   })
        // })

      //   // console.log($(".resetButton"));
      //   let uglyEditButtons = jqwidgets.createInstance('.resetButton', 'jqxButton', {
      //     width: 85,
      //     // height: 24,
      //     value: 'Сбросить&nbsp;&nbsp;',
      //     theme: this.theme,
      //   });
      //
      //   console.log(uglyEditButtons);
      //
      //   let flattenEditButtons = [];
      //   if (!Array.isArray(uglyEditButtons)) {
      //     uglyEditButtons = [uglyEditButtons];
      //   }
      //   uglyEditButtons.forEach(item => {
      //     item.this = this;
      //   })
      //
      //   flattenEditButtons = flatten(uglyEditButtons);
      //
      //   console.log(flattenEditButtons);
      //
      //
      //   // if (!Array.isArray(toFlatten)) {
      //   //   toFlatten.addEventHandler('click', event => {
      //   //     console.log(toFlatten);
      //   //     console.log(flat);
      //   //     toFlatten.this.resetRow(event);
      //   //   });
      //   // }
      //
      //   // console.log(flattenEditButtons);
      //
      //   // flattenEditButtons.forEach((item) => {
      //   //
      //   //   console.log("addEventHandler, ", item);
      //   //   item.addEventHandler('click', event => {
      //   //             // console.log('click reset button');
      //   //             this.resetRow(event);
      //   //     });
      //   // })


      // Добавление кнопок в массив, привязка слушателей
      function flatten(arr) {
        if (arr.length) {
          return arr.reduce((flat, toFlatten) => {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
          }, []);
        }
      }


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
        // {
        //   "line_name": "Nancy1",
        //   "tech_spd": "12",
        //   "line_spd": "12",
        //   "koef_potr": "0",
        //   "trains_amount": "123",
        //   "trains_need": "456",
        //   "children": [
        //     {
        //       "test": "test",
        //       "line_name": "Nancy2",
        //       "tech_spd": "12",
        //       "line_spd": "12",
        //       "koef_potr": "0",
        //       "trains_amount": "123",
        //       "trains_need": "456",
        //       "editable": true,
        //     },
        //   ]
        // },
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

  beforeDestroy() {
    this.$refs.win.destroy();
    //todo destroy all elems
  }
}
</script>


<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

</style>
