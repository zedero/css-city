(function () {
    
    'use strict';

    $('.emptyplot').click(function(){
        var $this = $(this);
        var $parent = $this.parent();
        $this.remove();
        var building =  '<div class="brickflat">' +
            '<div class="driveway"></div>'+
              '<div class="wall">'+
                '<div class="windows"></div>'+
              '</div>'+
              '<div class="wall">'+
                '<div class="windows"></div>'+
              '</div>'+
              '<div class="roof">' +
                '<div class="vent"></div>'+
                '<div class="vent"></div>'+
              '</div>'+
            '</div>';
        
        $parent.append(building)
    })

})();
