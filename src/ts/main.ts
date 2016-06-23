///<reference path="d/jquery.d.ts" />
'use strict';

$(function() {

	// Our main show object
	let dates: any = [];
	// let dates: { [s: string]: [{ [s: string]: string; }] } = {};

	// On submit
	$('#submit').on('click', function(){

		let data: string = $('#textarea').val(); // text area data to parse
		let split: string[] = data.match(/[^\r\n]+/g); // split it up by lines

		for(let line of split){

			// just in case the line is emtpy, if it has less than 10 lines then there's no date so it's definitely broken
			if (line.length > 10) {
				let date: string = line.substring(0, 10); // get date
				let info: string = line.substring(11, line.length - 1); // get everything after the date
				info = info.replace('Report a problem', ''); // remove the trailing X
				info = info.replace(/\s+/g, ' ').trim(); // remove extra spaces and trim the ends

				let type: string;
				if (info.match(/Season/g)) {
					type = 'TV Show';
				}
				else {
					type = 'Movie';
				}

				if (dates[date] == null) {
					dates[date] = [];
				};

				let show: any = {
					title: info,
					type: type
				};

				dates[date].push(show);
			}

		};

		// Reverse the order since Netflix displays them latest first, this ensures you see the correct order
		for (let date in dates) {
			dates[date].reverse();
		}

		let lis: string = '';

		for (let i: number = 0; i < 366; i++){
			lis += '<li class="day day_' + i + '"></li>';
		}

		$('#list2016').append(lis);

		console.log(dates)

	});

}); 

console.log('main.ts');   