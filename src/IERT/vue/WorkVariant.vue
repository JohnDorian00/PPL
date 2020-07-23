<template>
  <JqxWindow :max-height="1999999"
             :max-width="190000"
             :min-width="937"
             :min-height="510"
             :position="{ x: 150, y: 220 }"
             :id="id"
             :theme="theme"
             :closeButtonSize="0"
             @close="closeWindows">

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
                         :animationType="'none'" :selectionTracker='false'>
                  <ul>
                    <li style="margin-left: 10px;">Выбор из списка</li>
                    <li style="margin-right: 10px;">Выбор участка по пути следования</li>
                  </ul>
                  <div style="height:100%; width:100%; overflow: hidden;">
                    <!--           :source="dataAdapter" @rowselect="onRowselect"    -->
                    <JqxGrid style="position:relative; border: none;" ref="stationGrid" :height="'100%'" :width="'100%'"
                             :columnsmenu="false" :columns="columns" :pageable="false" :autoheight="false"
                             :sortable="true" :altrows="true" :columnsresize="true" :showfilterrow="true"
                             :enabletooltip="true" :columnsautoresize="true" :editable="false"
                             :selectionmode="'singlerow'"
                             :theme="theme" :filterable="true" :filtermode="'default'" :sortmode="'columns'">
                    </JqxGrid>
                  </div>
                  <div>
                    JavaServer Pages (JSP) is a Java technology that helps software developers serve
                    dynamically generated web pages based on HTML, XML, or other document types. Released
                    in 1999 as Sun's answer to ASP and PHP,:citation needed JSP was designed to address
                    the perception that the Java programming environment didn't provide developers with
                    enough support for the Web. To deploy and run, a compatible web server with servlet
                    container is required. The Java Servlet and the JavaServer Pages (JSP) specifications
                    from Sun Microsystems and the JCP (Java Community Process) must both be met by the
                    container.
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
          <JqxButton ref="createWindowNewVariant" @click="this.$root.$children[0].createWindowNewVariant"
                     :height="button_height"
                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                     :theme="theme" :style="{'display': 'inline-block'} "
          ><span class="nobr">Создать новый вариант&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
    props: ["id", "title", "closeWindows", "state"],
    data() {
      return {
        theme: appConfig.windowsTheme,
        isLoaded: false,
        button_height: 30,
        config: {
          feeds: {'CNN.com': 'cnn', 'Geek.com': 'geek', 'ScienceDaily': 'sciencedaily'},
          format: 'txt',
          dataDir: '../sampledata',
          feedTree: document.querySelectorAll('angularTree')[0],
          feedItemHeader: document.querySelector('#feedItemHeader'),
          feedUpperPanel: document.querySelector('#feedUpperPanel'),
          feedHeader: document.querySelector('#feedHeader'),
          feedContentArea: document.querySelector('#feedContentArea'),
          selectedIndex: -1,
          currentFeed: '',
          currentFeedContent: {}
        },
        columns: [
          {text: 'Начало участка', datafield: 'var_id'},
          {text: 'Конец участка', datafield: 'var_year'},
          {text: 'Наличие привязки', datafield: 'var_gs_var_id'},
        ],
        dataAdapter: new jqx.dataAdapter(this.source),
        panels: [{ size: '50%', min: 320, collapsible: false },{ min: 160, size: '50%', collapsible: false }],
      }
    },

    // Слушатели переменных
    watch: {
      // Отключение кнопки рефреш во время подгрузки
      isLoaded: function () {
      },
    },

    methods: {
      onResize() {
        localStorage.setItem("EditWindowLeftPanelSize", this.panels[0].size);
        localStorage.setItem("EditWindowRightPanelSize", this.panels[1].size);
      },

    },

    beforeCreate: function () {
      this.source = {
        datatype: 'json',
      };
    },

    created() {
      let left, right;
      if ((left = localStorage.getItem("EditWindowLeftPanelSize")) && (right = localStorage.getItem("EditWindowRightPanelSize"))) {
        this.panels[0].size = left;
        this.panels[1].size = right;
      }
    },

    mounted() {
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
