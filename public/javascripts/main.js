$(function(){

	console.log('Connected');

	$('a.item').click(function(){
		$('.item').removeClass('active');
		$(this).addClass('active');
	});
});