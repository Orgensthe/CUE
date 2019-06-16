$('.search').click(function(){
  $('.search-drawer').removeClass('s-closed').addClass('s-opened');
  $('.overlay').toggle();
  $(".in-search").focus();
});

$('.search-close, .overlay').click(function(){
  $('.search-drawer').removeClass('s-opened').addClass('s-closed');
  $('.overlay').toggle();
});

$(document).ready(function(){

  //hides dropdown content
  $(".size_chart").hide();

  //unhides first option content
  $("#option1").show();

  //listen to dropdown for change
  $("#size_select").change(function(){
    //rehide content on change
    $('.size_chart').hide();
    //unhides current item
    $('#'+$(this).val()).show();
  });

});