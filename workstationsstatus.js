
var getStatus = function() { setTimeout(function() {
	$.get("/workstationsstatus").then(function(data) {

		var isfinished = true;

		if (typeof data.select_completed !== 'undefined') {
			$("#select_completed").text(""+data.select_completed)
		}
		if (typeof data.select_quantity !== 'undefined') {
			$("#select_total").text(""+data.select_quantity)
			if (data.select_quantity > 0) isfinished = false;		
		}

		if (typeof data.glue_completed !== 'undefined') {
			$("#glue_completed").text(""+data.glue_completed)
		}
		if (typeof data.glue_quantity !== 'undefined') {
			$("#glue_total").text(""+data.glue_quantity)			
			if (data.glue_quantity > 0) isfinished = false;		
		}

		if (typeof data.assemble_completed !== 'undefined') {
			$("#assemble_completed").text(""+data.assemble_completed)
		}
		if (typeof data.assemble_quantity !== 'undefined') {
			$("#assemble_total").text(""+data.assemble_quantity)
			if (data.assemble_quantity > 0) isfinished = false;		
		}

		if (typeof data.cut_completed !== 'undefined') {
			$("#cut_completed").text(""+data.cut_completed)
		}
		if (typeof data.cut_quantity !== 'undefined') {
			$("#cut_total").text(""+data.cut_quantity)
			if (data.cut_quantity > 0) isfinished = false;		
		}

		if (typeof data.packandmail_completed !== 'undefined') {
			$("#packandmail_completed").text(""+data.packandmail_completed)
		}
		if (typeof data.packandmail_quantity !== 'undefined') {
			$("#packandmail_total").text(""+data.packandmail_quantity)	
			if (data.packandmail_quantity > 0) isfinished = false;		
		}


	    if (!isfinished) {
	    	getStatus();
	    }
	});

}, 1000);
}
getStatus();