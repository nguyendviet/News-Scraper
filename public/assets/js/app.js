$(()=>{
    $('.scrape').on('click', ()=>{
        $.get('/scrape')
        .done((data)=>{
            // alert('Articles scraped!'); // how to get number of new scraped articles?
            $('body').html(data);
        });
    });
});