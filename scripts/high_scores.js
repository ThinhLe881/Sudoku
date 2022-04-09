window.onload = function() {
    var records = [];
    var headers = ["Date", "Duration"];
    var scoresBoard = document.getElementById("scores-board");
    var resetBtn = document.getElementById("reset-btn");

    function allRecords() {
        var values = [];
        var keys = Object.keys(localStorage);
        var i = keys.length;
        while (i--) {
            values.push(JSON.parse(localStorage.getItem(keys[i])));
        }
        return values;
    }

    records = allRecords();
    createTable();

    function createTable() {
        var table = document.createElement('table');
        table.setAttribute("id", "scores-table");
        var headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            var header = document.createElement('th');
            var textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);
        records.forEach(record => {
            var row = document.createElement('tr');
            Object.values(record).forEach(text => {
                var cell = document.createElement('td');
                var textNode = document.createTextNode(text);
                cell.appendChild(textNode);
                row.appendChild(cell);
            })
            table.appendChild(row);
        });
        scoresBoard.appendChild(table);
    }
    
    resetBtn.onclick = function() {
        localStorage.clear();
        var table = document.getElementById("scores-table");
        if (table) table.parentNode.removeChild(table);
        records = allRecords();
        createTable();
    }
}