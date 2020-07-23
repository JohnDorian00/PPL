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
      <div style="background-color: rgba(255,0,0,0); width: 100%; position: relative; top: 0; margin-right: 60px; height: calc(100% - 76px)">
        <JqxSplitter :width="'100%'" :height="'100%'" :theme="theme" :splitBarSize="15"
                     :panels="[{ size: '35%', min: 100 },{ min: 100, size: '65%' }]">

          <div>


            <JqxTabs ref="myTabs" :theme="theme"
                     :width="'100%'" :height="'100%'" :position="'top'"
                     :animationType="'none'" :selectionTracker='false'>
              <ul>
                <li style="margin-left: 30px;">Node.js</li>
                <li>JavaServer Pages</li>
              </ul>
              <div>
                Node.js is an event-driven I/O server-side JavaScript environment based on V8. It
                is intended for writing scalable network programs such as web servers. It was created
                by Ryan Dahl in 2009, and its growth is sponsored by Joyent, which employs Dahl.
                Similar environments written in other programming languages include Twisted for
                Python, Perl Object Environment for Perl, libevent for C and EventMachine for Ruby.
                Unlike most JavaScript, it is not executed in a web browser, but is instead a form
                of server-side JavaScript. Node.js implements some CommonJS specifications. Node.js
                includes a REPL environment for interactive testing.
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

          <div>
            <JqxExpander style="border: none;" ref="feedExpander" :theme="theme"
                         :width="'100%'" :height="'100%'"
                         :toggleMode="'none'" :showArrow="false">

              <div class="jqx-hideborder">
                Feeds
              </div>
              <div class="jqx-hideborder jqx-hidescrollbars">
                <JqxTree ref="myTree" @select="onTreeSelect($event)" :theme="theme"
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
                        <li>
                          <span item-title="true">Geek.com</span>
                        </li>
                        <li>
                          <span item-title="true">CNN.com</span>
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
        // getWidth: getWidth('tabs'),
      }
    },

    // Слушатели переменных
    watch: {
      // Отключение кнопки рефреш во время подгрузки
      isLoaded: function () {
      },
    },

    methods: {
      onTreeSelect: function (event) {
        const item = this.$refs.myTree.getItem(event.args.element);
        this.getFeed(this.config['feeds'][item.label]);
      },
      onListBoxSelect: function (event) {
        this.loadContent(event.args.index);
      },
      selectFirst: function () {
        this.$refs.myListBox.selectIndex(0);
        this.loadContent(0);
      },
      getFeed: function (feed) {
        this.config['currentFeed'] = feed;
        if (feed !== undefined) {
          feed = this.config['dataDir'] + '/' + feed + '.' + this.config['format'];
          this.loadFeed(feed);
        }
      },
      loadFeed: function (feed, callback) {

      },
      displayFeedHeader: function (header) {
        this.$refs.feedListExpander.setHeaderContent(header);
      },
      displayFeedList: function (items) {
        const headers = this.getHeaders(items);
        this.$refs.myListBox.source = headers;
      },
      getHeaders: function (items) {
        let headers = [], header;
        for (let i = 0; i < items.length; i += 1) {
          header = items[i].title;
          headers.push(header);
        }
        return headers
      },
      onChangeAnimation: function (event) {
        const checked = event.args.checked;
        this.$refs.myTabs.selectionTracker = checked;
      },
      onChangeContentAnimation: function (event) {
        const checked = event.args.checked;
        const animationType = checked ? 'fade' : 'none';
        this.$refs.myTabs.animationType = animationType
      }
    },

    beforeCreate: function () {
      this.source = {
        datatype: 'json',
      };
    },

    created() {
    },

    mounted() {
      this.getFeed('sciencedaily');


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
