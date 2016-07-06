(function () {

    'use strict';

    // Variables
    //----------------------
    var $selection;
    var GLOBAL = {
        'money':0,
        'population':0,
        'maxPopulation':0,
        'jobs':0,
        'polution':0,
        'happiness':0
    }
    
    var DEFAULT = {
        'money':10000,
        'population':0,
        'maxPopulation':0,
        'jobs':0,
        'polution':0,
        'happiness':90
    }
    
    /*  Depth of gameplay order:
        
        Money
        Electricity
        Water
        Waste
        Sewage        
        Education
        
    */
    
    
    GLOBAL = DEFAULT;
    
    var DATA = {
        "settings": [

                    ],
        "buildings": [
            {
                "handle": "construction",
                "name": "construction site",
                "building": "/buildings/construction.html",
                "shadow": null,
                "type": "construction",
                "buildtime": 0,
                "price": 0,
                "holds": 0,
                "happiness": 0,
                "polution": 0
            },
            {
                "handle": "brickhouse",
                "name": "Appartment",
                "building": "/buildings/brickflat.html",
                "shadow": "/shadows/brickflat__shadow.html",
                "type": "residence",
                "buildtime": 3,
                "price": 1,
                "holds": 50,
                "happiness": 0,
                "polution": 0
            },
            {
                "handle": "skyscraper",
                "name": "Skyscraper",
                "building": "/buildings/skyscraper.html",
                "shadow": "/shadows/skyscraper__shadow.html",
                "type": "residence",
                "buildtime": 3,
                "price": 10,
                "holds": 500,
                "happiness": 0,
                "polution": 0
            },
            {
                "handle": "fountain",
                "name": "Fountain",
                "building": "/decoration/fountain.html",
                "shadow": null,
                "type": "decoration",
                "buildtime": 1,
                "price": 1,
                "holds": "n/a",
                "happiness": 50,
                "polution": 0
            }
                    ]
    };
    
    var constructionsite = getBuildingData('construction'); //'constructionsite'
    
    // Init
    //----------------------
    generateBuildingList();
    
    
    // Keeps track of the actively selected building to place.
    $selection = $('input[name=buildingselect]:checked');
    $('.user-interface__buildingselect input').on('change', function () {
        $selection = $('input[name=buildingselect]:checked');
    });
    
    // On clicking empty plot it will try to retrieve data to fill the plot with an building
    $('.emptyplot').click(function () {
        var data = getBuildingData($selection.val());
        var $parent = $(this).parent();
        var plot = $parent.data('plot')
        var shadowTarget = '.shadows.' + $parent.data('shadow-area') + ' .shadow-plot-' + plot;
        var $shadowTarget = $(shadowTarget);
        
        initBuilding($parent,$shadowTarget,data);
    });

    //Functions
    //----------------------
    function getBuildingData(target) {
        var jsonObj = null;;

        $.each(DATA.buildings, function (i, $data) {
            if ($data.handle == target) {
                jsonObj = $data;
                return;
            }
        });

        return jsonObj;
    }
    
    function generateBuildingList() {
        var buildingOptionsList = "";
        var checked = '';
        
        $.each(DATA.buildings, function (i, $data) { 
            if(i==0) {
                checked = ' checked ';
            }else{
                checked = '';
            }
            
            buildingOptionsList += '<input name="buildingselect" value="' + $data.handle + '" ' + checked + ' id="buildingselect_' + $data.handle + '" type="radio">';
            buildingOptionsList += '<label for="buildingselect_' + $data.handle + '">' + $data.name + '</label>';
        });
        
        $('.user-interface__buildingselect').append(buildingOptionsList);
    }
    
    function initBuilding($plot,$shadowPlot,data) {
        
        // Place placeholder building
        placeBuilding($plot,$shadowPlot,constructionsite);
        
        // after X time place real building and initiate it
        setTimeout(function(){
            placeBuilding($plot,$shadowPlot,data);
        }, data.buildtime*1000);
        
        
    }
    
    function placeBuilding($plot,$shadowPlot,data) {
        if (data !== null) {
            $plot.addClass('___hidden');
            $shadowPlot.addClass('___hidden');
            $plot.empty();
            if(data.building !== null) {
                $plot.load(data.building);
                $plot.data('type',data.handle);
            }
            if(data.shadow !== null) {
                $shadowPlot.load(data.shadow);
                $shadowPlot.data('type',data.handle);
            } 
            setTimeout(function(){
                $plot.removeClass('___hidden');
                $shadowPlot.removeClass('___hidden');
            }, 200);
        }
    }



})();