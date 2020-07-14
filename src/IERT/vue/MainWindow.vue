<template>
  <JqxWindow :width="300"
             :height="'auto'"
             :max-height="190000"
             :max-width="190000"
             :position="{ x: 150, y: 220 }"
             :title="title"
             :id="id"
             :theme="theme"
             @close="closeWindows">
    <div>{{title}}</div>
    <div>
      <div>
        A database management system (DBMS) is a software package with computer programs
        that control the creation, maintenance, and the use of a database. It allows organizations
        to conveniently develop databases for various applications by database administrators
        (DBAs) and other specialists. A database is an integrated collection of data records,
        files, and other database objects...
        <JqxButton ref="myTextImageButton" :width="120" :height="40"
                   :textImageRelation="'imageBeforeText'" :textPosition="'left'"
                   :theme="theme"
        >
        </JqxButton>
      </div>
    </div>
  </JqxWindow>
</template>

<script>
  import JqxWindow from "@/jqwidgets/jqwidgets-vue/vue_jqxwindow";
  import JqxButton from '@/jqwidgets/jqwidgets-vue/vue_jqxbuttons.vue';
  import appConfig from "@/IERT/js/appConfig";

  export default {
    components: {
      JqxWindow,
      JqxButton
    },
    name: "MainWindow",
    props: ["id", "title", "closeWindows", "state"],
    data() {
      return {
        theme: appConfig.windowsTheme,
      }
    },
    methods: {},

    mounted() {

    }

  }
</script>

<style scoped>

</style>
