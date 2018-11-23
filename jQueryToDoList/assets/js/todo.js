$("ul").on("click","li",function(){
	//$(this).css("text-decoration","line-through");
	//$(this).css("color","grey");
	/*$(this).css({
		color:"grey",
		"text-decoration":"line-through"
	});*/
	$(this).toggleClass("completed");	
});


/*delete the list item on x click*/
$("ul").on("click","span",function(event){	
	$(this).parent().fadeOut(500,function(){
		$(this).remove();
	});
	event.stopPropagation();
});

$("input[type='text']").keypress(function(event){
	var task = $(this).val().trim();
	if(event.which ===  13 && task !== "" ){ /*enter key pressed */
		
		$(this).val("");
		$("ul").append('<li><span><i class="fa fa-trash"></i> </span> '+task+'</li>');
	}
});

$("h1").on("click",".fa-plus",function(){
	$("input[type=text]").fadeToggle();
	$(this).removeClass("fa-plus");
	$(this).addClass("fa-minus");
});

$("h1").on("click",".fa-minus",function(){
	$("input[type=text]").fadeToggle();
	$(this).removeClass("fa-minus");
	$(this).addClass("fa-plus");
})