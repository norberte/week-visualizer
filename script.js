$(document).ready(function() {                                                  //jQuery crash course:
                                                                                //When the document is done loading, do the function(){code}
    /***************************************************************************
    **Initialization
    */
	
	Parse.initialize("viAaWs9CN1lZEZDhwotmYK6CnXemexeAnbmHfobX", "nT9VMVPNj0I53354nbc6NldWnWQkeZyM9w6rLqNU");  // initialize Parse
	
	var TestObject = Parse.Object.extend("TestObject"); 
	var testObject = new TestObject(); // declare a test object
	testObject.save({foo: "bar"}).then(function(object) {  // save test data
        alert("yay! it worked"); // I used this to see if it works
    });  
    
    //Initialize start and end hours to those selected in the html
    var startHour = parseInt($("#list_startHour").val());
    var endHour = parseInt($("#list_endHour").val());
    var beforeStartHourDefault = "busy";
    var afterEndHourDefault = "";
    
    showIndex();
    
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
    
    //Change the view between table creation and heat map
    $("span.radGroup_view input:radio").change(function(){
        var val = getRadioGroupVal("view");
        if(val === "index") {
            showIndex();
        }
        else if(val === "heatMap") {
            showHeatMap();
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
    
    //Create heat map button
    $("#btn_createHeatmap").click(function() {
        var input = $("#txta_input").val();
        createHeatMap(getScoreArray(parseString(input)));
    });
    
    //Ability to select free times, busy times, and reset
    $("#week-table tr td").click(function(event) {                          
        switch (event.which) {                                                  //event.which returns the value of the mouse click
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
        $("#output").val(getIntArray().join(""));
        document.getElementById("compressedOutput").innerHTML = encodeIntArray(getIntArray());
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
    
    function showIndex() {
        $(".heatMap *").hide();
        $(".index *").show();
        clipTable();
        //Fixes weird visual bug
        $(".radGroup_default.right").css("display", "inline");
    }
    
    function showHeatMap() {
        $(".index *").hide();
        $(".heatMap *").show();
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
        $("#week-table tr *:nth-child(" + (m+1) + ")").hide();                  //:nth-child() is like :eq(), but don't mix them up. Check out the official docs
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
        copyHoursToHalfHours()
    }
    function hideHalfHours() {
        $("#week-table tr.half").hide();
        copyHoursToHalfHours();
    }
    
    function copyHoursToHalfHours() {
        var arr = ["", "", "", "", "", "", ""];
        var count = 0;
        $('#week-table td').each(function() {
            if(0 <= count && count <= 6) {
                if($(this).hasClass("free")) {
                    arr[count] = "free";
                }
                else if($(this).hasClass("busy")) {
                    arr[count] = "busy";
                }
                else {
                    arr[count] = "";
                }
                count++;
            }
            else if(7 <= count && count <= 13) {
                $(this).removeClass("free busy");
                if(arr[count-7] !== "") {
                    $(this).addClass(arr[count-7]);
                }
                if(count === 13) {
                    count = 0;
                }
                else {
                    count++;
                }
            }
        });
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
    
    //Returns array of ints with table values (0, 1, 2)
    function getIntArray() {
        var intArray = [];
        $('#week-table td').each(function() {  
            if($(this).hasClass("busy")){                   
                intArray.push(2);
            }
            else if($(this).hasClass("free")){
                intArray.push(1);
            }
            else{
                intArray.push(0);
            };
        });
        return intArray;
    }
    
    /***************************************************************************
    **Heat Map functions
    */
    
    function fractionToColor(n) {
        // -1 = #ff0000 Red
        //-.5 = #ffff00 Yellow
        //  0 = #00ff00 Green
        //0.5 = #00ffff Cyan
        //  1 = #0000ff Blue
        //There may be a more mathematically clean way to do this
        if(-1.0 <= n && n <= -0.5) {
            //Color value from 0-255
            var green = Math.floor((n+1)*2*255);
            var hex = green.toString(16);
            //Pad the result to a width of 2
            hex = ("00" + hex).substring(hex.length);
            return "#ff" + hex + "00";
        }
        else if(n <= 0.0) {
            var red = Math.floor(n*(-2)*255);
            var hex = red.toString(16);
            hex = ("00" + hex).substring(hex.length);
            return "#" + hex + "ff00";
        }
        else if(n <= 0.5) {
            var blue = Math.floor(n*2*255);
            var hex = blue.toString(16);
            hex = ("00" + hex).substring(hex.length);
            return "#00ff" + hex;
        }
        else if(n <= 1.0) {
            var green = Math.floor((n-1)*(-2)*255);
            var hex = green.toString(16);
            hex = ("00" + hex).substring(hex.length);
            return "#00" + hex + "ff";
        }
        else {
            return "#ffffff"
        }
    }
    
    //May be redundant, but gonna keep this method here just in-case
    function parseString(string) {
        return string.split(",");
    }
    
    //"How Not to Sort by Average Rating" function
    function notAverage(pos, neg) {
        var sum = pos - neg;
        var total = pos + neg;
        
        if(total === 0) {
            return 0;
        }
        
        var z = 1.96;
        var ratio = sum/total;
        
        if(ratio >= 0) {
            return (ratio + z*z/(2*total) - z * Math.sqrt((ratio*(1-ratio)+z*z/(4*total))/total))/(1+z*z/total);
        }
        else {
            ratio *= -1;
            return -(ratio + z*z/(2*total) - z * Math.sqrt((ratio*(1-ratio)+z*z/(4*total))/total))/(1+z*z/total);
        }
    }
	
    //Takes an array of sets of table info (0, 1, and 2s. Can be an array of arrays or an array of strings)
    //Returns an array filled with the score for each cell
	function getScoreArray(decodedInputsArray) {
        //Initialize output array
        //Each element is an array of length 2
        //First value is the number of free votes, second value is the number of busy votes
		var finalArray = [];
		for(var k = 0; k < 336; k++) {
			finalArray.push([0,0]);
		}
		
		for(var i = 0; i < decodedInputsArray.length; i++) {
			for(var j = 0; j < 336; j++) {
				if(decodedInputsArray[i][j] == 1) {
					finalArray[j][0]++;
				}
                else if(decodedInputsArray[i][j] == 2) {
					finalArray[j][1]++;
				}
			}
		}
		
		for(var i = 0; i < finalArray.length; i++) {
			finalArray[i] = notAverage(finalArray[i][0], finalArray[i][1]);
		}
		
		return finalArray;
	}
	
    //Takes an array of scores and fills the table accordingly
	function createHeatMap(scoreArray) {
		var min = scoreArray[0];
		var max = scoreArray[0];
		
		for(var x = 1; x < scoreArray.length; x++) {
			if(scoreArray[x] > max) {
				max = scoreArray[x];
			}
			
			if(scoreArray[x] < min) {
				min = scoreArray[x];
			}
		}
        
        /*This is just for debugging, it will display the score each cell got
        var ind = 0;
		$("#heat-table td").each(function() {  
            $(this).html(scoreArray[ind]);
			ind++;
        });
		//*/
        
        //Translate and stretch the scores to fully fit the range of [-1, 1]
		for(var x = 0; x < scoreArray.length; x++) {
			scoreArray[x] = (scoreArray[x] - min) * (2 / (max - min)) - 1;
		}
		
        //Set the color of each cell to the respective transformed score
		var index = 0;
		$("#heat-table td").each(function() {  
            $(this).css("background-color", fractionToColor(scoreArray[index]));
			index++;
        });
	}
    
    /***************************************************************************
    **Encoding & Decoding functions
    */
    
    //The function to actually be used to encode
    function encodeIntArray(intArray) {
        //Make a copy of the array so we don't change the input reference
        var tempArray = intArray.slice();
        var encodedArray = [];
        //Encode the first and last bytes first, because encoding both the
        //leading byte and trailing byte strip the copied array until there is
        //only the middle left to encode
        var trailingByte = encodeTrailingByte(tempArray);
        
        //Create the encoded array
        //encodeLeadingByte() returns a byte in decimal form
        encodedArray.push(encodeLeadingByte(tempArray));
        //encodeMiddleBytes() returns an array so it must be concatenated rather than pushed
        encodedArray = encodedArray.concat(encodeMiddleBytes(tempArray));
        encodedArray.push(trailingByte);
        
        //Take each int, add 256 to avoid invisible characters like newline,
        //change to character representation then join into a string and return
        return encodedArray.map(function(x){return String.fromCharCode(x+256)}).join("");
    }
    
    function decodeString(string) {
        var encodedArray = string.split("").map(function(x){return x.charCodeAt(0)-256});
        
    }

    //This is the first byte. The first few bits determine the type (0, 1, or 2)
    //the rest are a binary number of how many times that type repeats in a row
    function encodeLeadingByte(intArray) {
        //shift() returns the first element and removes it from the array
        var type = intArray.shift();
        //How many times does the type of the removed element repeat? (Total cells of type = repeats + 1)
        var repeatLength = 0;
        //How I chose to encode:
        //If 1st bit is 1, then the type is 2
        //use the other 7 for repeatLength
        if(type === 2) {
            //Find out how many repeats there are within the max I can store
            while(intArray[0] === type && repeatLength < 127) {
                intArray.shift()
                repeatLength += 1;
            }
            //Create byte from the repeatLength
            var byte = addPadding(repeatLength.toString(2), 8);
            //Change 0th char to 1 (indicates type is 2, as I've said before)
            byte = setCharAt(byte, 0, 1);
        }
        //If 1st bit is 0, then the type is 0 or 1, encode the 2nd bit
        //If the 2nd bit is 0, then the type is 0
        //If the 2nd bit is 1, then the type is 1
        //use the other 6 for repeatLength
        else {
            while(intArray[0] === type && repeatLength < 63) {
                intArray.shift()
                repeatLength += 1;
            }
            var byte = addPadding(repeatLength.toString(2), 8);
            byte = setCharAt(byte, 0, 0);
            byte = setCharAt(byte, 1, type);
        }
        //Return the decimal form of the byte
        return parseInt(byte, 2);
    }
    
    function decodeLeadingByte(leadingByte) {
        
    }

    //Will explain this part later
    function encodeMiddleBytes(intArray) {
        var cellArray = [];
        var compressibleCellIndexes = [];
        var cellsCompressed = 0;
        for(var i = 0; i < intArray.length-Math.floor(cellsCompressed); i++) {
            if(intArray[i] === 0) {
                cellArray.push("00");
            }
            else if(intArray[i] === 1) {
                cellArray.push("01");
            }
            else {
                cellArray.push("10");
                compressibleCellIndexes.push(i);
                cellsCompressed += 0.5;
            }
        }
        var cellsToCompress = intArray.slice(intArray.length-Math.floor(cellsCompressed));
        for(var j = 0; j < cellsToCompress.length; j++) {
            if(cellsToCompress[j] === 0) {
                //cellArray[compressibleCellIndexes[j*2]] = "10";
                //cellArray[compressibleCellIndexes[j*2+1]] = "10";
            }
            else if(cellsToCompress[j] === 1) {
                //cellArray[compressibleCellIndexes[j*2]] = "10";
                cellArray[compressibleCellIndexes[j*2+1]] = "11";
            }
            else {
                cellArray[compressibleCellIndexes[j*2]] = "11";
                //cellArray[compressibleCellIndexes[j*2+1]] = "10";
            }
        }
        var byteArray = cellArray.join("").match(/.{1,8}/g);
        var rightPadding = 0;
        var leftOver = byteArray[byteArray.length-1].length % 8;
        if(leftOver !== 0) {
            rightPadding = 8 - leftOver;
            for(var k = 0; k < rightPadding; k++) {
                byteArray[byteArray.length-1] += "0";
            }
        }
        var paddingByte = addPadding(rightPadding.toString(2), 8);
        byteArray.push(paddingByte);
        for(var l = 0; l < byteArray.length; l++) {
            byteArray[l] = parseInt(byteArray[l], 2);
        }
        return byteArray;
    }
    
    function decodeMiddleBytes(byteArray) {
        
    }

    //Same idea as leading byte, but is last, and repeats go backwards, also
    //1st bit = 0 means type 0
    //1st bit = 1 means type 1 or 2, encode the 2nd bit
    //2nd bit = 0 means type 1
    //2nd bit = 1 means type 2
    //The last 7 or 6 bits for repeat length like before
    function encodeTrailingByte(intArray) {
        //pop() returns the last element and removes it from the array
        var type = intArray.pop();
        var repeatLength = 0;
        if(type === 0) {
            while(intArray[intArray.length-1] === type && repeatLength < 127) {
                intArray.pop();
                repeatLength += 1;
            }
            var byte = addPadding(repeatLength.toString(2), 8);
            byte = setCharAt(byte, 0, 0);
        }
        else {
            while(intArray[intArray.length-1] === type && repeatLength < 63) {
                intArray.pop();
                repeatLength += 1;
            }
            var byte = addPadding(repeatLength.toString(2), 8);
            byte = setCharAt(byte, 0, 1);
            byte = setCharAt(byte, 1, type-1);
        }
        return parseInt(byte, 2);
    }
    
    function decodeTrailingByte(trailingByte) {
        
    }

    //Adds left-padding of 0s until the length reaches a multiple of the width
    function addPadding(numberString, width) {
        var leftOver = numberString.length % width;
        if(leftOver === 0) {
            return numberString;
        }
        else {
            for(var i = 0; i < (width - leftOver); i++) {
                numberString = "0" + numberString;
            }
            return numberString;
        }
    }

    //Replaces the character at the index of a string
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
});
