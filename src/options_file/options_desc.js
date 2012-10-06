var options_desc = {
	color: {
		type: "color",
		title: "Bars color",
		desc: "color of the bars",
		def_value: "#000000"	
	},

	b_color: {
		type: "color",
		title: "Border color",
		desc: "bar's border color",
		def_value: "#ffffff"
	},

	size: {
		type: "range_count",
		min: 3,
		max: 10,
		step: 1,
		title: "Size",
		desc: "the size of the bars",
		def_value: (window.navigator.userAgent.substr(window.navigator.userAgent.length-5,4)>=12.1 ? 7 : 5)
	},
	
	alternative: {
		type: "checkbox",
		title: "Solve slow scrolling",
		desc: "use this option if you are experiencing slow scrolling",
		def_value: false,
		dependencies: new Array()	
	},
	
	auto_hide: {
		type: "checkbox",
		title: "Auto hide",
		desc: "auto hide the scrollbars after a few seconds",
		def_value: true,
		dependencies: new Array(
			{value: false, obj: "only_over"}
		)
	},
	
	only_over: {	
		type: "checkbox",
		title: "View bar only when mouse is over it",
		desc: "",
		def_value: false,
		dependencies: new Array()
	}
	
};
