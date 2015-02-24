$(document).ready(function() {
	
	/***************************************************************************
	**Initialization
	*/
	
	//Initialize start and end hours to those selected in the html
	var startHour = parseInt($("#list_startHour").val());
	var endHour = parseInt($("#list_endHour").val());
	
	clipTable();
	
	//Disable context menu and apply classes
	$("#week-table tr td").on("contextmenu", function() {
		$(this).removeClass("free busy");
		return false;
	});
	
	/***************************************************************************
	**Events
	*/
	
	//Constrain the start and end hours to sensible values
	//Then update the table to reflect the changes
	$("#list_startHour").change(function() {
		startHour = parseInt($(this).val());
		if(endHour < startHour) {
			endHour = startHour;
			$("#list_endHour").val(startHour);
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
	$("#cb_weekend").change(function() {
		if($("#cb_weekend").prop("checked")) {
			showColumn(6);
			showColumn(7);
		}
		else {
			hideColumn(6);
			hideColumn(7);
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
	
	//Full reset button
	$("#btn_reset").click(function() {
		resetTable();
    });
	
	//Ability to select free times, busy times, and reset
	$("#week-table tr td").mousedown(function(event) {
		switch (event.which) {
			//Left mouse
			case 1:
				//If green toggle one, otherwise toggle both
				if(!$(this).hasClass("free") && !$(this).hasClass("busy")) {
					$(this).toggleClass("free");
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
	
	//Hide the rows not within the start and end times
	function clipTable() {
		for(var n = 0; n <= 23; n++) {
			if(startHour <= n && n <= endHour) {
				showHour(n);
			}
			else {
				hideHour(n);
			}
		}
		// Hide the half hours if the relevant checkbox is checked
		if(!$("#cb_showHalfHour").prop("checked")) {
			hideHalfHours();
		}
	}
	
	//Show and hide rows and columns
	function showRow(n) {
		$("#week-table tr.hour:eq(" + n + ")").show();
	}
	function hideRow(n) {
		$("#week-table tr.hour:eq(" + n + ")").hide();
		$("#week-table tr.hour:eq(" + n + ") td").removeClass("free");
		$("#week-table tr.hour:eq(" + n + ") td").addClass("busy");
	}
	function showColumn(m) {
		$("#week-table tr *:nth-child(" + (m+1) + ")").show(); //(m+1) to keep things 0 index based. For some reason :eq is not working.
	}
	function hideColumn(m) {
		$("#week-table tr *:nth-child(" + (m+1) + ")").hide();
		$("#week-table tr td:nth-child(" + (m+1) + ")").removeClass("free");
		$("#week-table tr td:nth-child(" + (m+1) + ")").addClass("busy");
	}
	
	//Show and hide full hours
	function hideHour(n) {
		$("#week-table tr.hour_" + n).hide();
		$("#week-table tr.hour_" + n + " td").removeClass("free");
		$("#week-table tr.hour_" + n + " td").addClass("busy");
	}
	function showHour(n) {
		$("#week-table tr.hour_" + n).show();
	}
	
	//Show and hide all half hours
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
	function showHalfHours() {
		$("#week-table tr.half").show();
	}
});