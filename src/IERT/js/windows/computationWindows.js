import Window from "@/IERT/js/engine/Window"
import appConfig from "@/IERT/js/appConfig";

function NewComputationProto() {

    /*
    var windows = new NewWindows.mounted({
        title: "Перечень вариантов расчета плана формирования2",
        minWidth: 740,
        width: 740,
        minHeight: 740,
        height: 740,
        position: {x: 20, y: 40},
        maximaize: true,
        full: false,
    });
    //var windowHTML = formsWindow["Computation.html"];
    // var xmlQuery = new XmlQuery();
    // xmlQuery.setUrl(appConfig.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=" + appConfig.definitions);
    // xmlQuery.setQueryName("GET_VARS");
    // xmlQuery.setFilter("APP_NAME", appConfig.appName, "text");
    // xmlQuery.setFilter("USER_ID", "2014050617545646", "text");
    // xmlQuery.query('xml', successQuery, errorQuery)
    // windows.updateContent(windowHTML);
    //$(windows.id + "add").on('click', NewLoadChessToServer)


    function successQuery(data) {
        var jsObject = [];
        $(data).find('VARIANT').each(function () {
            jsObject.push({
                var_id: $(this).find('var_id').text(),
                name: $(this).find('name').text(),
                date_cr: $(this).find('date_cr').text(),
                fact_calc_fl: (parseInt($(this).find('fact_calc_fl').text()) === 1) ? "Фактически" : "Плановые",
                date_str: $(this).find('date_str').text().split(" ")[0]
            });
        });
        var gridOption = {
            fields: jQuery.extend(true, [], mainGridField),
            div: windows.id + 'grid',
            gridOptions: {
                columns: jQuery.extend(true, [], mainGridField),
                ready: windows.deleteHide,
                columnsresize: false
            },
            data: {rows: jsObject}
        };
        var infoGrid = windows.addGrid(gridOption.div, gridOption);
    }

    function errorQuery(data) {
        console.log(data)
    }

    var mainGridField = [
        {
            name: 'name',
            datafield: "name",
            type: "string",
            text: "Название варианта",
            editable: false,
        },
        {
            name: 'date_cr',
            datafield: "date_cr",
            type: "string",
            text: "Вариант создан",
            editable: false,
        },
        {
            name: 'fact_calc_fl',
            datafield: "fact_calc_fl",
            type: "string",
            text: "Корреспонденция",
            editable: false,
        },
        {
            name: 'date_str',
            datafield: "date_str",
            type: "string",
            text: "Месяц расчета",
            editable: false,
        }
    ];
    */
}

export default NewComputationProto;
