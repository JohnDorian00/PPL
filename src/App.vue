<template>
  <div>
    <JqxMenu :key="menuKey" ref="Menu" :theme="theme"
             :show-top-level-arrows="false" :popup-z-index="999999">
      <!--      @changeTheme="changeTheme($event)"-->
      <ul style="display: flex; flex-direction: row;
              justify-content: space-between;">

        <li @click="addListWindow({type: 'MainWindow',
            title: 'Перечень вариантов расчета перспективной потребности локомотивов'})"
        > Варианты расчетов перспективной потребности
        </li>

        <li style="margin-right: 50px">Смена темы
            <ul style="padding-left: 0; width: 120px;">
              <div class="changeTheme">
                <li @click="changeTheme('base')">base</li>
                <li @click="changeTheme('bootstrap')">bootstrap</li>
                <li @click="changeTheme('classic')">classic</li>
                <li @click="changeTheme('dark')">dark</li>
                <li @click="changeTheme('energyblue')">energyblue</li>
                <li @click="changeTheme('ext')">ext</li>
                <li @click="changeTheme('glacier')">glacier</li>
                <li @click="changeTheme('highcontrast')">highcontrast</li>
                <li @click="changeTheme('light')">light</li>
                <li @click="changeTheme('material')">material</li>
                <li @click="changeTheme('material-green')">material-green</li>
                <li @click="changeTheme('material-purple')">material-purple</li>
                <li @click="changeTheme('metro')">metro</li>
                <li @click="changeTheme('metrodark')">metrodark</li>
                <li @click="changeTheme('office')">office</li>
                <li @click="changeTheme('summer')">summer</li>
                <li @click="changeTheme('ui-lightness')">ui-lightness</li>
                <li @click="changeTheme('leaflet')">leaflet</li>
              </div>
            </ul>
        </li>


      </ul>
    </JqxMenu>

    <div ref="main" :style="{'height': mainDivSize + 'px'}" id="main-page">
      <component ref="win" v-for="window in windows" :is="window.type" :row="window.row" :title="window.title" :id="window.id"
                 :key="window.id" :closeWindows="window.closeWindow" :state="window.state"
                 @MainWindowTableChange="MainWindowTableChange" :sourcePP="mainWindowSource" :theme="window.theme"
                 @workVariantCreateWindow="createWindowEditVariant" :parentWindow="window.parentWindow"
                 :stations="stations" :dragArea="dragArea"/>
    </div>
    <!--    @RowSelect="RowSelect"-->
    <JqxToolbar ref="TollBar" :theme="theme"/>
  </div>
</template>

<script>
import JqxToolbar from "@/jqwidgets/jqwidgets-vue/vue_jqxtoolbar";
import JqxMenu from "@/jqwidgets/jqwidgets-vue/vue_jqxmenu";
import JqxButtons from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
import appConfig from "@/IERT/js/appConfig";
import MainWindow from "@/IERT/vue/MainWindow";
import NewVariantWindow from "@/IERT/vue/NewVariantWindow";
import EditVariantWindow from "@/IERT/vue/EditVariantWindow";
import AddStation from "@/IERT/vue/AddStation";
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
      theme: 'light',
      mainDivSize: document.documentElement.clientHeight - 79,
      windows: [],
      id: {},
      count: 0,
      mainWindowSource: {},
      stations: [],
      station: null,
      menuKey: JQXLite.generateID(),
      dragArea: {},
    }
  },

  methods: {
    // Смена темы
    changeTheme(theme) {
      // if (!confirm("Несохраненные данные будут потеряны, свернутые окна будут закрыты. Вы уверены?")) return
      this.theme = theme;

      // Обнуление
      this.id = {};
      let len = this.$refs.TollBar.getTools().length;
      for (let i=0; i<len; i++) {
        this.$refs.TollBar.destroyTool(0);
      }

      this.$refs.Menu.minimize();
      this.$refs.Menu.theme = this.theme;
      this.menuKey = "menu" + JQXLite.generateID();

      this.$refs.TollBar.theme = this.theme;

      // Смена темы окон
      this.windows.forEach((item, index) => {
        let wasMinimized = false;

        if (!item.state) {
          item.state = true;
          wasMinimized = true;
          item.DEL = true;
        }

        item.id = "win" + JQXLite.generateID();
        this.id[item.id] = index;
        item.theme = this.theme;

        item.closeWindow = (e) => {
          if (e.type === "close")
            item.state = true;
          else
            item.state = e.currentTarget.tagName === "IMG";
          setTimeout(() => {this.removeWindow(item.id)}, 100);
        },
        item.changePosition = () => {
          this.minimizeWindow(item.id);
        },

        this.$refs.TollBar.addTool('custom', 'last', true, (type, tool) => {
          tool.jqxToggleButton({toggled: !wasMinimized, theme: this.theme});
          tool.text(item.title);
          tool.append('<img src="./src/public/img/close_white.png" class="toolbar-close-button-style" style="margin: auto auto auto 10px; float: right;" alt=""/>');
          tool.on('click', item.changePosition);
          tool.css("cursor", "pointer").find('img').on("click", {id: item.id}, item.closeWindow);
        });

        if (wasMinimized) item.state = false;

      })

      len = this.windows.length;
      // Закрытие свернутых окон
      for (let i=0; i<len; i++) {
        this.windows.forEach(item => {
          if (item.DEL) item.close();
        })
      }
    },

    // Поиск окна в списке окон (по window.id)
    findWindowInArr(id) {
      for (let key in this.$children) {
        if (this.$children[key].id === id) {
          return this.$children[key].$children[0]
        }
      }
    },

    // Подключение к бд storage
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
            if (!db.objectStoreNames.contains('stations')) {
              db.createObjectStore('stations', {keyPath: 'stan_id'});
              let lines = db.createObjectStore('lines', {keyPath: 'uch_id'});
              lines.createIndex('OrderByName', 'start_name');
              db.createObjectStore('linesCodes', {keyPath: 'vid_uch'});
              db.createObjectStore('locoCodes', {keyPath: 'kod_gr'});
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
            // t.stations = json.rows;
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

              for (let i = 0; i < json.STAN.length; i++) {
                obj = {
                  dor_kod: json.STAN[i].dor_kod,
                  esr: json.STAN[i].esr,
                  mnem: json.STAN[i].mnem,
                  name: json.STAN[i].name,
                  sname: json.STAN[i].sname,
                  stan_id: json.STAN[i].stan_id,
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

    minimizeWindow(id) {
      let window = this.windows[this.id[id]];
      for (let key in this.$children) {
        if (this.$children[key].id === id) {
          let vueWindow = this.$children[key].$children[0];
          if (window.state) {
            // // Сохранение параметров окна
            // window.minSaved = {};
            // window.minSaved.minWidth = vueWindow.minWidth;
            // window.minSaved.minHeight = vueWindow.minHeight;
            // window.minSaved.width = vueWindow.width;
            // window.minSaved.height = vueWindow.height;
            // window.minSaved.position = vueWindow.position;
            // window.minSaved.zIndex = vueWindow.zIndex;
            //
            // vueWindow.minWidth = 0;
            // vueWindow.minHeight = 0;
            // vueWindow.width = 500;
            // vueWindow.height = 500;
            //
            // vueWindow.position = {x:-1000000, y:-1000000};

            window.state = false;
          }
          else {
            // // Вернуть окну значения ширины и высоты
            // if (window.minSaved.minWidth) vueWindow.minWidth = window.minSaved.minWidth;
            // if (window.minSaved.minHeight) vueWindow.minHeight = window.minSaved.minHeight;
            // if (window.minSaved.width) vueWindow.width = window.minSaved.width;
            // if (window.minSaved.height) vueWindow.height = window.minSaved.height;
            //
            // // Вернуть окну позицию
            // if (window.minSaved.position) vueWindow.position = window.minSaved.position;

            window.state = true;
          }
        }
      }
    },

    removeWindow(id) {
      console.log("Window with id = " + id + " closed");
      this.$refs.TollBar.destroyTool(this.id[id]);
      this.windows.splice(this.id[id], 1)
      this.id = {};
      this.windows.forEach((value, index) => this.id[value.id] = index);
    },

    updateSizeApp: function () {
      this.mainDivSize = document.documentElement.clientHeight - 75;

      this.$set(this.dragArea, 'left', 0);
      this.$set(this.dragArea, 'top', 34);
      this.$set(this.dragArea, 'width', document.documentElement.clientWidth);
      this.$set(this.dragArea, 'height', document.documentElement.clientHeight - 75);

      // this.dragArea =  { left: 0, top: 34, width: document.documentElement.clientWidth, height: this.mainDivSize };
    },

    addListWindow: function (added_options) {
      let id = "win" + JQXLite.generateID(), vue = this;
      let option = {
        id: id,
        type: 'MainWindow',
        title: 'Прогресс ' + ++this.count,
        state: true,
        closeWindow: (e) => {
          if (!e)
            option.state = false;
          else if (e.type === "close")
            option.state = true;
          else
            option.state = e.currentTarget.tagName === "IMG";
          setTimeout(() => {vue.removeWindow(id)}, 200);
        },
        changePosition: () => {
          vue.minimizeWindow(id);
        },
        mainWindowRow: -1,
        theme: this.theme,
        zIndex: this.windows.length,
      }

      option = this.updateWindowCreateOptions(option, added_options);
      this.id[id] = this.windows.length;
      this.windows.push(option);

      this.$refs.TollBar.addTool('custom', 'last', true, (type, tool) => {

        tool.jqxToggleButton({toggled: true, theme: this.theme});
        tool.text(option.title);
        tool.append('<img src="./src/public/img/close_white.png" class="toolbar-close-button-style" style="margin: auto auto auto 10px; float: right;" alt=""/>');
        tool.on('click', option.changePosition);
        tool.css("cursor", "pointer").find('img').on("click", option.closeWindow);
      });
    }
  },

  created() {
    this.loadStations();
  },

  mounted() {
    this.$refs.Menu.setOptions({
      width: "100%",
      height: 32,
      animationShowDuration: 0,
      animationHideDuration: 0,
      animationShowDelay: 0,
      autoOpen: true,
      showTopLevelArrows: false,
    });
    this.$refs.TollBar.setOptions({
      width: '100%',
      height: 45,
      initTools: function (type, index) {
      }
    });
    window.addEventListener('resize', this.updateSizeApp);
    this.updateSizeApp();
  },

  destroyed() {
    window.removeEventListener('resize', this.updateSizeApp)
  },

}
</script>

<!--505 ширина окна миниммум-->

<style scoped>

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
}

.toolbar-close-button-style:hover {
  background-color: black;
  border: none;
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

.changeTheme li {
  text-align: center;
}

</style>

