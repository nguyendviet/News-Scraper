$(()=>{
    // declare functions
    const scrapeArticles = ()=>{
        $.get('/scrape')
        .then((data)=>{
            // alert('Articles scraped!'); // how to get number of new scraped articles?
            $('body').html(data);
        });
    };

    const saveArticle = function() {
        let id = $(this).data('id');
        // $(this).addClass('disabled');

        $.ajax({
            url: `/article/${id}`,
            method: 'PUT'
        })
        .then((data)=>{
            console.log(data);
            location.reload();
        });
    };

    const removeArticle = function() {
        let id = $(this).data('id');
        
        $.ajax({
            url: `/article/remove/${id}`,
            method: 'PUT'
        })
        .then((data)=>{
            console.log(data);
            location.reload();
        });
    };

    const viewNotes = function() {
        let id = $(this).data('id');
        console.log(`view notes from this article id ${id}`);

        // send request to get article's notes if exist
        $.ajax({
            url: `/notes/article/${id}`,
            method: 'GET'
        })
        .then((data)=>{
            // console.log(`this should show all notes ${JSON.stringify(data)}`);
            $('.modal').modal('show');
            $('.btn-save-note').attr('data-id', id);
            // clear textarea
            $('.note-content').val('');
        });
    };

    const saveNote = function() {
        let id = $(this).data('id');
        console.log(`this data id id ${$(this).data('id')}`);
        console.log(`save note to this article id ${id}`); // DOM doesn't get the right id event data-id changes
        let content = $('.note-content').val().trim();

        if (content) {
            $.ajax({
                url: `/note/${id}`,
                method: 'POST',
                data: {body: content}
            })
            .then((data)=>{
                // console.log(`response from saving new note: ${JSON.stringify(data)}`);
                $('.note-content').val('');
            });
        }
        else {
            $('.note-content').val('');
            return;
        }
    };

    // hide scrape button if on page 'saved'
    if (window.location.href.includes('saved')) {
        $('.scrape').hide();
    }

    // keep scrollbar bottom
    const contentBox = $('.note-content');
    contentBox.scrollTop = contentBox.scrollHeight;

    // click events
    $('.scrape').on('click', scrapeArticles);
    $('.btn-save').on('click', saveArticle);
    $('.btn-remove').on('click', removeArticle);
    $('.btn-view-notes').on('click', viewNotes);
    $('.btn-save-note').on('click', saveNote);
});