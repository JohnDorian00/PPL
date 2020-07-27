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
                 @workVariantCreateWindow="workVariant"/>
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
  import MainWindow from "@/IERT/vue/MainWindow";
  import NewVariantWindow from "@/IERT/vue/NewVariantWindow";
  import WorkVariant from "@/IERT/vue/WorkVariant";

  export default {
    name: "MainApp",
    components: {
      JqxToolbar,
      JqxMenu,
      JqxButtons,
      MainWindow,
      NewVariantWindow,
      WorkVariant,
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
      window.addEventListener('resize', this.updateSizeApp)
    },

    destroyed() {
      window.removeEventListener('resize', this.updateSizeApp)
    },

    methods: {
      // RowSelect(row) {
      //   this.mainWindowRow = row;
      // },

      findWindowInArr(id) {
        // Поиск окна
        let win;
        this.windows.filter(function (item) {
          if (item.id === id) {
            win = item;
          }
        });
        return win
      },

      MainWindowTableChange(data) {
        this.mainWindowSource = data;
      },

      refreshAllMainWindows() {
        // Обновление всех MainWindow при изменении данных в таблице
        for (let i in this.$children) {
          if (this.$children[i].$options._componentTag === "MainWindow") {
            this.$children[i].updateGridFromURL();
          }
        }
      },

      createWindowNewVariant() {
        this.addListWindow({type: 'NewVariantWindow', title: "Создание нового варианта"});
      },

      workVariant(id, row) {
        if (row !== -1) {
          this.addListWindow(
            {
              type: 'WorkVariant', title: "Работа с вариантом " + row.var_name + ", " +
                row.var_year + " г.", row: row,
            });
        } else {
          console.log("Не выбран пункт в таблице, ошибка изменения варианта");
        }
      },

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
