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

        // send request to get article's notes if exist
        $.ajax({
            url: `/article/notes/${id}`,
            method: 'GET'
        })
        .then((data)=>{
            console.log(`this should show all notes ${JSON.stringify(data)}`);
            $('.modal').modal('show');
            // clear textarea
            $('.note-content').val('');
            $('.note-content').attr('data-id', id);
        });
    };

    const saveNote = function() {
        let id = $('.note-content').data('id');
        let content = $('.note-content').val();

        $.ajax({
            url: `/note/${id}`,
            method: 'POST',
            data: {body: content}
        })
        .then((data)=>{
            console.log(data);
        });
    }

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