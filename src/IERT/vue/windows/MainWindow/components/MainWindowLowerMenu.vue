<template>
  <div>
    <ul class="btn-group" :height="button_height">
      <li>
        <JqxButton ref="createWindowNewVariant" @click="this.$root.$children[0].createWindowNewVariant"
                   :height="button_height+'px'"
                   :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                   :theme="theme" :style="{'display': 'inline-block'} "
        ><span class="nobr">Создать новый вариант&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </JqxButton>
      </li>
      <li>
        <JqxButton class="button" ref="workVariant" @click="workVariant"
                   :height="button_height+'px'" :textPosition="'left'"
                   :textImageRelation="'imageBeforeText'"
                   :theme="theme" :style="{'display': 'inline-block'}"
        ><span class="nobr">Изменить&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </JqxButton>
      </li>
      <li>
        <JqxButton class="button" @click="deleteVariant" ref="buttonDeleteVariant" :width="120"
                   :height="button_height+'px'"
                   :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                   :theme="theme" :style="{'display': 'inline-block'}"
        ><span class="nobr">Удалить&nbsp;&nbsp;</span>
        </JqxButton>
      </li>
      <li class="last">
        <JqxButton class="button" @click="updateGridFromURL" ref="buttonRefreshTable" :width="120"
                   :height="button_height+'px'"
                   :textImageRelation="'imageBeforeText'" :textPosition="'left'" :disabled="true"
                   :theme="theme" style="display:inline-block; cursor: pointer;"
        ><span class="nobr">Обновить&nbsp;&nbsp;</span>
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
</template>

<script>
    import JqxButton from "@/jqwidgets/jqwidgets-vue/vue_jqxbuttons";
    import appConfig from "@/IERT/js/appConfig";

    export default {
      name: "LowerMenu",

      props: ["userData"],

      components: {
        JqxButton,
      },

      data() {
        return {
          theme: appConfig.windowsTheme,
          button_height: 30,
        }
      },

      mounted() {
      }

    }
</script>

<style scoped>

  ul {
    text-align: justify;
    /* Лекарство для IE6-7*/
    text-justify: newspaper;
  }

  ul li {
    display: inline-block;
    text-align: left;
    /* эмуляция inline-block для IE6-7*/
  // display: inline;
  // zoom: 1;
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

  /*.button {*/
  /*  display: inline-block;*/
  /*  margin-right: 10px;*/
  /*  margin-left: 10px;*/

  /*}*/

  .btn-group {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }

</style>
