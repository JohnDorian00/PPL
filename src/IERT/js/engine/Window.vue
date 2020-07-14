<template>
    <JqxWindow :width="width" :height="height" :min-height="minHeight" :max-height="maxHeight"
               :min-width="minHeight" :max-width="maxWidth" :position="position" :resizable="resizable"
               :title="title" :theme="theme" :close-button-action="closeButtonAction" :is-modal="isModal">
      <div>
        Header
      </div>
      <div>
        Content
      </div>
    </JqxWindow>
</template>

<script>

  import Vue from 'vue'
  import lib from "@/IERT/js/engine/lib";
  import appConfig from "@/IERT/js/appConfig";
  import JqxToolbar from "@/jqwidgets/jqwidgets-vue/vue_jqxtoolbar";
  import JqxMenu from "@/jqwidgets/jqwidgets-vue/vue_jqxmenu";
  import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";

  //------------------------------------------------------------------//
  //-----------------------------Поля---------------------------------//
  //------------------------------------------------------------------//

  // Константы
  var MAX_LEN_LOWBARTEXT = 21;

  // Переменные
  var isAnimated      =   false,
    isClose         =   false,
    gridSelect      =   [],
    buttonSelect    =   [],
    dropDownList    =   [],
    id              =   "#" + lib.methods.makeid(),
    oldOffset       =   null,
    isAnimate       =   false,
    stateAnim       =   {
                          me: {
                            'width': '100%',
                            'height': '100%',
                            'left': -1,
                            'top': 0,
                            'display': 'flex',
                            'flex-direction': 'column'
                          },
                          head: {
                            'width': '100%',
                            'margin': '0 0',
                            'padding': '7px 0',
                            'flex': '0 0 16px'
                          },
                          content: {
                            'width': '100%',
                            'flex': '1 1 1px',
                            'padding': '0'
                          },
                          resize: {
                            'width': '100%',
                            'height': '100%'
                          }
                        },
    lowBarButton,
    loader,
    me,
    content,
    button,
    header,
    win_content,
    resize,
    resizable,
    isMaximize,
    state;



  this.id = id;

  state =   {
    me: {
      'width': this.minWidth,
      'height': this.minHeight,
      'left': -1,
      'top': 0,
      'display': 'flex',
      'flex-direction': 'column'
    },
    head: {
      'width': this.minWidth,
      'margin': '0 0',
      'padding': '7px 0',
      'flex': '0 0 16px'
    },
    content: {
      'width': this.minWidth,
      'flex': '1 1 1px',
      'padding': '0'
    },
    resize: {
      'width': this.minWidth,
      'height': this.minHeight
    }
  };


  export default {
    name: "window",

    components: {
      JqxWindow
    },

    props: ['options'],

    data() {
      return {
        // default settings
        height: 600,
        width: 600,
        minHeight: 300,
        maxHeight: 10000,
        minWidth: 300,
        maxWidth: 10000,
        position: 'center',
        resizable: true,
        title: 'Заголовок',
        theme: appConfig.windowsTheme,
        closeButtonAction: "close",
        isModal: false,
        // Not win init params
        full: false,
      }
    },

    methods : {
      constructor: function() {
        console.log("___________________________________");
        if (this.options) {
          // Применяем настройки, которые были переданы
          for (var key in this.$data) {
            if (this.options[key] !== undefined) { this.$data[key] = this.options[key] }
          }

          console.log(this.$data);


          if (this.options.isModal) {
            t.additionalOptions.lowBarFlag = false;
          }

        }
        //return this.initWindow(t.options, t.additionalOptions);
      },

//       takeOptions: function() {
//         if (this.options) {
//           this.height =
//         }
//       }
//
//         width
// minHeight
// maxHeight
// minWidth
// maxWidth
// position
// resizable
// title
// theme
// closeButtonAction
// isModal

          // Прочие параметры
      //     additionalOptions : {
      //     full            :   false,
      //       maximaize       :   true,
      //       lowBarFlag      :   true,
      // },

      // Инициализация
      initWindow : function() {
        //window.NW[id.substr(1)] = t;
        loader = '<div style="width:100%;height: 100%;left:0;top:0;display: flex;position:absolute;opacity:1;z-index: 99999" id ="IDMloaderdiv"><img width="100%" height="100%" src="img/Wedges.svg" /></div>';
        $("#main-page").append(('<div id= "IDM" style="opacity:0;border-radius:0;" ><div style="border-bottom:none;border-radius:0;"></div><div id = "IDMContent" style="display:flex;flex:1 1 1px;align-items:center;flex-direction:row;overflow:hidden;position:relative;opacity:1;border-radius:0;background-color: #808080;">' + loader + '</div></div></div>').replaceAll('IDM', id.substr(1)));
        loader = (loader.replaceAll('IDM', id.substr(1)));
        me = $(id);
        content = $(id + "Content");
        $(document.body).append(me);
        me.jqxWindow(t.options);

        // Добавление в нижний тулбар по флагу
        if (this.additionalOptions.lowBarFlag && !this.isModal) {
          t.addWindowsToLowBar(me);
        }
        me.on('close', t.closeWindows);

        if ($('#mainPage').length === 1 && !options.isModal)
          $('#mainPage').append(me);

        t.showWindows();
        t.initMinMaxButtons();

        // Окно на весь экран


        me.on('resize', t.updateGridOfResize);
        me.on('moving', t.updateGridOfResize);

        // Выталкивание окна при изменении размера браузера
        $(window).resize(t.fixWindowLocation);

        me.jqxWindow('focus');
        me.css("visibility", "visible");
        win_focus = searchTopWindow();

        return NW[id.substr(1)]
      },




      /*
      // Деактивация всех кнопок
      clearAllButtonsLowBarState: function() {
    var button, minimizeButton;
    for (var i=0; i<globalLowBarButtonsId.length; i++) {
      button = $("#"+ globalLowBarButtonsId[i]);
      minimizeButton = $("#low-toolbarPopup").find("#"+ button[0].id);
      deactivateLowBarButton(button);
      deactivateLowBarButton(minimizeButton);
    }
  },

      // Активация кнопки
      activateLowBarButton: function(button) {
        var minimizeButton = $("#low-toolbarPopup").find("#"+ button[0].id);
        if (minimizeButton.length !== 0) {
          minimizeButton.css("background-color", "#305996");
          minimizeButton.css("color", "#fbfbfb");
          minimizeButton.css("background-image", "none");
        }
        button.css("background-color", "#305996");
        button.css("color", "#fbfbfb");
        button.css("background-image", "none");
      },

      // Деактивация кнопки
      deactivateLowBarButton: function(button) {
        button.css("background-color", "black");
        button.css("background-image", "");
        button.css("color", "");
      },

      // Поиск самого верхнего окна
      searchTopWindow: function() {
        var htmlCollection = document.getElementsByClassName('jqx-window'), zIndex = -99999, topWin;
        for (var i = 0; i < htmlCollection.length; i++) {
          if (htmlCollection[i]['style']['visibility'] !== "unset") {
            if (htmlCollection[i]['style']['z-index'] > zIndex) {
              zIndex = htmlCollection[i]['style']['z-index'];
              topWin = htmlCollection[i];
            }
          }
        }
        return topWin
      },

      // Окрашивание кнопки активного окна
      activateTopButton: function() {
        clearAllButtonsLowBarState();
        var topWindow = searchTopWindow();
        if (topWindow) {
          activateLowBarButton($("#low" + topWindow.id));
        }
      }*/
    },

    created() {
      this.constructor();
    },

    mounted() {
    },

  }
</script>
