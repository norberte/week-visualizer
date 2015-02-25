$(document).ready(function() {                                                  //jQuery crash course:
                                                                                //When the document is done loading, do the function(){code}
    /***************************************************************************
    **Initialization
    */
    
    //Initialize start and end hours to those selected in the html
    var startHour = parseInt($("#list_startHour").val());
    var endHour = parseInt($("#list_endHour").val());
	var beforeStartHourDefault = "busy";
	var afterEndHourDefault = "";
    
    //I think the table array should be of bytes not ints
    //Because we are going to be outputing in ACSII, which is the same size
    //Essentially 4 table cells will fit into each element of the array
    //The array stores in decimal you may need to convert from binary to decimal
	
	//For the raw 0, 1, 2 values
	var intTableArray = [];
	//I have a new idea for the compression. I should do this part. -Kevin
    var compressedByteTableArray = new Uint8Array();
    
    clipTable();
    
    /***************************************************************************
    **Events
    */
    
	//Disable context menu and apply classes
    $("#week-table tr td").on("contextmenu", function() {                       //$("Element to do stuff on").on("Event to trigger function", function(){code});
        $(this).removeClass("free busy");                                       //this = "#week-table tr td", remove both free and busy classes
        return false;                                                           //return false removes the right-click menu
    });
	
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
	
	//Update the table if a default is changed
	$("span.radGroup_default input:radio").change(function(){
		clipTable();
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
            //Right mouse. Handled at top of section to disable the context menu
            case 3:
                break;
            default:
        }
    });
	
	//Detects output button press and calls function to make a string.
	$("#finished").click(function() {		
		sumTable();
	});
    
    /***************************************************************************
    **Functions
    */
    
    function resetTable() {
        for(var n = 0; n <= 23; n++) {
            if(n < startHour) {
                setHourClass(n, getRadioGroupVal("startCutoffDefault"));
            }
            else if(endHour < n) {
				setHourClass(n, getRadioGroupVal("endCutoffDefault"));
            }
			else {
				removeHourClasses(n);
			}
        }
    }
    
    function resetTable(htmlClass) {
        for(var n = 0; n <= 23; n++) {
            if(n < startHour) {
                setHourClass(n, getRadioGroupVal("startCutoffDefault"));
            }
            else if(endHour < n) {
				setHourClass(n, getRadioGroupVal("endCutoffDefault"));
            }
			else {
				setHourClass(n, htmlClass);
			}
        }
    }
    
    //Hide the rows not within the start and end times
    function clipTable() {
        for(var n = 0; n <= 23; n++) {
            if(n < startHour) {
				hideHour(n);
                setHourClass(n, getRadioGroupVal("startCutoffDefault"));
            }
            else if(endHour < n) {
				hideHour(n);
				setHourClass(n, getRadioGroupVal("endCutoffDefault"));
            }
			else {
				showHour(n);
			}
        }
        // Hide the half hours if the relevant checkbox is checked
        if(!$("#cb_showHalfHour").prop("checked")) {
            hideHalfHours();
        }
    }
	
	//Get the value from a group of radio buttons by name
	function getRadioGroupVal(name) {
		return $('input:radio[name="' + name + '"]:checked').val();
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
    
    //Set and remove classes for rows
    function setRowClass(n, htmlClass) {
        removeRowClasses(n);
		//If string is not empty
		if(htmlClass) {
			$("#week-table tr.hour:eq(" + n + ") td").addClass(htmlClass);
		}
    }
    function removeRowClasses(n, htmlClasses) {
        $("#week-table tr.hour:eq(" + n + ") td").removeClass(htmlClasses);
    }
    function removeRowClasses(n) {
        $("#week-table tr.hour:eq(" + n + ") td").removeClass("free busy");
    }
    
    //Set and remove classes for columns
    function setColumnClass(m, htmlClass) {
        removeColumnClasses(m);
		//If string is not empty
		if(htmlClass) {
			$("#week-table tr td:nth-child(" + (m+1) + ")").addClass(htmlClass);
		}
    }
    function removeColumnClasses(m, htmlClasses) {
        $("#week-table tr td:nth-child(" + (m+1) + ")").removeClass(htmlClasses);
    }
    function removeColumnClasses(m) {
        $("#week-table tr td:nth-child(" + (m+1) + ")").removeClass("free busy");
    }
    
    //Set and remove classes for full hours
    function setHourClass(n, htmlClass) {
		removeHourClasses(n);
		//If string is not empty
		if(htmlClass) {
			$("#week-table tr.hour_" + n + " td").addClass(htmlClass);
		}
    }
    function removeHourClasses(n, htmlClasses) {
        $("#week-table tr.hour_" + n + " td").removeClass(htmlClasses);
    }
    function removeHourClasses(n) {
        $("#week-table tr.hour_" + n + " td").removeClass("free busy");
    }
	
	//Makes Giant-ass string of mostly 0s, with a few 1s and 2s
	//Function loops through entire table, so it includes all cells
	//even if they are not shown... :( <<< That's actually what we need -Kevin
	
	//If using chrome right click page and select "inspect Element"
	//this is where you will see the output of the console.log, it 
	//is handy for knowing what order the table is parsed.
	function sumTable() {
		intTableArray = [];
		$('#week-table tr').each(function () {	
			console.log("*****************");
			console.log( "" + this.className);
			console.log("*****************");
			 $("td", this).each(function(){	
				console.log(this.className);
				if($(this).hasClass("busy")){					
					intTableArray.push(2);
				}else if($(this).hasClass("free")){
					intTableArray.push(1);
				}else{
					intTableArray.push(0);
				}; 
			});		
		});				
		document.getElementById("Output").innerHTML = intTableArray.join("");
	}
});
