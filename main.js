function hideNbsp(element) {
    var text = element.html();
    //replacing nbsp value
    text = text.replace(/&nbsp;/g, '');
    element.html(text);
}

function kendoGridDataBound(e) {
    var grid = e.sender;
    var columns = grid.columns;
    var column;

    //checking if grid is grouped and by how many columns
    var numItems = grid.dataSource.group().length;

    //checking if grid is hierarchical and appending value (1 if yes, 0 if no)
    var hierarchicalGridNum = grid.tbody.find("tr[role='row'].k-master-row").length > 0 ? 1 : 0;

    //selecting all grid cells
    var cells = grid.tbody.find("tr[role='row']").not(".k-grouping-row").find("td");

    //iterating through grid cells
    cells.each(function (index) {
        //if grid is grouped or hierachical we subtract numItems and hierarchicalGridNum from current cell index
        //we do it because kendo appends extra cells to beginning of every row if the grid is grouped or hierarchical
        //and then we get the column that current cell really belongs to
        column = columns[$(this).index() - numItems - hierarchicalGridNum];

        if (column) {
            if (column.title !== '&nbsp') {
                //adding data-title attribute to cell with value of column title
                $(this).attr("data-title", column.title);
            }
        }
    });

    //handling footer
    var footerCells = $(".k-footer-template td").not(".k-group-cell");

    //we do the same thing for footer
    footerCells.each(function (index) {
        column = columns[$(this).index() - numItems];

        if (column) {
            $(this).attr("data-title", column.title + " (" + abp.localization.localize("Total", "BI") + ")");
            hideNbsp($(this));
        }
    });
}

function setKendoGridsForMobileDisplay() {
    //iterating through every kendo grid and binding function which is triggered on dataBound event
    $('.k-grid').each(function (i, obj) {
        var grid = $("#" + obj.id).data("kendoGrid");
        grid.bind("dataBound", kendoGridDataBound);
    });
}


$(document).ready(function () {
    setKendoGridsForMobileDisplay();
});
