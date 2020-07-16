<template>
  <JqxWindow :width="300"
             :height="'auto'"
             :max-height="190000"
             :max-width="190000"
             :min-width="924"
             :min-height="300"
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

    <div ref="content" style=" top: 0px; width: 100%; background-color: rgb(0,0,255); ">

      <div style="background-color: rgb(255,0,0); width: 100%; position: absolute; top: 0px; margin-top: 31px; margin-right: 60px" :style="{bottom: button_height+'px'}">

<!--        <div style="height: 31px; width: 100%; position:relative; top: 0px"></div>-->
        <JqxGrid style="position:relative; height: 100%" ref="myGrid" :width="'100%'" :source="dataAdapter" :columnsmenu="false"
                 :columns="columns" :pageable="false" :autoheight="false"
                 :sortable="true" :altrows="true" :enabletooltip="true"
                 :editable="false" :selectionmode="'singlerow'" >
        </JqxGrid>


      </div>

      <div class="btn-group" >
<!--        :style="{ bottom: button_height+'px' }"-->
          <JqxButton  ref="myTextImageButton1" @click="this.$root.$children[0].createWindowNewVariant" :width="120" :height="button_height"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'}"
          >Создать новый вариант
          </JqxButton>
          <JqxButton  ref="myTextImageButton2" :width="120" :height="button_height+'px'"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'}"
          >
          </JqxButton>
          <JqxButton  ref="myTextImageButton3" :width="120" :height="button_height+'px'"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'}"
          >
          </JqxButton>
          <JqxButton  @click="updateGridFromURL" ref="refreshTable" :width="120" :height="button_height+'px'"
                      :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                      :theme="theme" :style="{'display': 'inline-block'}"
          >Обновить
          </JqxButton>
          <JqxButton  ref="closeButton" @click="closeWindows" :width="120" :height="button_height+'px'"
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
      }
    },

    methods: {
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
          t.source.datafields = json.metaData.fields;
          t.source.localdata = json.rows;
          t.$refs.myGrid.updatebounddata();
          xmlQuery.destroy();
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
      this.updateGridFromURL();
    },

    mounted() {
    },


  }
</script>

<style scoped>
  .btn-group {
    /*background-color: #545454;*/
    background-color: green;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 80%;
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
