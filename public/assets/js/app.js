$(()=>{
    $('.scrape').on('click', ()=>{
        $.get('/scrape')
        .done((data)=>{
            alert('Articles sracped!');
            $('body').html(data);
        });
    });
});