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

        $.ajax({
            url: `/article/${id}`,
            method: 'PUT'
        })
        .then((data)=>{
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
            location.reload();
        });
    };

    const viewNotes = function() {
        let id = $(this).data('id');

        // send request to get article's notes if exist
        $.ajax({
            url: `/article/${id}`,
            method: 'GET'
        })
        .then((data)=>{
            console.log(`get data from this article: ${JSON.stringify(data)}`);

            // create modal with article id
            $('.modal-content').html(`
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <textarea name="note" class="note-content"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" data-id="${data._id}" class="btn btn-primary btn-save-note">Save Note</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>`
            );
            $('.modal').modal('show');
        });
    };

    const saveNote = function() {
        let id = $(this).data('id');
        console.log(`button save note id when clicked: ${id}`);
        let content = $('.note-content').val().trim();

        if (content) {
            $.ajax({
                url: `/note/${id}`,
                method: 'POST',
                data: {body: content}
            })
            .then((data)=>{
                console.log(`response from saving new note: ${JSON.stringify(data)}`);
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
    // bind save note button to screen
    $(document).on('click', '.btn-save-note', saveNote);
});