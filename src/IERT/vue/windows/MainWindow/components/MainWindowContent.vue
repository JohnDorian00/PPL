<template>
  <!--            FLEXBOX-->
  <!--        <rows ref="Rows" :rowsProps="rows"></rows>-->

  <!--      Таблица-->
  <div
    style="background-color: rgba(255,0,0,0); width: 100%; position: relative; top: 0; margin-right: 60px; height: calc(100% - 76px)">
<!--    <Preloader v-if="!isLoaded"></Preloader>-->
<!--    v-show="isLoaded"      :source="dataAdapter"         @rowselect="onRowselect"-->
    <JqxGrid   style="position:relative;" ref="myGrid" :height="'100%'" :width="'100%'"
               :columnsmenu="false" :columns="columns" :pageable="false" :autoheight="false"
              :columnsresize="true"
              :sortable="true" :altrows="true"
              :enabletooltip="true" :columnsautoresize="true" :editable="false" :selectionmode="'singlerow'"
              :theme="theme" :filterable="true" :filtermode="'excel'" :sortmode="'columns'" :showfilterrow="true">
    </JqxGrid>
  </div>
</template>

<script>
    import appConfig from "@/IERT/js/appConfig";
    import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
    import JqxButton from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
    import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid";
    import Preloader from "@/IERT/vue/Preloader";
    import Rows from "@/IERT/vue/tabel/flex-row";
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

      name: "MainWindowContent",

      data() {
        return {
          theme: appConfig.windowsTheme,
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
          isUpdate: false,


        }
      },

      beforeCreate: function () {
        this.source = {
          datatype: 'json',
        };
      },

    }
</script>

<style scoped>

</style>
