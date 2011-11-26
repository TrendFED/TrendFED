/* English initialisation for the jQuery UI date picker plugin. 
How to change the front-end present format.
1.You just only can change the two items 'dateFormat','initFormat'.
2.If you want, You can change these sign.
3.If you want, You can change these string order.
4.When you finish above, please check two items that string and sign must be corresponded to each other.

Example:
#(English version)
dateFormat: 'yy-mm-dd', firstDay: 0,
initFormat: 'yyyy-MM-dd',
#(German version)
dateFormat: 'dd.mm.yy', firstDay: 1,
initFormat: 'dd.MM.yyyy',
(French version)
dateFormat: 'dd/mm/yy', firstDay: 1,
initFormat: 'dd/MM/yyyy',

Reference:
firstDay: Set the first day of the week: Sunday is 0, Monday is 1, ...etc.
This attribute is one of the regionalisation attributes.

isRTL: True if the current language is drawn from right to left. 
*/
jQuery(function($){
	$.datepicker.regional = {
		closeText: 'Done',
		prevText: 'Prev',
		nextText: 'Next',
		currentText: 'Today',
		monthNames: ['January','February','March','April','May','June',
		'July','August','September','October','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun',
		'Jul','Aug','Sep','Oct','Nov','Dec'],
		dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
		dayNamesMin: ['S','M','T','W','T','F','S'],
		dateFormat: 'yy-mm-dd', firstDay: 0, //JQuery Library format.
		initFormat: 'yyyy-MM-dd',  //JavaScript format.
		enFormat: 'yyyy-MM-dd',  //Back-end AP format.
		isRTL: false};  //True if the current language is drawn from right to left. 
});