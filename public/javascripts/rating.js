$('.starRev span').click(function(){
  $(this).parent().children('span').removeClass('on');
  $(this).addClass('on').prevAll('span').addClass('on');
  return false;
});

var starRating = function(){
  var $star = $(".star-input"),
    $result = $star.find("output>b");

  $(document)
    .on("focusin", ".star-input",
      function(){
        $(this).addClass("focus");
      })

    .on("focusout", ".star-input", function(){
      var $this = $(this);
      setTimeout(function(){
        if($this.find(":focus").length === 0){
          $this.removeClass("focus");
        }
      }, 100);
    })

    .on("change", ".star-input :radio", function(){
      $result.text($(this).next().text());
    })
    .on("mouseover", ".star-input label", function(){
      $result.text($(this).text());
    })
    .on("mouseleave", ".star-input", function(){
      var $checked = $star.find(":checked");
      if($checked.length === 0){
        $result.text("0");
      } else {
        $result.text($checked.next().text());
      }
    });
};

starRating();