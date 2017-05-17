$(document).ready(function() {

    var url = 'http://localhost:8080/api/bootcamps';

    $.ajax({
        method: 'GET',
        url: url
    }).done(function(result) {
        var initialBootcampID;
        //Loop thru the results
        for (var i = 0; i < result.length; i++) {
            if (i = 0) {
                initialBootcampID = result[i].id;
            }
            //Create each option
            var institution = result[i].institution;
            $('#bootcamp').append($('<option>', {
                value: result[i].id,
                text: result[i].institution
            }));
        }

        //Populate Cohorts
        // $.ajax({
            //     method: 'GET',
            //     url: url + '/' + initialBootcampID
            // }).done(function(cohortResults) {
            //     for (var i = 0; i < cohortResults.length; i++) {
            //         var cohort = cohortResults[i].cohort;
            //         $('#cohort').append($('<option>', {
            //             value: cohortResults[i].id,
            //             text: cohortResults[i].cohort
            //         }));
            //     }
            // }).fail(function(err) {
            //     console.log(err);
            // });

    }).fail(function(err) {
        console.log(err);
    });

    $('#bootcamp').change(function() {
        var bootcampID = $('#bootcamp').val();
        $.ajax({
            method: 'GET',
            url: url + '/' + bootcampID
        }).done(function(cohortResults) {
            console.log(cohortResults);
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
