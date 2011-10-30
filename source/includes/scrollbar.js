// ==UserScript==
// @name          SlimScrollbar
// @description	  Slim Scrollbar is an Opera extension that replace default scroll bars with two simple auto-hide bars.
// @author        Damage92
// @homepage      http://stylecode.altervista.org
// @exclude http://acid3.acidtests.org/
// ==/UserScript==


/*TODO
side_margin = margine tra la barra e il bordo della finestra
this.margin = margine del limite dello scorrimento

bugs to solve:
whell scrolling on Windows

*/


(function() {


function get_value(par) {return parseInt(par.split("px")[0])}

if (window.top == window) {

//not on a timer!!!
window.opera.addEventListener('BeforeEventListener.mousedown', prevent_event, false);
window.opera.addEventListener('BeforeEventListener.click', prevent_event, false);
window.opera.addEventListener('BeforeEventListener.mouseup', prevent_event, false);

	var prefs = new Prefs();
	var side_margin = 3;
	var max_zindex = 6000000;

	opera.extension.addEventListener('message', get_msg, false);

	init_time = setTimeout(check_init, 100);
}

function check_init() {
	if ((prefs.msg != undefined) && (document.body != null)) init();
	else init_time = setTimeout(check_init, 500);
}


function Prefs() {
	//default values
	this.alt = "false";
	this.hide = "true";
	this.size = 5;
	this.color = "black";
	this.b_color = "white";
	this.only_over = "false";
	
}

function get_msg(event) { //called from the message event handler
	prefs.msg = event.data;

	if (prefs.msg[0]) prefs.alt = prefs.msg[0];
	if (prefs.msg[1]) prefs.hide = prefs.msg[1];
	if (prefs.msg[2]) prefs.size = prefs.msg[2];
	if (prefs.msg[3]) prefs.color = prefs.msg[3];
	if (prefs.msg[4]) prefs.only_over = prefs.msg[4];
	if (prefs.msg[5]) prefs.b_color = prefs.msg[5];

}


function prevent_event (event) {

if ((event.event.target == vbar.bar) || (event.event.target == vbar.udr) || (event.event.target == hbar.bar) || (event.event.target == hbar.udr))
if ( (event.listener != vbar.hdl_udr_click) && (event.listener != vbar.hdl_down_bar) && (event.listener != vbar.hdl_up_bar) && (event.listener != hbar.hdl_udr_click) && (event.listener != hbar.hdl_down_bar) && (event.listener != hbar.hdl_up_bar) && (event.listener != false_func) )
			event.preventDefault();

}

function false_func() { return false; }

function Cover() {
	this.cov = document.createElement("div");
	this.cov.style = "visibility:visible;position:absolute;top:0px;left:0px";
	this.cov.style.zIndex = max_zindex - 2;
	this.ins = false;
	this.orig_func;

	this.all_to_zero = function() {
		this.cov.style.width = "0px";
		this.cov.style.height = "0px";
	}

	this.ref_cover_size = function() {
		this.cov.style.width = page.get_width() - side_margin + "px";
		this.cov.style.height = page.get_height() - side_margin + "px";
	}

	this.insert = function() {

		this.ins = true;
		this.ref_cover_size();

		//store original function
		if (document.onmousedown != undefined)
			this.orig_func = document.onmousedown.toString();

		document.onmousedown = false_func;

		document.body.appendChild(this.cov);
	}

	this.remove = function() {
		this.ins = false;
		document.body.removeChild(this.cov);
		
		//restore original function
		if (this.orig_func != undefined)
			eval ("document.onmousedown = " + this.orig_func);
		else
			document.onmousedown = null;

	}

}


function Page() {

	this.get_height = function () {
		return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, 
		document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
	}

	this.get_width = function () {

		return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth,
		document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth);

	}
}

function Screen() {

	this.ref_height = function () {
		this.screen_size.style.height = "100%";
		res = this.screen_size.offsetHeight;
		this.screen_size.style.height = "0px";
		
		this.height = res;
		//return res;
	}

	this.ref_width = function () {
		this.screen_size.style.width = "100%";
		res = this.screen_size.offsetWidth;
		this.screen_size.style.width = "0px";
		
		this.width = res;
		//return res;
	}

	this.get_height = function() {return this.height;}
	this.get_width = function() {return this.width;}
	
	this.screen_size = document.createElement("div");
	this.screen_size.style="position:absolute;width:0px;height:0px;left:0px;top:0px;visibility:hidden;z-index:0";
	document.body.appendChild(this.screen_size);
	
	this.ref_width();
	this.ref_height();
	this.width = this.get_width();
	this.height = this.get_height();

}


function V_bar() {
	
	this.bar_width = prefs.size;
	this.bar_width_over = this.bar_width * 2;
	this.bar_margin = 8;
	this.side_margin_corr = 0;
	this.bar_opacity = 0.7;
	this.bar_opacity_over = 0.7;
	this.min_size = 30;
	this.down = new Boolean(false);
	this.over = new Boolean(false);
	this.hide_time = 0;
	this.auto_hide_timeout = 2000;

	this.apply_prop = function() {
		this.bar.style.width = this.bar_width + "px";
		this.udr.style.width = this.bar_width_over - side_margin + "px";
		this.bar.style.opacity = this.bar_opacity;
		this.bar.style.borderRadius="2040px";
		this.bar.style.borderStyle="solid"; 
		this.bar.style.borderWidth="1px"; //border isn't included in div size!
		this.bar.style.borderColor = prefs.b_color;
		this.bar.style.backgroundColor = prefs.color;
	}

	this.all_to_zero = function () {

		this.bar.style.height = "0px";
		this.bar.style.top = "0px";
		this.bar.style.left = "0px";
	
		this.udr.style.height = "0px";
		this.udr.style.top = "0px";
		this.udr.style.left = "0px";
	}

	this.hdl_hide = function() {vbar.hide();}
	this.hide = function() {
		this.bar.style.opacity = this.bar.style.opacity - 0.1;
		if (this.bar.style.opacity > 0) this.hide_time = setTimeout(vbar.hdl_hide, 100);
		else this.hide_time = 0;
	}

	this.hdl_try_hide = function() {vbar.try_hide()}
	this.try_hide = function() {
		if ((prefs.hide == "true") && (this.hide_time == 0) && (this.down == false) && (this.over == false))
			this.hide_time = setTimeout(this.hdl_hide, this.auto_hide_timeout);
	}

	this.hdl_show = function() {vbar.show();}
	this.show = function() {
		clearTimeout(this.hide_time);
		this.hide_time = 0;
		this.bar.style.opacity = this.bar_opacity;
	}

	this.set_over_aspect = function() {
		this.show();
		hbar.hdl_show();
		this.bar.style.width = this.bar_width_over + "px";
		this.udr.style.width = this.bar_width_over + "px";
		this.bar.style.opacity = this.bar_opacity_over;
		this.side_margin_corr = 1;
	}

	this.set_out_aspect = function() {
		this.bar.style.width = this.bar_width + "px";
		this.udr.style.width = this.bar_width_over - side_margin + "px";
		this.bar.style.opacity = this.bar_opacity;
		this.side_margin_corr = 0;
		this.try_hide();
		hbar.hdl_try_hide();
	}

	this.hdl_udr_click = function(event) {vbar.udr_click(event);}
	this.udr_click = function(event) {

		prefs.alt == "true" ? this.udr_click_offset = event.pageY : this.udr_click_offset = event.clientY;
		if (this.udr_click_offset > get_value(this.bar.style.top))
			window.scrollBy(0, screen.get_height() - 20);
		else
			window.scrollBy(0, -screen.get_height() + 20);

	}


	this.over_bar = function() {
	
		window.removeEventListener('mousemove', edge, false);

		this.over = true;
		this.set_over_aspect();
		this.ref_left();

	}

	this.out_bar = function() {

		window.addEventListener('mousemove', edge, false);

		this.over = false;
		if (this.down == false) {
			this.set_out_aspect();
			this.ref_left();
		}
	}

	this.ref_scroll_par = function(event) {

		if (prefs.alt == "true") this.scroll_max_top = page.get_height() - this.bar_margin - get_value(this.bar.style.height);
		else this.scroll_max_top = screen.get_height() - this.bar_margin - get_value(this.bar.style.height);

		this.scroll_rapp = (page.get_height() - screen.get_height()) / 
			(screen.get_height() - (this.bar_margin * 2) - get_value(this.bar.style.height));
	}

	this.hdl_down_bar = function(event) {vbar.down_bar(event)}
	this.down_bar = function(event) {
		this.down = true;

		this.show();
		cover.insert();

		if (prefs.alt == "true") this.down_offset = event.pageY - get_value(this.bar.style.top);
		else this.down_offset = event.clientY - get_value(this.bar.style.top);
		this.ref_scroll_par(event);

		window.addEventListener('mouseup', this.hdl_up_bar, false);
		window.addEventListener('mousemove', this.hdl_move_scroll, false);
		window.removeEventListener('scroll', on_scroll, false);

		this.mouse_pos = event.clientY;
		this.old_mouse_pos = 0;
		this.scroll_timer = setTimeout(vbar.hdl_do_scroll, 1);

	}

	this.hdl_up_bar = function() {vbar.up_bar()}
	this.up_bar = function() {
		this.down = false;
		cover.remove();
		window.removeEventListener('mouseup', this.hdl_up_bar, false);
		window.removeEventListener('mousemove', this.hdl_move_scroll, false);
		window.addEventListener('scroll', on_scroll, false);
		this.over == true ? this.set_over_aspect() : this.set_out_aspect();
		this.ref_left();
		clearTimeout(this.scroll_timer);
	}

	this.hdl_move_scroll = function(event){vbar.move_scroll(event)}
	this.move_scroll = function(event) { this.mouse_pos = event.clientY; }

	this.hdl_do_scroll = function () {vbar.do_scroll()}
	this.do_scroll = function () {

		if (this.old_mouse_pos == this.mouse_pos) {	
			if (this.down == true) this.scroll_timer = setTimeout(vbar.hdl_do_scroll, 20);
			return;
		}
		this.old_mouse_pos = this.mouse_pos;

		this.new_top = this.mouse_pos - this.down_offset;

		window.scrollTo(window.scrollX, (this.new_top - this.bar_margin) * this.scroll_rapp);

		if (prefs.alt == "true") this.new_top = this.new_top + window.scrollY;

		if (this.new_top > this.scroll_max_top)	this.new_top = this.scroll_max_top;
		else if (this.new_top < this.bar_margin) this.new_top = this.bar_margin;
		this.bar.style.top = this.new_top + "px";

		hbar.ref_top();

		if (this.down == true) this.scroll_timer = setTimeout(vbar.hdl_do_scroll, 20);

	}

	this.ref_rapp = function() {

		this.old_rapp = this.norm_rapp;
		this.norm_rapp = (screen.get_height() - (this.bar_margin * 2)) / page.get_height();
		this.rapp = this.norm_rapp;
		this.diff = screen.get_height() / page.get_height();

	}

	this.check_rapp = function() {

		this.ref_rapp();

		if (this.rapp != this.old_rapp) {
			if (this.rapp > this.old_rapp) {
				vbar.all_to_zero();
				hbar.all_to_zero();
				cover.all_to_zero();
				cover.ref_cover_size();

				vbar.ref_rapp();
				vbar.ref_left();
				vbar.ref_height();
				vbar.ref_top();

				hbar.ref_rapp();
				hbar.ref_top();
				hbar.ref_width();
				hbar.ref_left();
			}
			
			this.rapp_change();
		}

	}

	this.rapp_change = function() {

		if (this.down == true) this.ref_scroll_par();
		this.ref_height();
		this.ref_top();
		this.ref_left(); //for "image autosizer" extension, because it don't fires the scroll event
		this.show();
		this.try_hide();
		
	}

	this.ref_left_abs = function() {
		this.bar.style.left = screen.get_width() + window.scrollX - get_value(this.bar.style.width) - side_margin + this.side_margin_corr + "px";
		this.udr.style.left = screen.get_width() + window.scrollX - this.bar_width_over + "px";
			//+1 because on mouseover bar is moved to the window border for 1 pixel
	}
	this.ref_left_fix = function() {
		this.bar.style.left = screen.get_width() - get_value(this.bar.style.width) - side_margin + this.side_margin_corr + "px";
		this.udr.style.left = screen.get_width() + window.scrollX - this.bar_width_over + "px";
			//+1 because on mouseover bar is moved to the window border for 1 pixel
	}

	this.ref_top_abs = function() {
		this.bar.style.top = (this.rapp * window.scrollY) + window.scrollY + this.bar_margin + "px";
	}
	this.ref_top_fix = function() {
		this.bar.style.top = (this.rapp * window.scrollY) + this.bar_margin + "px";
	}

	this.ref_height = function() {

		if ((this.diff >= 0.99) && (this.bar.style.visibility == "visible")) {
			this.bar.style.visibility = "hidden";
			this.udr.style.visibility = "hidden";
		} else if ((this.diff < 0.99) && (this.bar.style.visibility == "hidden")) {
			this.bar.style.visibility = "visible";
			this.udr.style.visibility = "visible";
		}

		this.height = screen.get_height() * this.rapp;

		if (this.height < this.min_size) {
			this.rapp = (screen.get_height() - (this.bar_margin * 2) - this.min_size) / (page.get_height() - screen.get_height());
			this.bar.style.height = this.min_size + "px";
		} else
			this.bar.style.height = this.height + "px";

		this.udr.style.height = page.get_height() - side_margin + "px";
	}

	//create bar object
	this.bar = document.createElement("div");
	this.bar.style="background:black;width:0px;height:0px;left:0px;top:0px;visibility:visible";
	this.bar.style.zIndex = max_zindex;
	document.body.appendChild(this.bar);
	//create udr object
	this.udr = document.createElement("div");
	this.udr.style="opacity:0;visibility:visible;width:0px;height:0px;left:0px;top:0px;position:absolute;"; //background:green
	this.udr.style.zIndex = max_zindex - 1;
	document.body.appendChild(this.udr);

	this.apply_prop();

	//alternative bar
	if (prefs.alt == "true") {
		this.ref_top = this.ref_top_abs;
		this.ref_left = this.ref_left_abs;
		this.bar.style.position = "absolute";
	} else {
		this.ref_top = this.ref_top_fix;
		this.ref_left = this.ref_left_fix;
		this.bar.style.position = "fixed";
	}

	//events
	this.bar.addEventListener('mouseover', function(){vbar.over_bar()}, false);
	this.bar.addEventListener('mouseout', function(){vbar.out_bar()}, false);
	this.udr.addEventListener('mouseover', function(){vbar.over_bar()}, false);
	this.udr.addEventListener('mouseout', function(){vbar.out_bar()}, false);

	this.udr.addEventListener('click', this.hdl_udr_click, false);
	this.bar.addEventListener('mousedown', this.hdl_down_bar, false);

}

function H_bar() {
	
	this.bar_height = prefs.size;
//	this.bar_height_over = 10;
	this.bar_height_over = this.bar_height * 2;
	this.bar_margin = 8;
	this.bar_opacity = 0.7;
	this.bar_opacity_over = 0.7;
	this.min_size = 30;
	this.down = new Boolean(false);
	this.over = new Boolean(false);
	this.hide_time = 0;
	this.auto_hide_timeout = 2000;


	this.apply_prop = function() {
		this.bar.style.height = this.bar_height + "px";
		this.udr.style.height = this.bar_height_over + "px";
		this.bar.style.opacity = this.bar_opacity;
		this.bar.style.borderRadius="2040px";
		this.bar.style.borderStyle="solid"; 
		this.bar.style.borderWidth="1px";
		this.bar.style.borderColor = prefs.b_color;
		this.bar.style.backgroundColor = prefs.color;
	}

	this.all_to_zero = function() {
		this.bar.style.width = "0px";
		this.bar.style.left = "0px";
		this.bar.style.top = "0px";
	
		this.udr.style.width = "0px";
		this.udr.style.left = "0px";
		this.udr.style.top = "0px";
	}

	this.hdl_hide = function() {hbar.hide();}
	this.hide = function() {
		this.bar.style.opacity = this.bar.style.opacity - 0.1;
		if (this.bar.style.opacity > 0) this.hide_time = setTimeout(hbar.hdl_hide, 100);
		else this.hide_time = 0;
	}

	this.hdl_try_hide = function() {hbar.try_hide()}
	this.try_hide = function() {
		if ((prefs.hide == "true") && (this.hide_time == 0) && (this.down == false) && (this.over == false))
			this.hide_time = setTimeout(this.hdl_hide, this.auto_hide_timeout);
	}


	this.hdl_show = function() {hbar.show();}
	this.show = function() {
		clearTimeout(this.hide_time);
		this.hide_time = 0;
		this.bar.style.opacity = this.bar_opacity;
	}


	this.set_over_aspect = function() {
		this.show();
		vbar.hdl_show();
		this.bar.style.height = this.bar_height_over + "px";
		this.bar.style.opacity = this.bar_opacity_over;
	}

	this.set_out_aspect = function() {
		this.bar.style.height = this.bar_height + "px";
		this.bar.style.opacity = this.bar_opacity;
		this.try_hide();
		vbar.hdl_try_hide();
	}

	this.hdl_udr_click = function(event) {hbar.udr_click(event)}
	this.udr_click = function(event) {

		prefs.alt == "true" ? this.udr_click_offset = event.pageX : this.udr_click_offset = event.clientX;
		if (this.udr_click_offset > get_value(this.bar.style.left))
			window.scrollBy(screen.get_width() - 20, 0);
		else
			window.scrollBy(-screen.get_width() + 20, 0);

	}

	this.over_bar = function() {
		this.over = true;
		this.set_over_aspect();
		this.ref_top();
	}

	this.out_bar = function() {
		this.over = false;
		if (this.down == false) {
			this.set_out_aspect();
			this.ref_top();
		}
	}


	this.ref_scroll_par = function(event) {

		if (prefs.alt == "true") this.scroll_max_left = page.get_width() - this.bar_margin - get_value(this.bar.style.width);
		else this.scroll_max_left = screen.get_width() - this.bar_margin - get_value(this.bar.style.width);

		this.scroll_rapp = (page.get_width() - screen.get_width()) / 
			(screen.get_width() - (this.bar_margin * 2) - get_value(this.bar.style.width));
	}

	this.hdl_down_bar = function(event) {hbar.down_bar(event)}
	this.down_bar = function(event) {
		this.down = true;

		this.show();
		cover.insert();

		if (prefs.alt == "true") this.down_offset = event.pageX - get_value(this.bar.style.left);
		else this.down_offset = event.clientX - get_value(this.bar.style.left);
		this.ref_scroll_par(event);

		window.addEventListener('mouseup', this.hdl_up_bar, false);
		window.addEventListener('mousemove', this.hdl_move_scroll, false);
		window.removeEventListener('scroll', on_scroll, false);

		this.mouse_pos = event.clientX;
		this.old_mouse_pos = 0;
		this.scroll_timer = setTimeout(hbar.hdl_do_scroll, 1);

	}

	this.hdl_up_bar = function() {hbar.up_bar()}
	this.up_bar = function() {
		this.down = false;
		cover.remove();
		window.removeEventListener('mouseup', this.hdl_up_bar, false);
		window.removeEventListener('mousemove', this.hdl_move_scroll, false);
		window.addEventListener('scroll', on_scroll, false);
		this.over == true ? this.set_over_aspect() : this.set_out_aspect();
		this.ref_top();
		clearTimeout(this.scroll_timer);
	}

	this.hdl_move_scroll = function(event){hbar.move_scroll(event)}
	this.move_scroll = function(event) { this.mouse_pos = event.clientX; }

	this.hdl_do_scroll = function () {hbar.do_scroll()}
	this.do_scroll = function () {


		if (this.old_mouse_pos == this.mouse_pos) {
			if (this.down == true) this.scroll_timer = setTimeout(hbar.hdl_do_scroll, 20);
			return;
		}
		this.old_mouse_pos = this.mouse_pos;

		this.new_left = this.mouse_pos - this.down_offset;

		window.scrollTo((this.new_left - this.bar_margin) * this.scroll_rapp, window.scrollY);

		if (prefs.alt == "true") this.new_left = this.new_left + window.scrollX;

		if (this.new_left > this.scroll_max_left) this.new_left = this.scroll_max_left;
		else if (this.new_left < this.bar_margin) this.new_left = this.bar_margin;
		this.bar.style.left = this.new_left + "px";

		vbar.ref_left();

		if (this.down == true) this.scroll_timer = setTimeout(hbar.hdl_do_scroll, 20);

	}

	this.ref_rapp = function() {
		this.old_rapp = this.norm_rapp;	
		this.norm_rapp = (screen.get_width() - (this.bar_margin * 2)) / page.get_width();
		this.rapp = this.norm_rapp;
		this.diff = screen.get_width() / page.get_width();
	}

	this.check_rapp = function() {
	
		this.ref_rapp();

		if (this.rapp != this.old_rapp) {

			if (this.rapp > this.old_rapp) {

				vbar.all_to_zero();
				hbar.all_to_zero();
				cover.all_to_zero();
				cover.ref_cover_size();

				vbar.ref_rapp();
				vbar.ref_left();
				vbar.ref_height();
				vbar.ref_top();

				hbar.ref_rapp();
				hbar.ref_top();
				hbar.ref_width();
				hbar.ref_left();
			}
			this.rapp_change();
		}
	}

	this.rapp_change = function() {

		if (this.down == true) this.ref_scroll_par();
		this.ref_width();
		this.ref_left();
		this.ref_top(); //for "image autosizer" extension, because it don't fires the scroll event
		this.try_hide();

	}

	this.ref_left_abs = function() {
		this.bar.style.left = (this.rapp * window.scrollX) + window.scrollX + this.bar_margin + "px";
	}
	this.ref_left_fix = function() {
		this.bar.style.left = (this.rapp * window.scrollX) + this.bar_margin + "px";
	}

	this.ref_top_abs = function() {
		this.bar.style.top = screen.get_height() + window.scrollY - get_value(this.bar.style.height) - side_margin + "px";
		this.udr.style.top = screen.get_height() + window.scrollY - this.bar_height_over - side_margin + "px";
	}
	this.ref_top_fix = function() {
		this.bar.style.top = screen.get_height() - get_value(this.bar.style.height) - side_margin + "px";
		this.udr.style.top = screen.get_height() + window.scrollY - this.bar_height_over - side_margin + "px";
	}

	this.ref_width = function() {

		if ((this.diff >= 0.99) && (this.bar.style.visibility == "visible")) {
			this.bar.style.visibility = "hidden";
			this.udr.style.visibility = "hidden";
		} else if ((this.diff < 0.99) && (this.bar.style.visibility == "hidden")) {
			this.bar.style.visibility = "visible";
			this.udr.style.visibility = "visible";
		}


		this.width = screen.get_width() * this.rapp;

		if (this.width < this.min_size) {
			this.rapp = (screen.get_width() - (this.bar_margin * 2) - this.min_size) / (page.get_width() - screen.get_width());
			this.bar.style.width = this.min_size + "px";
		} else
			this.bar.style.width = this.width + "px";

		this.udr.style.width = page.get_width() - side_margin + "px";
	}

	this.bar = document.createElement("div");
	this.bar.style="background:black;width:0px;height:0px;left:0px;top:0px;position:absolute;visibility:visible";
	this.bar.style.zIndex = max_zindex;
	document.body.appendChild(this.bar);

	this.udr = document.createElement("div");
	this.udr.style="opacity:0;visibility:visible;height:15px;width:0px;left:0px;top:0px;position:absolute;";
	this.udr.style.zIndex = max_zindex - 1;
	document.body.appendChild(this.udr);

	this.apply_prop();

	//properties
	if (prefs.alt == "true") {
		this.ref_left = this.ref_left_abs;
		this.ref_top = this.ref_top_abs;
		this.bar.style.position = "absolute";
	} else {
		this.ref_left = this.ref_left_fix;
		this.ref_top = this.ref_top_fix;
		this.bar.style.position = "fixed";
	}

	//scrolling events handlers
	this.bar.addEventListener('mouseover', function(){hbar.over_bar()}, false);
	this.bar.addEventListener('mouseout', function(){hbar.out_bar()}, false);
	this.udr.addEventListener('mouseover', function(){hbar.over_bar()}, false);
	this.udr.addEventListener('mouseout', function(){hbar.out_bar()}, false);

	this.udr.addEventListener('click', this.hdl_udr_click, false);
	this.bar.addEventListener('mousedown', this.hdl_down_bar, false);


}

function ref_bars() { //timer

	vbar.check_rapp();
	hbar.check_rapp();

	ref_timer = window.setTimeout(ref_bars, 500);

}


function on_scroll() {

	if (vbar.bar.style.visibility == "visible") {
		vbar.ref_top();
		vbar.ref_left();
		if ( (prefs.hide == "true") && (prefs.only_over == "false") ) {
			vbar.hdl_show();
			vbar.hdl_try_hide();
		}
	}

	if (hbar.bar.style.visibility == "visible") {
		hbar.ref_left();
		hbar.ref_top();
		if ( (prefs.hide == "true") && (prefs.only_over == "false") ) {
			hbar.hdl_show();
			hbar.hdl_try_hide();
		}
	}

}

function edge(e) {
	if (e.pageX > over_limit) vbar.over_bar();
}

function init() {

	page = new Page();
	screen = new Screen();
	cover = new Cover();

	over_limit = screen.get_width() - 5;

	vbar = new V_bar();
	hbar = new H_bar();

	vbar.check_rapp();
	vbar.ref_left();

	hbar.check_rapp();
	hbar.ref_top();

	window.addEventListener('resize', on_resize, false);
	window.addEventListener('scroll', on_scroll, false);

	window.addEventListener('mousemove', edge, false);

	ref_timer = window.setTimeout(ref_bars, 500);

	vbar.hdl_try_hide();
	hbar.hdl_try_hide();

}


function on_resize(event) {

	screen.ref_width();
	screen.ref_height();
	over_limit = screen.get_width() - 5;

	if (vbar.down == true) vbar.up_bar();
	if (hbar.down == true) hbar.up_bar();

}

}());