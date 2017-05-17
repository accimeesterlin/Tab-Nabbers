$(document).ready(function() {

    var url = 'http://localhost:8080/api/bootcamps';
    var initialBootcampID;

    $.ajax({
        method: 'GET',
        url: url
    }).done(function(result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            if (i === 0) {
                initialBootcampID = result[i].id;
            }
            //Create each option
            var id = result[i].id;
            var institution = result[i].institution;
            $('#bootcamp').append($('<option>', {
                value: result[i].id,
                text: institution
            }));

        }

        //Populate Cohorts
        $.ajax({
            method: 'GET',
            url: url + '/' + initialBootcampID
        }).done(function(cohortResults) {
            console.log(cohortResults);
            for (var i = 0; i < cohortResults.length; i++) {
                var cohort = cohortResults[i].cohort;
                $('#cohort').append($('<option>', {
                    value: cohortResults[i].id,
                    text: cohortResults[i].cohort
                }));
            }
        });
    });

    $('#bootcamp').change(function() {
        var bootcampID = $('#bootcamp').val();
        $.ajax({
            method: 'GET',
            url: url + '/' + bootcampID
        }).done(function(cohortResults) {
            $('#cohort').empty();
            for (var i = 0; i < cohortResults.length; i++) {
                var cohort = cohortResults[i].cohort;
                $('#cohort').append($('<option>', {
                    value: cohortResults[i].id,
                    text: cohortResults[i].cohort
                }));
            }
        })
    })
});
