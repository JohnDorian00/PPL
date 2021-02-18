<template>
  <transition appear name="fade">
    <JqxWindow :ref="'win'"
               @close="closeWindows"
               v-show="state"
               :width="530"
               :height="410"
               :max-height="1999999"
               :max-width="190000"
               :min-width="530"
               :min-height="410"
               :position="{ x: 100, y: 100 }"
               :id="id"
               :theme="theme"
               :drag-area="dragArea"
    >

      <!--    Верхний бар-->
      <div ref="header">
        <div>{{ title }}</div>
      </div>

      <!--      Контент -->
      <div style="display: flex; flex-direction: column">

<!--        Кнопки переключения грида -->
        <div style="flex: 0 0 auto; display: flex; flex-direction: row; border-color: rgb(221,221,221);
         justify-content: space-around; align-items: center; margin-bottom: 0; border-style: solid; border-width: 1px;
         padding: 10px; border-top-right-radius: 4px; border-top-left-radius: 4px;">
          <div id="buttonGenscheme">
            <JqxButton ref="buttonGenscheme"
                       @click="toggleButton($event)"
                       :height="button_height+'px'" :width="'250px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;На основе варианта генсхемы&nbsp;'" :disabled="true" style="margin-right: 2px;"/>
          </div>
          <div id="buttonPP">
            <JqxButton ref="buttonPP"
                       @click="toggleButton($event)"
                       :height="button_height+'px'" :width="'250px'" :theme="theme" :textPosition="'center'"
                       :value="'&nbsp;На основе варианта расчета п.п.&nbsp;'" style="margin-left: 2px;"/>
          </div>
        </div>

<!--        Таблица -->
<!--    position: relative делает скролл по ListBox медленнее (just magic)   -->
        <div style="flex: 3 0 auto; position: relative; border: rgb(221,221,221) 1px solid;
         border-bottom: none; border-top: none; height: 0">
            <Preloader v-if="!isLoaded"/>
            <JqxListBox v-show="isLoaded" ref="listBox" :scrollBarSize="10"
                        @select="onListBoxSelect" :theme="theme" :height="'100%'" :width="'100%'"
                        :source="listBoxSourceGenscheme"
                        style="border: none"
            />
        </div>

<!--        Инпуты -->
        <div style="flex: 2 0 auto; margin-bottom: 10px; display: flex; flex-direction: column;
                    align-items: center; border-color: rgb(221,221,221); border-style: solid; border-width: 1px;">

          <div style="display: flex; flex-direction: column; justify-content: space-around;
           width: 100%; height: 100%; align-items: flex-start">

            <div style="display: flex; flex-direction: row; width: 100%; align-items: baseline">
              <div style="flex: 0 0 190px; margin: 0 5px 0 10px; text-align: right">
                Название нового варианта
              </div>
              <div style="flex: 1 1 auto; margin: 0 10px 0 5px;">
                <JqxInput :theme="theme" :minLength="1" v-model="nameGS" :placeHolder="''" width="100%"/>
              </div>
            </div>

            <div style="display: flex; flex-direction: row; width: 100%; align-items: baseline">
              <div style="flex: 0 0 190px; margin: 0 5px 0 10px;text-align: right">
                Комментарий
              </div>
              <div style="flex: 1 1 auto; margin: 0 10px 0 5px">
                <JqxInput :theme="theme" v-model="descGS" :minLength="1" :placeHolder="''" width="100%"/>
              </div>
            </div>

          </div>
        </div>

        <!--      Нижнее меню -->
        <div id="lowerMenu" style="border-style: solid; border-width: 1px; border-color: rgb(221,221,221);
        display: flex; flex-direction: row; align-items: center; justify-content: space-around; height: 50px">

          <div style="flex: 1 1 auto; display: flex; flex-direction: row;">
            <!--          style all: cursor: pointer; -->
            <div style="flex: 1 1 auto;">
              <JqxButton ref="createWindowNewVariant"
                         @click="uploadNewVar"
                         :height="button_height+'px'" :disabled="buttonFlag" :theme="theme" :textPosition="'center'"
                         :value="'&nbsp;Создать&nbsp;'" :width="'120px'" style="margin: auto"/>
            </div>
            <div style="flex: 1 1 auto"/>
          </div>

          <div style="flex: 1 1 auto; display: flex; flex-direction: row;">
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
import XmlQuery from "@/IERT/js/xmlQuery";
import Preloader from "@/IERT/vue/Preloader";
import JqxListBox from "@/jqwidgets/jqwidgets-vue/vue_jqxlistbox";
import JqxInput from "@/jqwidgets/jqwidgets-vue/vue_jqxinput";
import JqxForm from "@/jqwidgets/jqwidgets-vue/vue_jqxform";

export default {
  components: {
    JqxWindow,
    JqxButton,
    Preloader,
    JqxListBox,
    JqxInput,
    JqxForm
  },

  name: "MainWindow",

  props: ["id", "title", "closeWindows", "state", "sourcePP", "theme", "dragArea"],

  data() {
    return {
      isLoaded: false,
      button_height: 30,
      listBoxSelected: false,
      nameGS: "",
      descGS: "",
      idNewVariant: null,
      listBoxSourceGenscheme: {},
      listBoxSourcePP: {},
    }
  },

  // Слушатели переменных
  watch: {
    // При изменении флага меняется disable окна
    buttonFlag: function () {
      this.$refs.createWindowNewVariant.disabled = this.buttonFlag;
    },

    // Обновление списка listbox при изменении основного списка записей
    sourcePP: function () {
        if (this.$refs.buttonPP.disabled) {
          this.loadListBoxPP();
          try {
            this.$refs.listBox.source = this.listBoxSourcePP;
          } catch (e) {
            console.warn("Не удалось обновить список:\n", e);
          }
        }
    }
  },

  // Перевычисляемые переменные
  computed: {
    // Проверка поля "имя нового варианта" на пустоту, проверка на выбор элемента из списка
    // При соблюдении условий включается кнопка "создать"
    buttonFlag: function () {
      let nameGS = this.nameGS ? this.nameGS.replace(/\s+/g, ' ').trim() : this.nameGS;
      return !(Boolean(this.listBoxSelected) && (nameGS !== null && nameGS !== ""))
    },
  },

  methods: {
    disableButtons() {
      $("#buttonPP").addClass("no-events");
      $("#buttonGenscheme").addClass("no-events");
      $("#lowerMenu").addClass("no-events");
    },

    enableButtons() {
      $("#buttonPP").removeClass("no-events");
      $("#buttonGenscheme").removeClass("no-events");
      $("#lowerMenu").removeClass("no-events");
    },

    // Загрзука списка на основе существующего расчета ПП
    loadListBoxPP() {
      let t = this;
      this.listBoxSourcePP = {};
      this.sourcePP.filter(function (item) {
        t.listBoxSourcePP[item.var_id] = item.var_name;
      });
    },

    // Загрузка данных с бд
    loadListBoxData() {
      let t = this;

      t.isLoaded = false;
      t.disableButtons();

      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?DefName=PPL_GK_Defs_JS",
        querySet: "GET_GS_VARS_GS"
      });

      xmlQuery.query('json',

          function (json) {
            t.listBoxSourceGenscheme = {};
            json.GS_VARIANT.filter(function (item) {
              t.listBoxSourceGenscheme[item.var_id] = item.name;
            })
            xmlQuery.destroy();
            t.isLoaded = true;
            t.$refs.listBox.source = t.listBoxSourceGenscheme;
            t.enableButtons();
          },

          function (ER) {
            xmlQuery.destroy();
            t.isLoaded = true;
            t.enableButtons();
            console.log("Error update data");
            console.log(ER);
          }
      )
    },

    // Загрузка данных в бд (создание нового варианта)
    uploadNewVar() {
      let t = this
      t.isLoaded = false;
      t.disableButtons();

      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=PPL_GK_Defs_JS",
        querySet: "CREATE_VAR"
      });

      let var_gs_var_id;
      if (t.$refs.buttonGenscheme.disabled) {
        var_gs_var_id = t.listBoxSelected.value
        console.debug("Выбрана генсхема №" + var_gs_var_id + " (" + t.listBoxSelected.label + ")");

      } else if (t.$refs.buttonPP.disabled) {
        this.sourcePP.filter(function (item) {
          if (item.var_id + "" === t.listBoxSelected.value) {
            var_gs_var_id = item.var_gs_var_id;
            console.debug("Выбран вариант №" + item.var_id + " (" + item.var_name + ")" + " с генсхемой №" + var_gs_var_id + " (" + item.gs_name + ")");
          }
          ;
        })
      } else {
        console.error("Ошибка: не найдены кнопки " + t.$refs.buttonGenscheme.value + " и " + t.$refs.buttonPP.value);
      }


      xmlQuery.clearFilter();
      xmlQuery.setFilter("GS_VAR_ID", var_gs_var_id, "text");
      xmlQuery.setFilter("GS_YEAR", new Date().getFullYear(), "text");
      xmlQuery.setFilter("GS_NAME", this.nameGS, "text");
      xmlQuery.setFilter("GS_DESC", this.descGS, "text");

      xmlQuery.query('json',
          function (json) {
        console.log(json);
            t.idNewVariant = json.rows[0].var_id;
            console.log("Создан вариант с id ", t.idNewVariant);
            t.$root.$children[0].refreshAllMainWindows();
            t.isLoaded = true;
            t.enableButtons();
            t.closeWindows();
            xmlQuery.destroy();
          },
          function (ER) {
            t.isLoaded = true;
            t.enableButtons();
            console.log("Error update data");
            console.log("ERROR = ", ER);
            xmlQuery.destroy();
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
        this.loadListBoxData();
        // Кнопка 2 (пп)
      } else if (($(this.$refs.buttonPP.componentSelector)[0] === pressed_button)) {
        button = this.$refs.buttonPP;
        button.disabled = true;
        this.loadListBoxPP();
        this.$refs.listBox.source = this.listBoxSourcePP;
      } else {
        console.error("Кнопка не найдена");
      }
    },

    // Сохранение выбранного пункта меню при изменении выбора
    onListBoxSelect() {
      this.listBoxSelected = this.$refs.listBox.getSelectedItem();
    },

  },

  mounted() {
    this.loadListBoxData();
  },
}

</script>

<style scoped>

.no-events {
  pointer-events: none;
  opacity: 0.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

</style>
