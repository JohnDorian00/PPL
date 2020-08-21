<template>
  <transition appear name="fade">
    <JqxWindow ref="win"
               @close="closeWindows"
               v-show="state"
               :max-height="1999999"
               :max-width="190000"
               :min-width="700"
               :min-height="200"
               :width="1000"
               :height="500"
               :position="{ x: 200, y: 200 }"
               :id="id"
               :theme="theme"
               :sourceOut="sourceOut"
               :keyboard-close-key="NaN"
               :drag-area="dragArea"
    >

      <!--    Верхний бар-->
      <div ref="header">
        <div>{{ title }}</div>
      </div>

      <!--      Контент -->
      <div style="display: flex; flex-direction: column">
        <!--      Таблица -->
        <div style="background-color: rgba(255,0,0,0); flex: 1 0 auto; margin: 0 2px 10px 0">
          <Preloader v-if="!isLoaded"/>
          <JqxGrid v-else ref="Grid"
                   @rowselect="onRowselect" @rowdoubleclick="workVariant"
                   :height="'100%'" :width="'100%'" :source="dataAdapter" :columnsmenu="false" :columns="columns"
                   :pageable="false" :autoheight="false" :sortmode="'columns'" :filterable="true" :filtermode="'excel'"
                   :columnsresize="true" :sortable="true" :altrows="false" :editable="false" :theme="theme"
                   :enabletooltip="true" :columnsautoresize="true" :selectionmode="'singlerow'" :scrollbarsize="20"/>
        </div>

        <!--      Нижнее меню -->
        <div style="border-style: solid; border-width: 1px; border-color: rgb(221,221,221);
        display: flex; flex-direction: row; align-items: center; justify-content: space-around; height: 50px">

          <div id="lowerMenu" style="flex: 1 1 auto; display: flex; flex-direction: row; justify-content: space-around">
            <!--          style all: cursor: pointer; -->

            <JqxButton ref="createWindowNewVariant"
                       @click="this.$root.$children[0].createWindowNewVariant"
                       :height="button_height+'px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;Создать новый вариант&nbsp;'" style="margin: 0 2px 0 4px"/>

            <JqxButton ref="workVariant"
                       @click="workVariant"
                       :height="button_height+'px'" :width="'120px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;Изменить&nbsp;'" style="margin: 0 2px 0"/>

            <JqxButton ref="buttonDeleteVariant"
                       @click="deleteVariant"
                       :height="button_height+'px'" :width="'120px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;Удалить&nbsp;'" style="margin: 0 2px 0"/>

            <JqxButton ref="buttonRefreshTable"
                       @click="updateGridFromURL"
                       :height="button_height+'px'" :width="'120px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;Обновить&nbsp;'" style="margin: 0 4px 0 2px"/>
          </div>

          <div style="flex: 1 1 200px; display: flex; flex-direction: row; justify-content: flex-end">
            <div style="flex: 1 1 auto"/>
            <div style="flex: 1 1 auto;">
              <JqxButton ref="closeButton"
                         @click="closeWindows"
                         :height="button_height+'px'" :width="'120px'" :theme="theme" :textPosition="'center'"
                         :value="'&nbsp;Закрыть&nbsp;'" style="margin: auto"/>
            </div>
          </div>

        </div>
      </div>
    </JqxWindow>
  </transition>
</template>

<script>
import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
import appConfig from "@/IERT/js/appConfig";
import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
import XmlQuery from "@/IERT/js/xmlQuery";
import Preloader from "@/IERT/vue/Preloader";

export default {
  components: {
    JqxWindow,
    JqxButton,
    JqxGrid,
    Preloader,
  },
  name: "MainWindow",
  props: ["id", "title", "closeWindows", "state", "theme", "dragArea"],
  data() {
    return {
      isLoaded: false,
      button_height: 30,
      dataAdapter: new jqx.dataAdapter(this.source),
      sourceOut: {},
      GridSelector: -1,
      columns: [
        {text: 'id', datafield: 'var_id', width: '44'},
        {text: 'Год', datafield: 'var_year', width: '44'},
        {text: 'Номер ГС', datafield: 'var_gs_var_id', minwidth: '143'},
        {text: 'Название варианта', datafield: 'var_name', width: '200'},
        {text: 'Вариант ГС', datafield: 'gs_name', minwidth: '100'},
        {text: 'Комментарий', datafield: 'var_desc', minwidth: '100'},
      ],
      station: null,
    }
  },

  methods: {
    disableMenu() {
      $("#lowerMenu").addClass("no-events");
    },

    enableMenu() {
      $("#lowerMenu").removeClass("no-events");
    },

    // Окно изменения варианта
    workVariant() {
      this.$emit('workVariantCreateWindow', this.id, this.GridSelector)
    },

    // Смена селектора строки
    onRowselect($event) {
      this.GridSelector = $event.args.row;
    },

    // Удаление варианта из бд
    deleteVariant() {
      let t = this, variant;

      if (!this.GridSelector.var_id) {
        console.log("Не выбрана строка в таблице для удаления");
        return
      }
      else {
        variant = this.GridSelector.var_id;
      }

      t.isLoaded = false;
      t.disableMenu();

      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "DELETE_VAR"
      });

      xmlQuery.clearFilter();
      xmlQuery.setFilter("VAR_ID", variant, "text");

      xmlQuery.query('json',
          function () {
            console.log("Удален вариант ", variant);
            xmlQuery.destroy();
            t.isLoaded = true;
            t.enableMenu();
            t.$root.$children[0].refreshAllMainWindows();
          },
          function (ER) {
            xmlQuery.destroy();
            t.isLoaded = true;
            t.enableMenu();
            console.log("Не удалось удалить вариант, ", this.GridSelector.var_id);
            console.log("ERROR = ", ER);
          }
      );
    },

    // Загрузка данных с url
    updateGridFromURL() {
      let t = this;
      t.isLoaded = false;
      t.disableMenu();
      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: 'GET_VARS'
      });

      xmlQuery.query('json', successQuery, function (ER) {
        xmlQuery.destroy();
        t.isLoaded = true;
        t.enableMenu();
        console.log("Error update data");
        console.log(ER);
      })

      function successQuery(json) {
        t.sourceOut = json.rows;
        t.source.datafields = [
          {name: 'var_id', type: 'string'},
          {name: 'var_year', type: 'string'},
          {name: 'var_gs_var_id', type: 'string'},
          {name: 'var_name', type: 'string'},
          {name: 'gs_name', type: 'string'},
          {name: 'var_desc', type: 'string'},
        ]
        t.source.localdata = json.rows;

        // Передача списка всех записей родителю
        t.$emit("MainWindowTableChange", json.rows);
        xmlQuery.destroy();
        t.isLoaded = true;
        t.enableMenu();
      }
    },
  },

  beforeCreate: function () {
    this.source = {
      datatype: 'json',
    };
  },

  created() {
    this.updateGridFromURL();
  },

  mounted() {
  },

  beforeDestroy() {
    // todo destroy all child elements
  }
}
</script>

<style scoped>

.lowerMenu {
  flex: 1 1 auto;
  border-style: solid;
  border-width: 1px;
}

.no-events {
  pointer-events: none;
  opacity: 0.5;
}

/*Анимация открытия-закрытия-сворачивания окна*/
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

</style>
