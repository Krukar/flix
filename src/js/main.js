///<reference path="d/jquery.d.ts" />
'use strict';
$(function () {
    // On submit
    $('#submit').on('click', function () {
        var dates = []; // Our main show object
        var startYear;
        var endYear;
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
                if (title.match(/Season/g) || title.match(/The Complete Series/g)) {
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
                // We can to calibrate when people started and stopped watching Netflix
                var year = parseInt(date.substring(0, 4));
                endYear = endYear === undefined ? year : year >= endYear ? year : endYear;
                startYear = year;
                dates[date].push(show);
            }
        }
        ;
        injectYears(startYear, endYear);
        injectDates(dates);
        $('.tv, .movie').on('click', function () {
            injectPopups($(this).data('contents'));
        });
    });
    function injectYears(startYear, endYear) {
        var leapYears = [2000, 2004, 2008, 2012, 2016, 2020];
        var container = $('#lists');
        container.html('');
        var years = endYear - startYear + 1;
        for (var i = 0; i < years; i++) {
            var list = '';
            var year = startYear + i;
            container.append('<div id="year' + year + '" class="year"><h1>' + year + '</h1><ul class="list"></ul></div>');
            var days = 365;
            if (leapYears.indexOf(year) > 0) {
                days = 366;
            }
            var offset = (new Date(year, 0, 1).getDay()) - 1;
            for (var i_1 = 0; i_1 < offset; i_1++) {
                list += '<li class="offset"></li>';
            }
            for (var i_2 = 0; i_2 < days; i_2++) {
                list += '<li class="day day_' + i_2 + '"></li>';
            }
            $('#year' + year + ' .list').append(list);
        }
    }
    function injectDates(dates) {
        var max = getMax(dates);
        for (var date in dates) {
            var opacity = Math.round((dates[date].length / max * 100) / 10) * 10;
            var regx = date.match(/(20\d{2})-(\d{2})-(\d{2})/);
            var year = parseInt(regx[1]);
            var month = parseInt(regx[2]) - 1;
            var day = parseInt(regx[3]);
            var start = new Date(year, 0, 1);
            var end = new Date(year, month, day);
            var doy = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            var node = $('.day', $('#year' + year)).eq(doy);
            node.data('contents', dates[date]);
            for (var content in dates[date]) {
                var self_1 = dates[date][content];
                node.addClass(self_1.type + ' opacity' + opacity);
            }
        }
    }
    function injectPopups(contents) {
        var i = 0;
        var _loop_1 = function(content) {
            var offset = 250 * i;
            i++;
            var node = $('<div class="popup"><div class="info ' + contents[content].type + '"><span class="type">' + contents[content].type + '</span> - ' + contents[content].title + '</div></div>');
            node.hide().prependTo('#popups').on('click', function () {
                node.remove();
            }).fadeIn(500, 'swing');
            setTimeout(function () {
                node.fadeOut(500, 'swing');
                setTimeout(function () {
                    node.remove();
                }, 500);
            }, 3000 + offset);
        };
        for (var content in contents) {
            _loop_1(content);
        }
    }
    function getMax(dates) {
        var max = 0;
        for (var date in dates) {
            max = dates[date].length > max ? dates[date].length : max;
        }
        return max;
    }
});
console.log('main.ts');
