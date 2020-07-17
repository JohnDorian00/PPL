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

      <div style="border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;  background-color: rgba(255,0,0,0); width: 100%;">
        <div style="text-align: right; margin: 10px">Название нового варианта расчета &nbsp;&nbsp;
          <JqxInput :theme="theme"
                    :minLength="1"
                    :placeHolder="'Enter a Country'">
          </JqxInput>
        </div>




        <div style="text-align: right; margin: 10px">Комментарий &nbsp;&nbsp;
          <JqxInput :theme="theme"
                    :minLength="1"
                    :placeHolder="'Enter a Country2'">
          </JqxInput>
        </div>

      </div>

      <div style="display: inline-block; border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;
      background-color: rgba(255,0,0,0); width: 200px;"
      >
        <JqxButton  ref="createWindowNewVariant" @click="this.$root.$children[0].createWindowNewVariant" :height="button_height"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{'display': 'block', 'margin': 'auto'} "
        ><span class="nobr">На основе варианта генсхемы &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </JqxButton>
        <JqxButton  ref="createWindowNewVariant" @click="this.$root.$children[0].createWindowNewVariant" :height="button_height"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{'display': 'block', 'margin': 'auto'} "
        ><span class="nobr">На основе варианта расчета п.п. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </JqxButton>
      </div>

      <div style="display: inline-block; border-color: rgba(0,0,0,0); border-style: solid; border-width: 1px;
       background-color: rgba(255,0,0,0); width: calc(50% - 4px); height: calc(100% - 200px); right: 0; margin-right: 3px; position: absolute"
      >
        <JqxListBox :theme="theme" :height="'100%'" :width="'100%'"
                    :source="listBoxSource" :selectedIndex="3" :style="{'display': 'block', 'margin': 'auto'}">
        </JqxListBox>
      </div>
      <!--      Разница нижних дивов = 117 - 76 = 41px -->


      <!--      Таблица-->
<!--      <div style="background-color: rgba(255,0,0,0); width: 100%; position: relative; top: 0; margin-right: 60px; height: calc(100% - 76px)">-->


<!--        <Preloader v-if="!isLoad"></Preloader>-->
<!--        <JqxGrid v-show="isLoad" style="position:relative;" ref="myGrid" :height="'100%'" :width="'100%'" :source="dataAdapter" :columnsmenu="false"-->
<!--                 :columns="columns" :pageable="false" :autoheight="false"-->
<!--                 :sortable="true" :altrows="true" :enabletooltip="true"-->
<!--                 :editable="false" :selectionmode="'singlerow'" :theme="theme" :filterable="true"  :filtermode="'excel'" :sortmode="'columns'" :showfilterrow="true">-->
<!--        </JqxGrid>-->

<!--      </div>-->

      <!--      Нижнее меню (кнопки)-->
      <ul class="btn-group" :height="button_height">
        <li>
          <JqxButton  ref="createWindowNewVariant" @click="this.$root.$children[0].createWindowNewVariant" :height="button_height"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'} "
          ><span class="nobr">Создать новый вариант &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </JqxButton>
        </li>
        <li class="last">
          <JqxButton class="button"   ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"
                     :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                     :theme="theme" :style="{ 'display': 'inline-block'}"
          ><span class="nobr">Закрыть &nbsp;&nbsp;</span>
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

  export default {
    components: {
      JqxWindow,
      JqxButton,
      JqxGrid,
      Preloader,
      Rows,
      JqxListBox,
      JqxInput
    },
    name: "MainWindow",
    props: ["id", "title", "closeWindows", "state"],
    data() {
      return {
        theme: appConfig.windowsTheme,
        isLoad: false,
        button_height: 30,
        dataAdapter: new jqx.dataAdapter(this.source),
        columns: [
          { text: 'id', datafield: 'var_id', width: '44'},
          { text: 'Год',  datafield: 'var_year', width: '44'},
          { text: 'Номер ГС', datafield: 'var_gs_var_id', minwidth: '143'},
          { text: 'Название варианта',  datafield: 'var_name'},
          { text: 'Вариант ГС', datafield: 'gs_name', minwidth: '100'},
          { text: 'Комментарий',  datafield: 'var_desc', minwidth: '100'},
        ],
        listBoxSource: [
        "Affogato",
        "Americano",
        "Bicerin",
        "Breve",
        "Café Bombón",
        "Café au lait",
        "Caffé Corretto",
        "Café Crema",
        "Caffé Latte",
        "Caffé macchiato",
        "Café mélange",
        "Coffee milk",
        "Cafe mocha",
        "Cappuccino",
        "Carajillo",
        "Cortado",
        "Cuban espresso",
        "Espresso",
        "Eiskaffee",
        "The Flat White",
        "Frappuccino",
        "Galao",
        "Greek frappé coffee",
        "Iced Coffee﻿",
        "Indian filter coffee",
        "Instant coffee",
        "Irish coffee",
        "Liqueur coffee"
      ]

      }
    },

    methods: {
      // Загрузка данных с url
      updateGridFromURL() {
        let t = this;

        let xmlQuery = new XmlQuery({
          url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?DefName=PPL_GK_Defs",
          querySet: 'GET_VARS'
        });

        xmlQuery.query('json', successQuery, function (ER) {
          xmlQuery.destroy();
          console.log("Error update data");
          console.log(ER);
        })

        function successQuery(json) {
          // t.source.datafields = json.metaData.fields;
          t.source.datafields = [
            { name: 'var_id', type: 'string' },
            { name: 'var_year', type: 'string' },
            { name: 'var_gs_var_id', type: 'string' },
            { name: 'var_name', type: 'string' },
            { name: 'gs_name', type: 'string' },
            { name: 'var_desc', type: 'string' },
          ]
          t.source.localdata = json.rows;
          t.$refs.myGrid.updatebounddata();
          xmlQuery.destroy();
          t.isLoad = true;
          console.log("Success update data");

          // adding data for test
          for (let i=0; i<15; i++) {
            t.$refs.myGrid.addrow(1,[
              {var_id: i, var_year: "asd", var_gs_var_id: "asd", var_name: "asd", gs_name:"asd", var_desc: "asd"},
            ]);
          }
        }
      }
    },

    beforeCreate: function () {
      this.source = {
        datatype: 'json',
      };
    },

    created() {
      // Обновление таблицы
      // this.updateGridFromURL();
    },

    mounted() {
      // FLEXBOX
      // this.$refs.Rows.updateHeight();
    },


  }
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
