<template>
  <JqxWindow :width="727"
             :height="403"
             :max-height="1999999"
             :max-width="190000"
             :min-width="0"
             :min-height="0"
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
        <div  class="collapse-button" >
          <img class="collapse-button" src="@/style/images/minus.png">
        </div>
        <div class="expand-button" >
          <img class="expand-button" src="@/style/images/full-screen.png">
        </div>
        <div id="exit-button" class="close-button" @click="closeWindows">
          <img class="close-button"  src="@/style/images/closing.png" @click="closeWindows">
        </div>
      </div>
    </div>

    <!--      Контент-->
    <div ref="content" style=" top: 0; width: 100%; background-color: rgba(0,0,255,0); ">

      <!--      Верхняя часть окна-->
      <div style="border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;  background-color: rgba(255,0,0,0); width: 100%;">
        <div style="text-align: center; margin: 10px">Название нового варианта расчета &nbsp;&nbsp;
          <JqxInput :theme="theme" :minLength="1" v-model="nameGS"
                    :placeHolder="''">
          </JqxInput>
        </div>
        <div style="text-align: center; margin: 10px">Комментарий &nbsp;&nbsp;
          <JqxInput :theme="theme" v-model="descGS"
                    :minLength="1"
                    :placeHolder="''">
          </JqxInput>
        </div>

      </div>

      <!--      Нижняя часть окна-->
      <div style="display: inline-block; border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;
       background-color: rgba(255,0,0,0); width: calc(100%); height: calc(100% - 200px); right: 0; position: relative; margin: 10px"
      >


        <div style="margin: auto; width: 100%; position: relative; display: inline-block; ">
          <JqxButton  ref="buttonGenscheme" @click="toggleButton($event)" :height="button_height"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'" :disabled="true"
                      :theme="theme" :style="{'display': 'inline-block', 'margin': 'auto'} "
          ><span class="nobr">На основе варианта генсхемы &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </JqxButton>
          <JqxButton  ref="buttonPP" @click="toggleButton($event)" :height="button_height"
                      :textImageRelation="'imageBeforeText'" :textPosition="'right'"
                      :theme="theme" style="right: 0; position:absolute;" :style="{'display': 'inline-block', 'margin': 'auto'} "
          ><span class="nobr">На основе варианта расчета п.п. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </JqxButton>
        </div>


        <div style="margin-right: 25px; height: 100%">
          <Preloader v-if="!isLoaded" />
          <JqxListBox v-show="isLoaded" ref="listBox" :theme="theme" :height="'100%'" :width="'100%'" @select="onListBoxSelect"
                      :source="listBoxSourceGenscheme" :selectedIndex="3" :style="{'display': 'block'}">
          </JqxListBox>
        </div>

      </div>

      <!--      Нижнее меню (кнопки)-->
      <ul class="btn-group" :height="button_height">
        <li>
          <JqxButton  ref="createWindowNewVariant" @click="uploadNewVar" :height="button_height"
                      v-bind:disabled="buttonFlag" :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'} "
          ><span class="nobr">Создать&nbsp;&nbsp;&nbsp;</span>
          </JqxButton>

        </li>
        <li class="last">
          <JqxButton class="button" ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"
                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                     :theme="theme" :style="{ 'display': 'inline-block'}"
          ><span class="nobr">Закрыть&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
  import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
  import JqxInput from "@/jqwidgets/jqwidgets-vue/vue_jqxinput";
  import JqxForm from "@/jqwidgets/jqwidgets-vue/vue_jqxform";

  export default {
    components: {
      JqxWindow,
      JqxButton,
      JqxGrid,
      Preloader,
      Rows,
      JqxListBox,
      JqxInput,
      JqxForm
    },

    name: "MainWindow",

    props: ["id", "title", "closeWindows", "state"],

    data() {
      return {
        theme: appConfig.windowsTheme,
        isLoaded: false,
        button_height: 30,
        listBoxSelected: false,
        nameGS: null,
        descGS: null,
        idNewVariant: null,

        listBoxSourceGenscheme: [
        ],

        listBoxSourcePP: [
        ]
      }
    },

    // Слушатели переменных
    watch: {
      // При изменении флага меняется disable окна
      buttonFlag: function () {
        this.$refs.createWindowNewVariant.disabled = this.buttonFlag;
      }

    },

    // Перевычисляемые переменные
    computed: {
      // Проверка поля "имя нового варианта" на пустоту, проверка на выбор элемента из списка
      // При соблюдении условий включается кнопка "создать"
      buttonFlag: function () {
          let nameGS = this.nameGS ? this.nameGS.replace(/\s+/g, ' ').trim() : this.nameGS;
          return !(this.listBoxSelected && (nameGS !== null && nameGS !== ""))
        },
    },

    methods: {
      // Загрузка данных с бд
      loadListBoxData(name) {
        let t = this, query;
        t.isLoaded = false;

        if (name === "GS") {
          query = "GET_GS_VARS_GS";
        } else if (name === "PP") {
          query = "GET_GS_VARS_VARIANT";
        }

        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?DefName=PPL_GK_Defs_JS",
          querySet: query
        });

        xmlQuery.query('json',

                      function(json) {
                        if (name === "GS") {
                          t.listBoxSourceGenscheme = [];
                          for (let key in json.rows) {
                            t.listBoxSourceGenscheme.push(json.rows[key].name);
                          }
                          t.$refs.listBox.source = t.listBoxSourceGenscheme;

                        } else if (name === "PP") {
                          t.listBoxSourcePP = [];
                          for (let key in json.rows) {
                            t.listBoxSourcePP.push(json.rows[key].var_name);
                          }
                          t.$refs.listBox.source = t.listBoxSourcePP;
                        }
                        xmlQuery.destroy();
                        t.isLoaded = true;
                        },

                      function (ER) {
                        xmlQuery.destroy();
                        console.log("Error update data");
                        console.log(ER);
                        }
        )
      },

      // Загрузка данных в бд (создание нового варианта)
      uploadNewVar() {
        let t = this
        t.isLoaded = false;

        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
          querySet: "CREATE_VAR"
        });

        xmlQuery.clearFilter();
        // xmlQuery.setFilter( "GS_VAR_ID", Math.floor(Math.random()*10000000000000000), "text");
        xmlQuery.setFilter( "GS_VAR_ID", 1702061711243530, "text");
        xmlQuery.setFilter( "GS_YEAR", new Date().getFullYear(), "text");
        xmlQuery.setFilter( "GS_NAME", this.nameGS, "text");
        xmlQuery.setFilter( "GS_DESC", this.descGS, "text");

        xmlQuery.query('json',

          function(json) {
            t.idNewVariant = json.rows[0].var_id;
            console.log(t.idNewVariant);
            xmlQuery.destroy();
            t.isLoaded = true;
          },

          function (ER) {
            xmlQuery.destroy();
            console.log("Error update data");
            console.log("ERROR = ", ER);
          }
        );
      },

      // Включение/отключения кнопок формата списка (кнопки генсхема/п.п. над списком)
      toggleButton(pressed_button) {
        pressed_button = pressed_button.currentTarget;
        let button;

        // Обнуление
        this.$refs.buttonGenscheme.disabled = false;
        this.$refs.buttonPP.disabled = false;
        this.listBoxSelected = false;

        // Кнопка 1 (генсхема)
        if ($(this.$refs.buttonGenscheme.componentSelector)[0] === pressed_button) {
          button = this.$refs.buttonGenscheme;
          button.disabled = true;
          this.loadListBoxData("GS");
          // Кнопка 2 (пп)
        } else if (($(this.$refs.buttonPP.componentSelector)[0] === pressed_button)) {
          button = this.$refs.buttonPP;
          button.disabled = true;
          this.loadListBoxData("PP");
        } else {
          console.error("Кнопка не найдена");
        }
      },

      onListBoxSelect() {
        this.listBoxSelected = true;
      },

    },

    beforeCreate: function () {
    },

    created() {

    },

    mounted() {
      this.loadListBoxData("GS");
      // FLEXBOX
      // this.$refs.Rows.updateHeight();
    },


  }

  // ADD VARIANT
  // http://192.168.10.3:8090/jaxrpc-DBQuest/HTTPQuery?DefName=PPL_GK_Defs&xmlQuery=%3CQuerySet%20refid=%22CREATE_VAR%22%3E%3CTextParam%20ID=%22GS_VAR_ID%22%3E1904040416293170%3C/TextParam%3E%3CTextParam%20ID=%22GS_YEAR%22%3E2099%3C/TextParam%3E%3CTextParam%20ID=%22GS_NAME%22%3ETEST123%3C/TextParam%3E%3CTextParam%20ID=%22GS_DESC%22%3Edesprip%3C/TextParam%3E%3C/QuerySet%3E
</script>



<style scoped>

  ul {
    text-align: justify;
    /* Лекарство для IE6-7*/
    text-justify: newspaper;
  }

  ul li  {
    display: inline-block;
    text-align: left;
    /* эмуляция inline-block для IE6-7*/
  //display : inline;
  //zoom : 1;
  }
  ul li.helper {
    width: 100%;
    height: 0;
    visibility: hidden;
  }
  .last {margin-right: 100px}

  .nobr {
    white-space: nowrap;
  }

  .button {
    display: inline-block;
    margin-right: 10px;
    margin-left: 10px;

  }

  .btn-group {
    background-color: rgba(0, 0, 255, 0);
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
