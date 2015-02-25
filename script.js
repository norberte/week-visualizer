$(document).ready(function() {                                                  //jQuery crash course:
                                                                                //When the document is done loading, do the function(){code}
    /***************************************************************************
    **Initialization
    */
    
    //Initialize start and end hours to those selected in the html
    var startHour = parseInt($("#list_startHour").val());
    var endHour = parseInt($("#list_endHour").val());
    
    //I think the table array should be of bytes not ints
    //Because we are going to be outputing in ACSII, which is the same size
    //Essentially 4 table cells will fit into each element of the array
    //The array stores in decimal you may need to convert from binary to decimal
    var tableArray = new Uint8Array(84);
    
    clipTable();
    
    //Disable context menu and apply classes
    $("#week-table tr td").on("contextmenu", function() {                       //$("Element to do stuff on").on("Event to trigger function", function(){code});
        $(this).removeClass("free busy");                                       //this = "#week-table tr td", remove both free and busy classes
        return false;                                                           //return false removes the right-click menu
    });
    
    /***************************************************************************
    **Events
    */
    
    //Constrain the start and end hours to sensible values
    //Then update the table to reflect the changes
    $("#list_startHour").change(function() {                                    //When the value property of #list_startHour changes, do function(){code}
        startHour = parseInt($(this).val());                                    //this.val() = The selected value of the element
        if(endHour < startHour) {
            endHour = startHour;
            $("#list_endHour").val(startHour);                                  //this.val(foo) = Set the selected value to foo
        }
        clipTable();
    });
    $("#list_endHour").change(function() {
        endHour = parseInt($(this).val());
        if(startHour > endHour) {
            startHour = endHour;
            $("#list_startHour").val(endHour);
        }
        clipTable();
    });
    
    //Show or hide the weekend columns
    $("#cb_weekend").change(function() {                                        //When the checkbox #cb_weekend changes
        if($("#cb_weekend").prop("checked")) {                                  //If the property checked is true
            showColumn(6);
            showColumn(7);
        }
        else {
            hideColumn(6);
            hideColumn(7);
            setColumnClass(6, "busy");
            setColumnClass(7, "busy");
        }
    });
    
    //Show or hide the second half of each hour
    $("#cb_showHalfHour").change(function() {
        if($("#cb_showHalfHour").prop("checked")) {
            showHalfHours();
            clipTable();
        }
        else {
            hideHalfHours();
        }
    });
    
    //Reset to free button
    $("#btn_resetFree").click(function() {                                      //When "#btn_resetFree" is clicked do function(){code}
        resetTable("free");
    });
    
    //Reset to busy button
    $("#btn_resetBusy").click(function() {
        resetTable("busy");
    });
    
    //Reset button
    $("#btn_reset").click(function() {
        resetTable();
    });
    
    //Ability to select free times, busy times, and reset
    $("#week-table tr td").click(function(event) {                          
        switch (event.which) {                                                  //event.which returns the value of the mouseclick in this case
            //Left mouse
            case 1:
                //If green toggle one, otherwise toggle both
                if(!$(this).hasClass("free") && !$(this).hasClass("busy")) {    //hasClass returns true if the element has the specified class
                    $(this).toggleClass("free");                                //Self explanatory
                }
                else {
                    $(this).toggleClass("free");
                    $(this).toggleClass("busy");
                }
                break;
            //Middle mouse. Unused
            case 2:
                break;
            //Right mouse. Handled in initialization to disable the context menu
            case 3:
                break;
            default:
        }
    });
    
    /***************************************************************************
    **Functions
    */
    
    function resetTable() {
        for(var n = 0; n <= 23; n++) {
            if(startHour <= n && n <= endHour) {
                $("#week-table tr.hour_" + n + " td").removeClass("free busy");
            }
            else {
                $("#week-table tr.hour_" + n + " td").removeClass("free");
                $("#week-table tr.hour_" + n + " td").addClass("busy");
            }
        }
    }
    
    function resetTable(htmlClass) {
        for(var n = 0; n <= 23; n++) {
            if(startHour <= n && n <= endHour) {
                $("#week-table tr.hour_" + n + " td").removeClass("free busy");
                $("#week-table tr.hour_" + n + " td").addClass(htmlClass);
            }
            else {
                $("#week-table tr.hour_" + n + " td").removeClass("free");
                $("#week-table tr.hour_" + n + " td").addClass("busy");
            }
        }
    }
    
    //Hide the rows not within the start and end times
    function clipTable() {
        for(var n = 0; n <= 23; n++) {
            if(startHour <= n && n <= endHour) {
                showHour(n);
            }
            else {
                hideHour(n);
                setHourClass(n, "busy")
            }
        }
        // Hide the half hours if the relevant checkbox is checked
        if(!$("#cb_showHalfHour").prop("checked")) {
            hideHalfHours();
        }
    }
    
    //Show and hide rows
    function showRow(n) {
        $("#week-table tr.hour:eq(" + n + ")").show();                          //If hidden, reveal the element. :eq(n) means select the nth matched element
    }
    function hideRow(n) {
        $("#week-table tr.hour:eq(" + n + ")").hide();                          //If visible, hide the element (actually takes up no space, not just invisible)
    }
    
    //Show and hide columns
    function showColumn(m) {
        $("#week-table tr *:nth-child(" + (m+1) + ")").show(); //(m+1) to keep things 0 index based. For some reason :eq is not working.
    }
    function hideColumn(m) {
        $("#week-table tr *:nth-child(" + (m+1) + ")").hide();                  //:nth-child() is like :eq(), but gives the index including non-matched siblings
    }
    
    //Show and hide full hours
    function showHour(n) {
        $("#week-table tr.hour_" + n).show();
    }
    function hideHour(n) {
        $("#week-table tr.hour_" + n).hide();
    }
    
    //Show and hide all half hours
    function showHalfHours() {
        $("#week-table tr.half").show();
    }
    function hideHalfHours() {
        $("#week-table tr.half").hide();
        $("#week-table tr.half td").removeClass("free busy");
        /*
        **TODO: For every first half of the hour with class
        **Add same class to second half of the hour.
        **E.g. Set 1:00 as busy, hide half hours. Now the 1:00-1:30 block
        **is set, but the 1:30-2:00 block is not. This is bad. In the
        **"full hour" mode, a selection should cover 1:00-2:00.
        */
    }
    
    //Add and remove classes for rows
    function setRowClass(n, htmlClass) {
        removeRowClasses(n);
        $("#week-table tr.hour:eq(" + n + ") td").addClass(htmlClass);
    }
    function removeRowClasses(n, htmlClasses) {
        $("#week-table tr.hour:eq(" + n + ") td").removeClass(htmlClasses);
    }
    function removeRowClasses(n) {
        $("#week-table tr.hour:eq(" + n + ") td").removeClass("free busy");
    }
    
    //Add and remove classes for columns
    function setColumnClass(m, htmlClass) {
        removeColumnClasses(m);
        $("#week-table tr td:nth-child(" + (m+1) + ")").addClass(htmlClass);
    }
    function removeColumnClasses(m, htmlClasses) {
        $("#week-table tr td:nth-child(" + (m+1) + ")").removeClass(htmlClasses);
    }
    function removeColumnClasses(m) {
        $("#week-table tr td:nth-child(" + (m+1) + ")").removeClass("free busy");
    }
    
    //Add and remove classes for full hours
    function setHourClass(n, htmlClass) {
        removeHourClasses(n);
        $("#week-table tr.hour_" + n + " td").addClass(htmlClass);
    }
    function removeHourClasses(n, htmlClasses) {
        $("#week-table tr.hour_" + n + " td").removeClass(htmlClasses);
    }
    function removeHourClasses(n) {
        $("#week-table tr.hour_" + n + " td").removeClass("free busy");
    }
});
