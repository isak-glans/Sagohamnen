angular.module('ShApp')
.filter('start', function () {
        return function (input, start) {
            if (!input || !input.length) { return; }

            start = +start;
            return input.slice(start);
        };
    })

.filter("show_linebreaks", function($filter) {
 return function(data) {
   if (!data || data == null || typeof data !== 'string' ) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});

angular.module('ShApp').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});