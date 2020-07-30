<template>
  <div
    v-bind:style="{ 'background-image': 'url('  + ')','background-repeat': 'no-repeat', 'width': '100%',
     'height': '100%', 'top': '0', 'left': '0', 'overflow': 'hidden'}">
    <JqxMenu ref="Menu" style="height: 30px; border-radius: 0;" :theme="theme" v-bind:style="{'position': 'relative'}">
      <ul>

        <li v-on:click="addListWindow({type: 'MainWindow',
            title: 'Перечень вариантов расчета перспективной потребности локомотивов'})" :style="{
              'display': 'inline-block', 'height': '25px', 'left':'0px', 'cursor':'pointer', 'text-align':'left'}"
        > Варианты расчетов перспективной потребности
        </li>
      </ul>
    </JqxMenu>
    <div ref="main" :style="{'height': mainDivSize + 'px'}" id="main-page">
      <component v-for="window in windows" :is="window.type" :row="window.row" :title="window.title" :id="window.id"
                 v-bind:key="window.id" :closeWindows="() => removeWindow(window.id)" :state="window.state"
                 @MainWindowTableChange="MainWindowTableChange" :sourcePP="mainWindowSource"
                 @workVariantCreateWindow="createWindowEditVariant" :parentWindow="window.parentWindow"
                 @createAddStationWindow="createWindowAddStation"  :stations="stations"/>
    </div>
    <!--    @RowSelect="RowSelect"-->
    <JqxToolbar ref="TollBar" :theme="theme"/>
  </div>
</template>

<script>
  import * as backgroundUrl from "@/public/img/background.jpg"
  import "@/style/jqx.base.css"
  import "@/style/jqx.ext.css"
  import JqxToolbar from "@/jqwidgets/jqwidgets-vue/vue_jqxtoolbar";
  import JqxMenu from "@/jqwidgets/jqwidgets-vue/vue_jqxmenu";
  import JqxButtons from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
  import appConfig from "@/IERT/js/appConfig";
  import MainWindow from "@/IERT/vue/windows/MainWindow/MainWindow";
  import NewVariantWindow from "@/IERT/vue/NewVariantWindow";
  import EditVariantWindow from "@/IERT/vue/EditVariantWindow";
  import AddStation from "@/IERT/vue/windows/AddStation/AddStation";
  import XmlQuery from "@/IERT/js/xmlQuery";

  export default {
    name: "MainApp",
    components: {
      JqxToolbar,
      JqxMenu,
      JqxButtons,
      MainWindow,
      NewVariantWindow,
      EditVariantWindow,
      AddStation,
    },

    data() {
      return {
        backgroundUrl: backgroundUrl,
        theme: appConfig.menuTheme,
        mainDivSize: document.documentElement.clientHeight - 75,
        windows: [],
        id: {},
        count: 0,
        mainWindowSource: {},
        stations: [],
        station: null,
      }
    },

    mounted() {
      this.$refs.Menu.setOptions({
        width: "100%",
        height: 30,
        animationShowDuration: 0,
        animationHideDuration: 0,
        animationShowDelay: 0,
        autoOpen: true,
        showTopLevelArrows: true,
      });
      this.$refs.TollBar.setOptions({
        width: '100%',
        height: 45,
        initTools: function (type, index) {
        }
      });
      window.addEventListener('resize', this.updateSizeApp);
    },

    destroyed() {
      window.removeEventListener('resize', this.updateSizeApp)
    },

    methods: {

      findWindowInArr(id) {
        for (let key in this.$children) {
          if (this.$children[key].id === id) {
            return this.$children[key].$children[0]
          }
        }
      },

      connectDB() {
        let t = this, db;
        let openRequest = indexedDB.open("storage", 1);
        // проверить существование указанной версии базы данных, обновить по мере необходимости:
        openRequest.onupgradeneeded = function () {
          db = openRequest.result;
          switch (db.version) { // существующая (старая) версия базы данных
            case 0:
              // версия 0 означает, что на клиенте нет базы данных
              console.log("no db");
            case 1:
              // на клиенте версия базы данных 1
              if (!db.objectStoreNames.contains('stations')) { // if there's no "books" store
                db.createObjectStore('stations', {keyPath: 'stan_id'});
                db.createObjectStore('lines', {keyPath: 'uch_id'});
                console.log("created db, version = " + db.version);
              }
          }
        };
        openRequest.onblocked = function () {
          console.warn("Warn", "Невозможно закрыть другое подключение к базе данных");
        };
        openRequest.onerror = function () {
          console.error("Error", t.request.error);
        };
        return openRequest;
      },

      // Загрузка списка станций
      loadStations() {
        let t = this;
        t.isLoaded = false;

        // Загрузка участков
        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
          querySet: "LOAD_STAT"
        });

        xmlQuery.clearFilter();
        xmlQuery.setFilter("YEAR", 0, "text");

        xmlQuery.query('json',
          function (json) {
            t.stations = json.rows;

            let openRequest = t.connectDB();
            // Загрузка станций в IndexedDB
            openRequest.onsuccess = function () {
              let db = openRequest.result;
              // продолжить работу с базой данных, используя объект db
              db.onversionchange = function () {
                db.close();
                alert("База данных устарела, пожалуста, перезагрузите страницу.")
              };
              let transaction = db.transaction("stations", "readwrite");
              let stations = transaction.objectStore("stations");
              stations.clear();

              let obj;

              for (let i = 0; i < json.rows.length; i++) {
                obj = {
                  dor_kod: json.rows[i].dor_kod,
                  esr: json.rows[i].esr,
                  mnem: json.rows[i].mnem,
                  name: json.rows[i].name,
                  sname: json.rows[i].sname,
                  stan_id: json.rows[i].stan_id,
                }
                stations.put(obj);
              }
              transaction.oncomplete = function () {
                console.log("Станции обновлены");
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

      // Изменение списка вариантов
      MainWindowTableChange(data) {
        this.mainWindowSource = data;
      },

      // Обновление всех MainWindow при изменении данных в таблице
      refreshAllMainWindows() {
        for (let i in this.$children) {
          if (this.$children[i].$options._componentTag === "MainWindow") {
            this.$children[i].updateGridFromURL();
          }
        }
      },

      // Создание окна "создание нового варианта"
      createWindowNewVariant() {
        this.addListWindow({type: 'NewVariantWindow', title: "Создание нового варианта"});
      },

      // Создание окна изменения
      createWindowEditVariant(id, row) {
        if (row !== -1) {
          this.addListWindow(
            {
              type: 'EditVariantWindow', title: "Работа с вариантом " + row.var_name + ", " +
                row.var_year + " г.", row: row,
            });
        } else {
          console.log("Не выбран пункт в таблице, ошибка изменения варианта");
        }
      },

      createWindowAddStation(mainWinId) {
        this.addListWindow({type: 'AddStation', title: "Добавление путей по станциям", parentWindow: this.findWindowInArr(mainWinId)})
      },

      // Изменить опции создания окна
      updateWindowCreateOptions(old_options, added_options) {
        if (added_options && added_options !== 0) {
          for (let key in added_options) {
            if (old_options.hasOwnProperty(key)) {
              old_options[key] = added_options[key];
            } else {
              old_options[key] = added_options[key];
            }
          }
        }
        return old_options
      },

      removeWindow(id) {
        console.log("Window with id = " + id + " closed");
        this.findWindowInArr(id).close();
        this.$refs.TollBar.destroyTool(this.id[id]);
        this.windows.splice(this.id[id], 1)
        this.id = {};
        this.windows.forEach((value, index) => this.id[value.id] = index)
      },

      updateSizeApp: function () {
        this.mainDivSize = document.documentElement.clientHeight - 75;
      },

      addListWindow: function (added_options) {
        let id = "win" + JQXLite.generateID(), vue = this;
        let option = {
          id: id,
          type: 'MainWindow',
          title: 'Прогресс ' + ++this.count,
          state: true,
          close: () => {
            vue.removeWindow(id)
          },
          changePosition: () => vue.windows[vue.id[id]].state = !vue.windows[vue.id[id]].state,
          mainWindowRow: -1,
        }
        option = this.updateWindowCreateOptions(option, added_options);
        this.id[id] = this.windows.length;
        this.windows.push(option);
        this.$refs.TollBar.addTool('custom', 'last', false, (type, tool) => {
          tool.html('<div class="toolbar-main-button-style"><ul class="list-class-style"><li><div><p class="toolbar-text-style">' + option.title + '</p></div></li><li><img class="toolbar-close-button-style" alt=""/></li></ul></div>')
            .css("cursor", "pointer").on('click', option.changePosition).find('img').on("click", option.close);
        });
        // this.windows[0].type = "WorkVariant";
      }
    },

    created() {
      this.loadStations();
    }

  }
</script>

<!--505 ширина окна миниммум-->

<style>

  .toolbar-main-button-style {
    border-radius: 20px;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #99BCE8;
    background-color: #5c97cf;
    line-height: 0;
  }

  .toolbar-main-button-style:hover {
    background-color: #04408C;
    border: 1px solid #99BCE8;
  }

  .toolbar-text-style {
    font-size: 19px;
    height: 25px;
    max-height: 25px;
    margin: 0;
    color: white;
    line-height: 0;
  }

  .toolbar-text-style:hover {
    color: white;
  }

  .toolbar-close-button-style {
    width: 16px;
    height: 16px;
    margin-top: 5px;
    border: none;
    background-image: url('style/images/close_white.png') !important;
  }

  .toolbar-close-button-style:hover {
    background-color: black;
    border: none;
    background-image: url('style/images/close_white.png') !important;
  }

  .list-class-style {
    line-height: 0;
    display: block;
    margin: 0;
    padding-inline-start: 0;
    max-height: 20px;
  }

  ul.list-class-style li {
    display: inline-block;
    margin: 0 5px;
  }
</style>


<!-- Указать в лицензии

Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>


-->
