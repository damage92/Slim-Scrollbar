var input_type = {

/*
PROTOTYPE:

"name":function(id){

	input = document.createElement("input");
	input.opt_id = id;	
	input.setAttribute("type", "range");
	input.id = "opt_"+id+"_input";

	input.save_prefs = function() {
		//save in Opera
	};
	
	input.addEventListener("change", function() {
		//what do when user change value
		this.save_prefs();
	}, false);

	input.set_value = function(value) {
		//function to call to change value from js (example: set default value)
		this.save_prefs();			
	};

}

*/

	"range_count":function(id){

		input = document.createElement("input");
		input.opt_id = id;		
		input.setAttribute("type", "range");
		input.setAttribute("min", options_desc[id].min);
		input.setAttribute("max", options_desc[id].max);
		input.setAttribute("step", options_desc[id].step);				
		input.id = "opt_"+id+"_input";
		
		input.label = document.createElement("span");
		
		input.save_prefs = function() {
			widget.preferences[this.opt_id] = this.value;
			widget.preferences.changed = "true";
		};

		input.update_desc = function () {
			this.value >= 10 ? value = this.value : value = "0"+this.value;
			this.label.innerHTML = "["+value+" pixels]";		
		};
		
		input.addEventListener("change", function() {
			this.update_desc();
			this.save_prefs();
		}, false);

		input.set_value = function(value) {
			input.value = value;
			this.update_desc();
			this.save_prefs();			
		};

		if (widget.preferences[input.opt_id] != undefined) input.value = widget.preferences[input.opt_id];
		else input.value = options_desc[id].def_value;
		
		input.set_value(input.value);

		cont = document.createElement("span");
		cont.appendChild(input);
		cont.appendChild(input.label);
		
		return cont;

	},
	
	"select":function(id){
	
		input = document.createElement("select");
		input.opt_id = id;		
		input.id = "opt_"+id+"_input";
		
		items = options_desc[id].items;
		for (i=0; i < items.length; i++)
				
		input.options[i] = new Option(items[i].name, items[i].value, options_desc[id].def_value == items[i].value ? true : false, false);

		input.save_prefs = function() {
			widget.preferences[this.opt_id] = this.value;
			widget.preferences.changed = "true";			
		};
		

		input.addEventListener("change", input.save_prefs, false);
		
		input.set_value = function(value) {
			this.value = value;
			this.save_prefs();
		};

		return input;	
	},
	
	"checkbox":function(id){
	
		input = document.createElement("input");
		input.opt_id = id;
		input.id = "opt_"+id+"_input";
		input.setAttribute("type", "checkbox");
		
		input.apply_deps = function() {

			for(i=0; i < options_desc[this.opt_id].dependencies.length; i++) {
				if (this.checked == options_desc[this.opt_id].dependencies[i].value) {
					dep_ele = document.getElementById("opt_"+options_desc[this.opt_id].dependencies[i].obj+"_input");
					if (dep_ele != undefined) dep_ele.disabled = "disabled";

				} else {
					dep_ele = document.getElementById("opt_"+options_desc[this.opt_id].dependencies[i].obj+"_input");
					if (dep_ele != undefined) dep_ele.disabled = "";
				}
			}
		
		};

		input.value_changed = function() {
			this.apply_deps();
		};

		
		input.save_prefs = function() {
			widget.preferences[this.opt_id] = this.checked;
			widget.preferences.changed = "true";			
		};
	
		
		input.set_value = function(value) {
			value == true ? this.checked = "true" : this.checked = "";
			this.value_changed();
			this.save_prefs();			
		};
		
		input.addEventListener("change", function(){
			this.value_changed();
			this.save_prefs();			
		}, false);
		
		
		if (widget.preferences[input.opt_id] != undefined)
			widget.preferences[input.opt_id] == "true" ? input.set_value(true) : input.set_value(false);
		else
			options_desc[id].def_value == true ? input.set_value(true) : input.set_value(false);
		
		return input;
	
	},
	
	"color":function(id){
	
		input = document.createElement("input");
		input.opt_id = id;
		input.id = "opt_"+id+"_input";
		input.setAttribute("type", "color");
		
		input.save_prefs = function() {
			widget.preferences[this.opt_id] = this.value;
			widget.preferences.changed = "true";
		};
		
		input.addEventListener("change", function() {
			this.save_prefs();
		}, false);

		input.set_value = function(value) {
			this.value = value;
			this.save_prefs();			
		};

		if (widget.preferences[input.opt_id] != undefined) input.value = widget.preferences[input.opt_id];
		else input.value = options_desc[id].def_value;

		return input;
	
	}
	
	/*
	"number_limit":function(id){
	
		input = document.createElement("input");
		input.id = "opt_"+id+"_input";
		input.setAttribute("type", "number");
		input.setAttribute("min", options_desc[id].min);
		input.setAttribute("max", options_desc[id].max);
		input.value = options_desc[id].def_value;	
		
		input.set_value = function(value){ 
			if (value < input.min) input.value = input.min;
			else if (value > input.max) input.value = input.max;
			else input.value = value;
		}
	
		return input;
	}
	*/
};

function create_input_element(id) {

	if (input_type[options_desc[id].type] != undefined) 
		input = input_type[options_desc[id].type](id);
		
	return input;
}
