var showCommentsDOM = $('#show-comments');
var allCommentsDOM = $('.all-comments');
var commentDOM = $('#comment');
var submitCommentDOM = $('#submit-comment');


$('.container').on('click', "#submit-comment", function (event) {
    event.preventDefault();
    console.log("ahhh");

    var articleId = $(this).attr("data-id");
    console.log(articleId);
    //use article id to get comment data
    var articleComment = $(`.comment${articleId}`).val().trim();
    console.log(articleComment);
    //submit comment to db
    $.ajax({
        url: `/articles/${articleId}`,
        method: "POST",
        data: {
            body: articleComment
        }
    }).then(function (dbArticle) {
        console.log(dbArticle);
        location.reload();
    })
    //store comment to article 
    //jquery to reload page
})

$('.container').on('click', "#show-comments", function (event) {
    var id = $(this).attr("data-id");
    var hidden = $(this).attr("data-hidden");

    if (hidden === "true") {

        $(this).attr("data-hidden", "false");
        $(this).html("hide comments")
        $(".all-comments" + id).css("display", "inline-block")
    } else {
        $(this).attr("data-hidden", "true");
        $(this).html("show comments")
        $(".all-comments" + id).css("display", "none")
    }
})

$('.container').on('click', "#delete-comment", function (event) {
    var commentId = $(this).attr("data-id");
    $.ajax({
        url: `/comments/${commentId}`,
        method: "DELETE"
    }).then(function (dbComment) {
        console.log(dbComment);
        location.reload();
    })
})