$(()=>{
    $('.scrape').on('click', ()=>{
        $.get('/scrape')
        .then((data)=>{
            // alert('Articles scraped!'); // how to get number of new scraped articles?
            $('body').html(data);

            console.log(data);
        });
    });
});