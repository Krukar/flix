///<reference path="d/jquery.d.ts" />
'use strict';
$(function () {
    // Our main show object
    var dates = [];
    // let dates: { [s: string]: [{ [s: string]: string; }] } = {};
    // On submit
    $('#submit').on('click', function () {
        var data = $('#textarea').val(); // text area data to parse
        var split = data.match(/[^\r\n]+/g); // split it up by lines
        for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
            var line = split_1[_i];
            // just in case the line is emtpy, if it has less than 10 lines then there's no date so it's definitely broken
            if (line.length > 10) {
                var date = line.substring(0, 10); // get date
                var info = line.substring(11, line.length - 1); // get everything after the date
                info = info.replace('Report a problem', ''); // remove the trailing X
                info = info.replace(/\s+/g, ' ').trim(); // remove extra spaces and trim the ends
                var type = void 0;
                if (info.match(/Season/g)) {
                    type = 'TV Show';
                }
                else {
                    type = 'Movie';
                }
                if (dates[date] == null) {
                    dates[date] = [];
                }
                ;
                var show = {
                    title: info,
                    type: type
                };
                dates[date].push(show);
            }
        }
        ;
        // Reverse the order since Netflix displays them latest first, this ensures you see the correct order
        for (var date in dates) {
            dates[date].reverse();
        }
        var lis = '';
        for (var i = 0; i < 366; i++) {
            lis += '<li class="day day_' + i + '"></li>';
        }
        $('#list2016').append(lis);
        console.log(dates);
    });
});
console.log('main.ts');
