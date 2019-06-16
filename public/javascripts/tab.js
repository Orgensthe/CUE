// Select all tabs
$('.nav-pills a').click(function(){
  $(this).tab('show');
})

// Select tab by name
// $('.nav-tabs a[href="#home"]').tab('show')
//
// // Select first tab
// $('.nav-tabs a:first').tab('show')
//
// // Select last tab
// $('.nav-tabs a:last').tab('show')
//
// // Select fourth tab (zero-based)
// $('.nav-tabs li:eq(3) a').tab('show')