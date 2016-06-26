///<reference path="d/jquery.d.ts" />
'use strict';
$(function () {
    // On submit
    $('#submit').on('click', function () {
        var dates = []; // Our main show object
        var startYear;
        var data = $('#textarea').val(); // text area data to parse
        var split = data.match(/[^\r\n]+/g); // split it up by lines
        for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
            var line = split_1[_i];
            var regx = line.match(/(20\d{2}-\d{2}-\d{2})(.+?(?=Report a problem))/);
            // if the regx got no results
            if (regx) {
                var date = regx[1].trim();
                var title = regx[2].trim();
                var type = void 0;
                if (title.match(/Season/g)) {
                    type = 'tv';
                }
                else {
                    type = 'movie';
                }
                if (dates[date] == null) {
                    dates[date] = [];
                }
                ;
                var show = {
                    date: date,
                    title: title,
                    type: type
                };
                startYear = parseInt(date.substring(0, 4));
                dates[date].push(show);
            }
        }
        ;
        injectYears(startYear);
        injectDates(dates);
    });
    function injectYears(startYear) {
        var leapYears = [2000, 2004, 2008, 2012, 2016, 2020];
        var container = $('#lists');
        container.html(''); // Clear the node before inserting in to it
        var endYear = new Date().getFullYear();
        var years = endYear - startYear + 1;
        for (var i = 0; i < years; i++) {
            var year = startYear + i;
            container.append('<div id="year' + year + '" class="year"><h1>' + year + '</h1><ul class="list"></ul></div>');
            var days = 365;
            if (leapYears.indexOf(year) > 0) {
                days = 366;
            }
            var list = '';
            for (var i_1 = 0; i_1 < days; i_1++) {
                list += '<li class="day day_' + i_1 + '"></li>';
            }
            $('#year' + year + ' .list').append(list);
        }
    }
    function injectDates(dates) {
        for (var date in dates) {
            var regx = date.match(/(20\d{2})-(\d{2})-(\d{2})/);
            var year = parseInt(regx[1]);
            var month = parseInt(regx[2]) - 1;
            var day = parseInt(regx[3]);
            var start = new Date(year, 0, 1);
            var end = new Date(year, month, day);
            var doy = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            for (var content in dates[date]) {
                var self_1 = dates[date][content];
                $('.day', $('#year' + year)).eq(doy).addClass(self_1.type);
            }
        }
    }
});
console.log('main.ts');
