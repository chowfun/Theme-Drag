$(document).ready(function() {
	
	$("div#header ul li a").hover(function() {
		$(this).stop(true,true).animate({ color: "white" }, 300);
	}, function() {
		if(!$(this).parent().hasClass("current")) {
			$(this).stop(true,true).animate({ color: "#7d7d7d" }, 300);
		}
	});
		
	$("#footer ul li").hoverIntent(function() {
		this_li = $(this);
		this_li.stop(true, true).animate({ 'width' : this_li.attr("id") }, 300)
					  .find(".title").stop(true, true)
					  .show("slide", { direction: "left" }, 300);
		if($(".icon_hover", this).size() == 0) {
			this_li.append('<span class="icon_hover"></span>').find(".icon_hover").fadeIn(300);
		}
		this_li.addClass("current");
	}, function() {
		this_li = $(this);
		this_li.stop(true, true).animate({ 'width' : '16px' }, 300)
					  .find(".title").stop(true, true)
					  .hide("slide", { direction: "left" }, 300);
		if($(".icon_hover", this).size() != 0) {
			this_li.find(".icon_hover").fadeOut(300, function() { $(this).remove(); });
		}
	});
	
	$("#footer ul li.current").live("click", function() {
		parent.location = $(this).find("span.link").text();
	});


	$("#contact form input").val("");

	$("#contact form input, #contact form textarea").focus(function() {
		if($(this).parent().find("span").text().split(" ")[0] != "start") {
			$(this).parent().find("span").animate({ 'opacity' : '0.3' }, 300).prepend("start typing ");
		}
	});
	
	$("#contact form input,#contact form textarea").blur(function() {
		if($(this).val() == '') {
			var this_string = $(this).parent().find("span").text().split(" ");
			if(this_string[0] == "start") {
				$(this).parent().find("span").animate({ 'opacity' : '1' }, 300).text(this_string[2]+" "+this_string[3]);
			}
		}
	});
	
	$("#contact form input,#contact form textarea").keyup(function() {
		if($(this).val() != '') {
			$(this).parent().find("span").animate({ 'opacity' : '0' }, 200);
		} else {
			$(this).parent().find("span").animate({ 'opacity' : '0.3' }, 300);
		}
	});
  
  $("#contact form").submit(function() {
  	var this_form = $(this);
  	$.ajax({
  		type: 'post',
  		data: this_form.serialize(),
  		url: 'send_form.php',
  		success: function(res) {
  			if(res == "true") {
  				this_form.fadeOut("fast");
					$(".success").fadeIn("fast");
  			} else {
  				$(".validation").fadeIn("fast");
  				this_form.find(".text").removeClass("error");
  				$.each(res.split(","), function() {
  					this_form.find("#"+this).addClass("error");
  				});
  			}
  		}
  	});
  });

});
var Articles = {
	reveal: function() {

		$("#articles ul li").css({ 'opacity' : 0.6 });
		
		$("#articles ul li").hover(function() {
			$(this).stop(true,true).animate({ 'opacity' : 1 }, 300);
		}, function() {
			$(this).stop(true,true).animate({ 'opacity' : 0.6 }, 300);
		});
	
	}
};
var Ventures = {
	initialize: function() {
		$("#ventures").prepend('<span class="focus_top"></span><span class="focus_left"></span><span class="focus_right"></span><span class="focus_bottom"></span>')
							    .append('<div class="shade first"></div><div class="shade last"></div>');

		var tile_id = 0;
		var tile_left = 0;
		$(".tile").each(function() {
			$(this).attr("id", tile_id);
			$(this).css({ 'left' : tile_left });
			$("img", this).attr("id", "image_"+tile_id);
			$(".content", this).append("<canvas></canvas>").find("canvas").attr("id", "canvas_"+tile_id);
			tile_left = tile_left + 409;
			tile_id = tile_id + 1;
		});

		$("#ventures_wall .empty_tile.last").css({ 'left' : ($("#ventures_wall .tile:last").position().left+409)+"px" });

		function resize_ventures() {
			var page_width = $(document).width();
			var shade_width = (page_width - 410) / 2;
			var minus_left =  (2000 - page_width) / 2;
			var minus_right = 1200;

			$("#ventures .shade").css({ 'width' : shade_width });
			$("#ventures .shade.first").css({ 'background-position' : "-"+minus_left+"px 0px" });
			$("#ventures .shade.last").css({ 'background-position' : "-"+minus_right+"px 0px" });
			$("#ventures .focus_top").css({ 'left' : shade_width });
			$("#ventures .focus_left").css({ 'left' : shade_width - 14 });
			$("#ventures .focus_right").css({ 'left' : shade_width + 409 });
			$("#ventures .focus_bottom").css({ 'left' : shade_width });
			$("#ventures .link_trigger").css({ 'left' : shade_width + 375 });
			$("#ventures .tile_hover").css({ 'left' : shade_width  });
		}

		function centertile(col, row) {
			var _to = {
				class_name: "tile",
				width: 410,
				height: 290
			};
			var $draggable = $("#ventures_wall");
			var $viewport = $draggable.parent();
			var x = _to.width * col,
				y = _to.height * row,
				half_width = _to.width / 2,
				half_height = _to.height / 2,
				half_vw_width = $viewport.width() / 2,
				half_vw_height = $viewport.height() / 2,
				offset = $draggable.offset();

			var new_offset = { 
				left: -x - (half_width - half_vw_width), 
				top: -y - (half_height - half_vw_height)
			};

			new_offset.top = offset.top;

			$draggable.stop(true, true).animate({
			      'top': 0,
			      'left': new_offset.left
			}, 400, function() { 
				$(".tile").each(function() {
					if($(this).attr('id') == col) {
						setActiveTile($(this), false);	
					}
				});
			});
		}

		function setBlur(tile, blur_type) {
			if($.browser.msie) { $("#image_"+tile).show(); } else {
				$("#image_"+tile).show();
				if(blur_type == "unblur") {
					//stackBlurImage('image_'+tile, 'canvas_'+tile, 0, false);
				} else {
					//stackBlurImage('image_'+tile, 'canvas_'+tile, 4, false);
				}
			}	
		}

		function setActiveTile(tile, center) {
			var tile_id = tile.attr("id");
			$('.content', tile).animate({ 'opacity' : 1 }, 300);
			if(center != false) { centertile(tile_id, 0); }
			setBlur(tile_id, "unblur");		
			tile.addClass("current");
		}

		function setInactiveTile(tile) {
			$('.content', tile).animate({ 'opacity' : '0.2' }, 300);
			tile.removeClass("current");
			setBlur(tile.attr('id'));
		}

		$("#ventures_wall").draggable({ 
			axis: "x",
			stop: function(event, ui) { 
				$(".tile").each(function() {

					var tile_left_target_l = $(this).offset().left;
					var tile_left_target_r = $(this).offset().left + 204;
					var tile_right_target_l = $(this).offset().left + 205;
					var tile_right_target_r = $(this).offset().left + 410;

					if(tile_right_target_l < target_right_l && tile_right_target_r < target_right_r && tile_left_target_l > target_left_l && tile_left_target_r > target_left_r) {
						setActiveTile($(this));
					} else if(tile_left_target_l < target_left_l && tile_left_target_r < target_left_r && tile_right_target_l > target_left_l) {
						setActiveTile($(this));
					}	else {
						setInactiveTile($(this));
					}					
				});

				if($(".tile:first").offset().left > target_left_l) { 
					centertile(0, 0);
				} else if($(".tile:last").offset().left < target_left_l) {
					centertile($(".tile:last").attr("id"), 0);
				}

			}
		});
		/*
		.touch({
			  animate: false,
		    sticky: false,
		    dragx: true,
		    dragy: false,
		    rotate: false,
		    resort: false,
		    scale: true
		});
		*/

		centertile(0, 0);
		resize_ventures();

		$(".tile").each(function() {
			$('.tile .content').css({ 'opacity' : '0.2' });
			if($(this).attr('id') != 2) {
				setBlur($(this).attr('id'));
			} else {				
				setBlur($(this).attr('id'), "unblur");
			}
		});
        
		$(".link_trigger").mouseenter(function() {
			$(this).fadeOut("fast");
			$(".tile_hover").fadeIn(300);
		});

		$(".tile_hover").mouseleave(function() {
			$(this).fadeOut("fast");
			$(".link_trigger").fadeIn("fast");
		});
        
		$(".tile_hover").live("click", function() {
			parent.location = $(".tile.current").find("span").text();
		});
		
		$(window).resize(function() {
			resize_ventures();
			centertile($(".tile.current").attr("id"), 0);
		});

		var target_left_l = $("#ventures .focus_left").offset().left + 15;
		var target_left_r = target_left_l + 205;

		var target_right_l = $("#ventures .focus_right").offset().left;
		var target_right_r = target_right_l + 205;
	}
};