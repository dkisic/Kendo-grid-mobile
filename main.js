function hideNbsp(element) {
    var text = element.html();
    //replacing nbsp value
    text = text.replace(/&nbsp;/g, '');
    element.html(text);
}

function kendoGridDataBound(e) {
    var grid = e.sender;
    var columns = grid.columns;

    //checking if grid is grouped any by how many columns
    var numItems = grid.dataSource.group().length;

    //selecting all grid cells
    var cells = grid.tbody.find("tr[role='row']").not(".k-grouping-row").find("td");

    //checking if grid is hierarchical and appending value (1 if yes, 0 if no)
    var hierarchicalGridNum = grid.tbody.find("tr[role='row'].k-master-row").length > 0 ? 1 : 0;
    var currentCell, column;

    //iterating through grid cells
    for (var i = 0; i < cells.length; i++) {
        currentCell = $(cells[i]);
        //getting the column in which cell belongs
        //if grid is grouped or hierachical the cells are appended to the beginning of row 
        //so we take away numItems(nr of groups) and hierarchicalGridNum(hierarchical grid ?) from cell index
        column = columns[currentCell.index() - numItems - hierarchicalGridNum];

        if (column) {
            //checking that title doesn't match '&nbsp;'
            if (column.title !== '&nbsp;') {
                //adding data-title attribute to cell with value of column title
                currentCell.attr("data-title", column.title);
            }
        }
    }

    //iterating through footer cells
    var footerCells = $(".k-footer-template td").not(".k-group-cell");
    var currentFooterCell;

    for (var j = 0; j < footerCells.length; j++) {
        currentFooterCell = $(footerCells[j]);
        column = columns[currentFooterCell.index() - numItems];

        if (column) {
            currentFooterCell.attr("data-title", column.title + " (" + abp.localization.localize("Total", "BI") + ")");
            hideNbsp(currentFooterCell);
        }
    }
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