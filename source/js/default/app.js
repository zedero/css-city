(function () {

    'use strict';

    // Variables
    //----------------------
    var $selection;
    var $eventHook = $('body');
    var handler = {};

    var GLOBAL = {
        'yearDuration': 10000,
        'gamespeed': 1, //minutes
        'money': 0,
        'population': 0,
        'populationGrowthrate': 1, //Grothrate
        'maxPopulation': 0,
        'jobs': 0,
        'polution': 0,
        'happiness': 0,
        'birthRate': 9, //out of 1000 people / year
        'mortalityRate': 7, //out of 1000 people / year
        'wealth': 1,
        'energieRequirement': 0,
        'energieGeneration': 0
    }

    var DEFAULT = {
        'yearDuration': 10000, //milliseconds that it takes for a year to complete
        'gamespeed': 720, //seconds/year
        'money': 10000,
        'population': 0,
        'populationGrowthrate': 1,
        'maxPopulation': 0,
        'jobs': 0,
        'polution': 0,
        'happiness': 75,
        'birthRate': 9, //out of 1000 people / year
        'mortalityRate': 7, //out of 1000 people / year
        'wealth': 1, //Income per citizen
        'energieRequirement': 0,
        'energieGeneration': 0
    }

    GLOBAL = DEFAULT; // This will eventualy be replaced by a save/load 

    /*  Depth of gameplay order:     
        Electricity 
        Water       
        Waste       
        Sewage        
        Education
        Building costs
    */

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
                "polution": 0,
                'energieRequirement': 0
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
                "polution": 0,
                'energieRequirement': 1
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
                "polution": 0,
                'energieRequirement': 1
            },
            {
                "handle": "fountain",
                "name": "Fountain",
                "building": "/decoration/fountain.html",
                "shadow": null,
                "type": "decoration",
                "buildtime": 1,
                "price": 1,
                "holds": 0,
                "happiness": 50,
                "polution": 0,
                'energieRequirement': 1
            },
            {
                "handle": "coalplant",
                "name": "Coal plant",
                "building": "/buildings/construction.html",
                "shadow": null,
                "type": "energie",
                "buildtime": 1,
                "price": 1,
                "costs": 10, // per year
                "holds": 0,
                "happiness": 0,
                "polution": 50,
                'energieRequirement': 0,
                'energieGeneration': 10
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
    $('body').on('click', '.emptyplot', function (e) {
        e.stopPropagation();
        var data = getBuildingData($selection.val());
        var $parent = $(this).parent();
        var plot = $parent.data('plot')
        var shadowTarget = '.shadows.' + $parent.data('shadow-area') + ' .shadow-plot-' + plot;
        var $shadowTarget = $(shadowTarget);

        plotHandler.initBuilding($parent, $shadowTarget, data);
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
            if (i == 0) {
                checked = ' checked ';
            } else {
                checked = '';
            }

            buildingOptionsList += '<input name="buildingselect" value="' + $data.handle + '" ' + checked + ' id="buildingselect_' + $data.handle + '" type="radio">';
            buildingOptionsList += '<label for="buildingselect_' + $data.handle + '">' + $data.name + '</label>';
        });

        $('.user-interface__buildingselect').append(buildingOptionsList);
    }


    // Loop
    //----------------
    var limit = 300,
        lastFrameTimeMs = 0,
        maxFPS = 60,
        delta = 0,
        timestep = 1000 / 60,
        elapsetime = 0;

    function update(delta) {
        elapsetime += delta;
        if (elapsetime > 1000) {
            elapsetime -= 1000;
            var modifyer = (1 / GLOBAL.gamespeed); //1min / maand = 720sec voor een jaar.

            populationHandler.updateResidence(modifyer);
            happinessHandler.updateHappiness(modifyer);
            moneyHandler.updateMoney(modifyer);
        }
    }

    function draw() {
        GLOBAL.population = GLOBAL.maxPopulation;
        //console.log(Math.round(GLOBAL.money * 100) / 100);
    }


    function updateLoop(timestamp) {
        // Throttle the frame rate.    
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            requestAnimationFrame(updateLoop);
            return;
        }
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        var numUpdateSteps = 0;
        while (delta >= timestep) {
            update(timestep);
            delta -= timestep;
            if (++numUpdateSteps >= 240) {
                panic();
                break;
            }
        }
        draw();
        requestAnimationFrame(updateLoop);
    }

    function panic() {
        delta = 0;
    }

    requestAnimationFrame(updateLoop);

    //
    //-----------------------

    class plotHandlerClass {

        constructor() {
            this.init();
        }

        placeBuilding($plot, $shadowPlot, data) {
            var _this = this;
            if (data !== null) {
                $plot.addClass('___hidden');
                $shadowPlot.addClass('___hidden');
                $plot.empty();
                if (data.building !== null) {
                    $plot.load(data.building);
                    $plot.data('type', data.handle);
                }
                if (data.shadow !== null) {
                    $shadowPlot.load(data.shadow);
                    $shadowPlot.data('type', data.handle);
                }

                var plotcontent;
                if (data.type === 'residence') {
                    plotcontent = new residenceClass(data, {
                        plot: $plot,
                        shadowplot: $shadowPlot
                    });
                } else if (data.type === 'energie') {
                    plotcontent = new energieClass(data, {
                        plot: $plot,
                        shadowplot: $shadowPlot
                    });
                }

                setTimeout(function () {
                    $plot.removeClass('___hidden');
                    $shadowPlot.removeClass('___hidden');
                }, 200);
            }
        }

        initBuilding($plot, $shadowPlot, data) {
            if (GLOBAL.money - data.price >= 0) {
                GLOBAL.money -= data.price;

                plotHandler.placeBuilding($plot, $shadowPlot, constructionsite);

                // after X time place real building and initiate it
                setTimeout(function () {
                    plotHandler.placeBuilding($plot, $shadowPlot, data);
                }, data.buildtime * 1);
            } else {
                console.log('not enough money');
            }
        }

        emptyPlot() {
            console.log('plot empty');
        }

        init() {

        }
    }


    //
    //-----------------------

    class plotClass {
        constructor(data, plot) {
            this.$data = data;
            this.$plot = plot.plot;
            this.$shadowPlot = plot.shadowplot;
            this.init();
        }

        delete() {
            this.$plot.empty();
            this.$shadowPlot.empty();
            this.$plot.append('<div class="emptyplot"></div>');
            this.$plot.unbind('click.plot');
        }

        init() {
            var _this = this;

            this.$plot.on('click.plot', function () {
                _this.delete();
            });
        }
    }

    //
    //-----------------------

    class residenceHandlerClass {

        constructor() {
            this.buildings = [];
            this.init();
        }

        deleteResidence(target) {
            for(var i=0;i<=this.buildings.length-1;i++){
                if(this.buildings[i] === target) {
                    this.buildings.remove(i);
                }
            }
            this.updateResidence();
        }

        addResidence(res) {
            this.buildings.push(res);
            this.updateResidence();
        }
        
        updateResidence() {
            console.log(GLOBAL.maxPopulation);
        }

        init() {

        }
    }

    //
    //-----------------------

    class residenceClass extends plotClass {

        delete() {
            residenceHandler.deleteResidence(this);
            GLOBAL.maxPopulation -= this.$data.holds;
            super.delete();
        }
        init() {
            super.init();
            residenceHandler.addResidence(this);
            GLOBAL.maxPopulation += this.$data.holds;
        }
    }

    //
    //-----------------------

    class energieHandlerClass {

        constructor(data) {
            this.plants = [];
            this.init();
        }

        deletePowerPlant(plant) {
            for(var i=0;i<=this.plants.length-1;i++){
                if(this.plants[i] === plant) {
                    this.plants.remove(i);
                }
            }
            this.update();
        }

        addPowerPlant(plant) {
            this.plants.push(plant);
            this.update();
        }
        
        getCosts() {
            var costs = 0;
            for(var i=0;i<=this.plants.length-1;i++){
                costs += this.plants[i].$data.costs
            }
            return costs;
        }
        
        update() {
            console.log(GLOBAL.energieGeneration);
            console.log(this.getCosts() );
        }


        init() {
            var _this = this;
        }
    }

    //
    //-----------------------

    class energieClass extends plotClass {
        delete() {
            GLOBAL.energieGeneration -= this.$data.energieGeneration
            energieHandler.deletePowerPlant(this);
            super.delete();
        }
        
        init() {
            super.init();
            GLOBAL.energieGeneration += this.$data.energieGeneration
            energieHandler.addPowerPlant(this);
        }
    }

    //
    //-----------------------

    class populationHandlerClass {

        constructor() {
            this.init();
        }

        updateResidence(delta) {
            var birth = (GLOBAL.population / 1000) * GLOBAL.birthRate; // statistical rate
            birth = random(birth / 1.5, birth * 1.25); // randomise rate

            var moved = (GLOBAL.maxPopulation - GLOBAL.population) * .95; //Any build city should have its houses
            moved = random(moved / 1.25, moved); //filled up from 76-95% by people moving in

            var death = (GLOBAL.population / 1000) * GLOBAL.mortalityRate; // statistical rate
            death = random(death / 1.5, death * 1.25); // randomise rate

            var total = birth + moved + death;

            if (GLOBAL.population + total >= GLOBAL.maxPopulation) {
                total = GLOBAL.maxPopulation - GLOBAL.population;
            }

            total *= delta;
            GLOBAL.population += total;
            if (GLOBAL.population > GLOBAL.maxPopulation) {
                GLOBAL.population = GLOBAL.maxPopulation;
            }
        }

        init() {
            var _this = this;
            this.updateCycle = setInterval(function () {
                //_this.updateResidence(1);
            }, 100);
        }
    }

    //
    //-----------------------

    class happinessClass {

        constructor() {
            this.init();
        }

        updateHappiness(delta) {
            var total = GLOBAL.happiness;
            GLOBAL.happiness = total;
        }

        init() {

        }
    }

    //
    //-----------------------

    class moneyClass {

        constructor() {
            
        }
        
        calculateYearlyIncome() {
            var incomeFromCitizen = (GLOBAL.population * GLOBAL.wealth) * this.getTaxPerc();
            var incomeFromIndustry = 0;
            var incomeFromCommercial = 0;
            var incomeFromTrade = 0;
            var incomeFromStatic = 0;
            var totalIncome = incomeFromCitizen + incomeFromIndustry + incomeFromCommercial + incomeFromTrade + incomeFromStatic;    
            return totalIncome;
        }
        
        calculateYearlyExpence() {
            var expencesElectricity = energieHandler.getCosts();
            var totalExpence = 0 - expencesElectricity;
            return totalExpence;
        }
        
        updateMoney(delta) {
            var total = this.calculateYearlyIncome() + this.calculateYearlyExpence();
            total *= delta;
            GLOBAL.money += total;
        }

        getTaxPerc() {
            //quadratic easing in. Quick rize, flattens of when reaching high levels.
            GLOBAL.happiness = 90; // Temp
            var t = GLOBAL.happiness,
                b = 0,
                c = 1,
                d = 95

            t /= d;
            return c * t * t + b;
        }

        init() {
            
        }
    }


    // 
    //-----------------------
    var plotHandler = new plotHandlerClass();
    var residenceHandler = new residenceHandlerClass();
    var energieHandler = new energieHandlerClass();
    var populationHandler = new populationHandlerClass();
    var happinessHandler = new happinessClass();
    var moneyHandler = new moneyClass();

    function random(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
    
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
    
    
})();