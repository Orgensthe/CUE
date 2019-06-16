<script type="text/javascript">  
        $(function(){
            var article = (".recruit .show");  
            $(".recruit .title  td").click(function() {  
                var myArticle =$(this).parents().next("tr");  
                if($(myArticle).hasClass('hide')) {  
                    $(article).removeClass('show').addClass('hide');  
                    $(myArticle).removeClass('hide').addClass('show');  
                }  
                else {  
                    $(myArticle).addClass('hide').removeClass('show');  
                }  
            }); 
        });
</script>

//출처: https://woodstar.tistory.com/60 [MOUSE world]  **제일 유용해보임

/* 참고 예정 자료
http://blog.daum.net/dark602/1378  jQuery qna || faq 토글 만들기
https://codeday.me/ko/qa/20190323/137251.html  테이블에 대한 아코디언 토글효과
https://webclub.tistory.com/100  세가지 패턴의 js 아코디언 효과
https://codyhouse.co/demo/faq-template/index.html  faq 템플릿
https://www.youtube.com/watch?v=5wo7glve9Wc  아코디언 메뉴 만들기 html+css

https://huskdoll.tistory.com/126  댓글 대댓글 수정 jQuery  **제일 유용해보임
https://kakjin.tistory.com/23  생코 댓글, 채팅 서비스 자료
*/