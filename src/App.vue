<template>
  <div
    v-bind:style="{ 'background-image': 'url('  + ')','background-repeat': 'no-repeat', 'width': '100%', 'height': '100%', 'top': '0', 'left': '0', 'overflow': 'hidden'}">
    <JqxMenu ref="Menu" style="height: 30px; border-radius: 0;" :theme="theme" v-bind:style="{'position': 'relative'}">
      <div align="left" v-if="!isOpenMainWin" v-on:click="addListWindow" :style="{'display': 'inline-block', 'height': '25px', 'position': 'absolute',
       'left':'0px', 'marginLeft':'10px', 'marginTop':'5px', 'cursor':'pointer', 'text-align':'right'}"
      >Загрузить шахматку</div>
    </JqxMenu>
    <div ref="main" v-bind:style="{'height': mainDivSize + 'px'}" id="main-page">
      <component v-for="window in windows" v-bind:is="window.type" :title="window.title" :id="window.id"
                 v-bind:key="window.id" :closeWindows="() => removeWindow(window.id)" :state="window.state"/>
    </div>
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

  export default {
    name: "MainApp",
    components: {
      JqxToolbar,
      JqxMenu,
      MainWindow,
      JqxButtons
    },
    data() {
      return {
        isOpenMainWin: false,
        backgroundUrl: backgroundUrl,
        theme: appConfig.menuTheme,
        mainDivSize: document.documentElement.clientHeight - 75,
        windows: [],
        id: {},
        count: 0
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
      removeWindow(id) {
        this.isOpenMainWin = false;
        this.$refs.TollBar.destroyTool(this.id[id]);
        this.windows.splice(this.id[id], 1)
        this.id = {};
        this.windows.forEach((value, index) => this.id[value.id] = index)
      },
      updateSizeApp: function () {
        this.mainDivSize = document.documentElement.clientHeight - 75;
      },
      addListWindow: function () {
        this.isOpenMainWin = true;
        let id = "win" + JQXLite.generateID(), vue = this;
        let option = {
          id: id,
          type: 'MainWindow',
          title: 'Прогресс ' + ++this.count,
          state: true,
          close: () => vue.removeWindow(id),
          changePosition: () => vue.windows[vue.id[id]].state = !vue.windows[vue.id[id]].state
        }
        this.id[id] = this.windows.length;
        this.windows.push(option);
        this.$refs.TollBar.addTool('custom', 'last', false, (type, tool) => {
          tool.html('<div class="toolbar-main-button-style"><ul class="list-class-style"><li><div><p class="toolbar-text-style">' + option.title + '</p></div></li><li><img class="toolbar-close-button-style" alt=""/></li></ul></div>')
            .css("cursor", "pointer").on('click', option.changePosition).find('img').on("click", option.close);
        });
      }
    },
  }
</script>

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
