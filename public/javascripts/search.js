$('.search').click(function(){
  $('.search-drawer').removeClass('s-closed').addClass('s-opened');
  $('.overlay').toggle();
  $("#in-search").focus();
});

$('.search-close, .overlay').click(function(){
  $('.search-drawer').removeClass('s-opened').addClass('s-closed');
  $('.overlay').toggle();
});