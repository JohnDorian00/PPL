<template>
  <JqxWindow :width="300"
             :height="'auto'"
             :max-height="190000"
             :max-width="190000"
             :min-width="563"
             :min-height="211"
             :position="{ x: 150, y: 220 }"
             :id="id"
             :theme="theme"
             :closeButtonSize="0"
             @close="closeWindows">
    <!--             :title="title"-->
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
    <div>
      <div>
        <JqxGrid ref="myGrid" :width="'100%'" :source="dataAdapter"
                 :columns="columns" :pageable="true" :autoheight="true"
                 :sortable="true" :altrows="true" :enabletooltip="true"
                 :editable="true" :selectionmode="'multiplecellsadvanced'" >
        </JqxGrid>
      </div>

      <div class="btn-group">
        <JqxButton  ref="myTextImageButton1" @click="this.$root.$children[0].createWindowNewVariant" :width="120" :height="40"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{'display': 'inline-block'}"
        >Создать новый вариант
        </JqxButton>
        <JqxButton  ref="myTextImageButton2" :width="120" :height="40"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{'display': 'inline-block'}"
        >
        </JqxButton>
        <JqxButton  ref="myTextImageButton3" :width="120" :height="40"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{'display': 'inline-block'}"
        >
        </JqxButton>
        <JqxButton  ref="closeButton" @click="closeWindows" :width="120" :height="40"
                    :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                    :theme="theme" :style="{ 'display': 'inline-block'}"
        >Закрыть
        </JqxButton>
      </div>

    </div>
  </JqxWindow>
</template>

<script>
  import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
  import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
  import appConfig from "@/IERT/js/appConfig";
  import JqxGrid from "@/jqwidgets/jqwidgets-vue/vue_jqxgrid.vue";
  import XmlQuery from "@/IERT/js/xmlQuery";

  export default {
    components: {
      JqxWindow,
      JqxButton,
      JqxGrid
    },
    name: "MainWindow",
    props: ["id", "title", "closeWindows", "state"],
    data() {
      return {
        theme: appConfig.windowsTheme,
        dataAdapter: null,
        columns: [
          { text: 'id', datafield: 'var_id', width: 250 },
          { text: 'year',  datafield: 'var_year', cellsalign: 'right', align: 'right' },
        ],
      }
    },

    methods: {
    },

    beforeCreate: function () {
      let t = this;

      let xmlQuery = new XmlQuery({
        url: appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?DefName=PPL_GK_Defs",
        querySet: 'GET_VARS'
      });

      xmlQuery.query('json', successQuery, function (ER) {
        console.log(ER);
        xmlQuery.destroy();
      })

      function successQuery(data) {
        debugger
        let source = {
                        datatype: 'json',
                        datafields: [
                                      { name: 'var_id' },
                                      { name: 'var_year' },
                                    ],
                        localdata: {var_id: 0, var_year: 0},
                      };

        // TODO Разобраться с обновлением грида
        let dataAdapter = new $.jqx.dataAdapter(source);
        t.$refs.myGrid.refresh();
      }

      // this.source = {
      //               datatype: 'json',
      //               datafields: [
      //                             { name: 'var_id' },
      //                             { name: 'var_year' },
      //                           ],
      //               localdata: {var_id: 0, var_year: 0},
      //             };

    },

    created() {

    },

    mounted() {
    },


  }
</script>

<style scoped>
  .btn-group {
    background-color: #545454;
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
