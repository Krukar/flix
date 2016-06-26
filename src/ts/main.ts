///<reference path="d/jquery.d.ts" />
'use strict';

$(function() {

	// On submit
	$('#submit').on('click', function(){
		let dates: any = []; // Our main show object
		let startYear: number;

		let data: string = $('#textarea').val(); // text area data to parse
		let split: string[] = data.match(/[^\r\n]+/g); // split it up by lines

		for(let line of split){
			let regx: any = line.match(/(20\d{2}-\d{2}-\d{2})(.+?(?=Report a problem))/);
			// if the regx got no results
			if(regx){
				let date: string = regx[1].trim();
				let title: string = regx[2].trim();

				let type: string;
				if (title.match(/Season/g)) {
					type = 'tv';
				}
				else {
					type = 'movie';
				}

				if (dates[date] == null) {
					dates[date] = [];
				};

				let show: any = {
					date: date,
					title: title,
					type: type
				};

				startYear = parseInt(date.substring(0, 4));

				dates[date].push(show);	
			}			
		};

		injectYears(startYear);
		injectDates(dates);
	});

	function injectYears(startYear: number){
		let leapYears: number[] = [2000, 2004, 2008, 2012, 2016, 2020];
		let container: any = $('#lists');
		container.html(''); // Clear the node before inserting in to it
		let endYear: number = new Date().getFullYear();
		let years: number = endYear - startYear + 1;
		
		for(let i: number = 0; i < years; i++){
			let year: number = startYear + i;
			container.append('<div id="year' + year + '" class="year"><h1>' + year + '</h1><ul class="list"></ul></div>');

			let days: number = 365;
			if(leapYears.indexOf(year) > 0){
				days = 366;
			}

			let list: string = '';
			for(let i: number = 0; i < days; i++){
				list += '<li class="day day_' + i + '"></li>';
			}

			$('#year' + year + ' .list').append(list);
		}
	}

	function injectDates(dates: any){
		for(let date in dates){
			let regx: any = date.match(/(20\d{2})-(\d{2})-(\d{2})/);
			let year: number = parseInt(regx[1]);
			let month: number = parseInt(regx[2]) - 1;
			let day: number = parseInt(regx[3]);

			let start: any = new Date(year, 0, 1);
			let end: any = new Date(year, month, day);

			let doy: number = Math.floor((end - start) / (1000 * 60 * 60 * 24));

			for(let content in dates[date]){
				let self: any = dates[date][content];
				$('.day', $('#year' + year)).eq(doy).addClass(self.type);
			}
		}
	}
}); 

console.log('main.ts');   