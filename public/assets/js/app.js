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
        $(this).addClass('disabled');

        $.ajax({
            url: '/article/' + id,
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
            url: '/article/remove/' + id,
            method: 'PUT'
        })
        .then((data)=>{
            console.log(data);
            location.reload();
        });
    };

    // hide scrape button if on page 'saved'
    if (window.location.href.includes('saved')) {
        $('.scrape').hide();
    }

    // click events
    $('.scrape').on('click', scrapeArticles);
    $('.btn-save').on('click', saveArticle);
    $('.btn-remove').on('click', removeArticle);
});