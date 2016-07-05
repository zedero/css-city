(function () {
    
    'use strict';
    
    var $selection = $('input[name=buildingselect]:checked');
    $('.user-interface__buildingselect input').on('change', function() {
       $selection = $('input[name=buildingselect]:checked');
    });


    
    $('.emptyplot').click(function(){
        var $this = $(this);
        var $parent = $this.parent();//(data-plot="1" data-shadow-area="_2_2")
        var plot = $parent.data('plot')
        var shadowTarget = '.shadows.' + $parent.data('shadow-area') + ' .shadow-plot-' + plot;
        console.log(shadowTarget);
        $this.remove();
        var building = "";
        var shadow = "";
        
        switch($selection.val()) {
            case 'brickhouse':
                building =  '<div class="brickflat">' +
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
                shadow = "<div class='brickflat__shadow'></div>"
                break;
            case 'fountain':
                building = '<div class="fountain">' + 
                              '<div class="grass"></div>' + 
                              '<div class="water">' + 
                                '<div class="water__effect">' + 
                                  '<div class="water__splash"></div>' + 
                                  '<div class="water__splash"></div>' + 
                                  '<div class="water__splash"></div>' + 
                                  '<div class="water__splash"></div>' + 
                                  '<div class="water__splash"></div>' + 
                                '</div>' + 
                              '</div>' + 
                            '</div>';
                break;
        } 
                
        
        $(shadowTarget).append(shadow);
        
        $parent.append(building)
    })

})();

