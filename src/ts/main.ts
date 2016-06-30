///<reference path="d/jquery.d.ts" />
'use strict';

$(function() {
    let dates: any = {};

    // Injecting my data
    $('#krukar').on('click', function() {
        $.getJSON( 'data.json', function(data: any) {
            dates = data;

            injectYears(2013, 2016);
            injectDates(dates);

            $('.tv, .movie').on('click', function() {
                injectPopups($(this).data('contents'));
            });            
        });        
    });

    $('#submit').on('click', function() {
        dates = {};
        let startYear: number; // Year user started using Netflix
        let endYear: number; // Year user stopped using Netflix

        let data: string = $('#textarea').val();
        let split: string[] = data.match(/[^\r\n]+/g); // Split the viewing activity by lines

        for (let line of split) {
            let regx: any = line.match(/(20\d{2}-\d{2}-\d{2})(.+?(?=Report a problem))/); // Parse the line
            if (regx) {
                let date: string = regx[1].trim();
                let title: string = regx[2].trim();

                let type: string; // If it contains Season or The Complete Series it has to be a TV show. Sounds unreliable but it's not
                if (title.match(/Season/g) || title.match(/The Complete Series/g)) {
                    type = 'tv';
                } else {
                    type = 'movie';
                }

                if (dates[date] == null) {
                    dates[date] = [];
                };

                let show: { [key: string]: string } = {
                    date: date,
                    title: title,
                    type: type
                };

                let year: number = parseInt(date.substring(0, 4));
                endYear = endYear === undefined ? year : year >= endYear ? year : endYear;
                startYear = year;

                dates[date].push(show);
            }
        };

        injectYears(startYear, endYear);
        injectDates(dates);

        $('.tv, .movie').on('click', function() {
            injectPopups($(this).data('contents'));
        });
    });

    // Add lists
    function injectYears(startYear: number, endYear: number) {
        let leapYears: number[] = [2000, 2004, 2008, 2012, 2016, 2020];
        let container: any = $('#lists');
        container.html('');
        let years: number = endYear - startYear + 1;

        for (let i: number = 0; i < years; i++) {
            let list: string = '';

            let year: number = startYear + i;
            container.append('<div id="year' + year + '" class="year"><h1>' + year + '</h1><ul class="list"></ul></div>');

            let days: number = 365;
            if (leapYears.indexOf(year) > 0) {
                days = 366;
            }

            let offset: number = (new Date(year, 0, 1).getDay()) - 1;
            for (let i: number = 0; i < offset; i++) {
                list += '<li class="offset"></li>';
            }

            for (let i: number = 0; i < days; i++) {
                list += '<li class="day day_' + i + '"></li>';
            }

            $('#year' + year + ' .list').append(list);
        }
    }

    // Add the actual viewed dates
    function injectDates(dates: any) {
        let max: number = getMax(dates);

        for (let date in dates) {
            let opacity: number = Math.round((dates[date].length / max * 100) / 10) * 10;
            let regx: any = date.match(/(20\d{2})-(\d{2})-(\d{2})/);
            let year: number = parseInt(regx[1]);
            let month: number = parseInt(regx[2]) - 1;
            let day: number = parseInt(regx[3]);

            let start: any = new Date(year, 0, 1);
            let end: any = new Date(year, month, day);

            let doy: number = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            let node: any = $('.day', $('#year' + year)).eq(doy);
            node.data('contents', dates[date]);

            for (let content in dates[date]) {
                let self: any = dates[date][content];
                node.addClass(self.type + ' opacity' + opacity);
            }
        }
    }

    function injectPopups(contents: any) {
        let i: number = 0;
        for (let content in contents) {
            let offset: number = 250 * i;
            i++;

            let node: any = $('<div class="popup"><div class="info ' + contents[content].type + '"><span class="type">' + contents[content].type + '</span> - ' + contents[content].title + '</div></div>');

            node.hide().prependTo('#popups').on('click', function() {
                node.remove();
            }).fadeIn(500, 'swing');

            setTimeout(function() {
                node.fadeOut(500, 'swing');

                setTimeout(function() {
                    node.remove();
                }, 500);

            }, 3000 + offset);

        }
    }

    function getMax(dates: any) {
        let max: number = 0;
        for (let date in dates) {
            max = dates[date].length > max ? dates[date].length : max;
        }
        return max;
    }
});
console.log('main.ts');