(function($){
    $.fn.precisionSlider = function(settings){

        //==Default Settings
        var config = {
            delay: 3000,
            fadeSpeed: 0.5,
            clickSpeed: 0.2,
            fadeType: 'linear',
            direction: 'left',
            startPaused: false,
            directionNav: true,
            sepSlides: true,
            sliderType: 'looping',
            vertNav: false,
            navHeight: 35,
            navWidth: '100%',
            bulletHeight: 10,
            bulletPosition: 'offset'
        };

        //= Variable Settings
        //====================================================================
        if (settings) {
            $.extend(config, settings);
        }

        //= Return Each Function for Multiple Sliders
        //=====================================================================
        return this.each(function(){

            var _this = $(this);

            var initSlider, goToSlide, goToNextSlide, goToPrevSlide, runShow, pauseShow, runSlideShow;
            var sliderState = 0;

            if(sliderState > 0){

            }

            // variables
            var precSlider = $(this);

            precSlider.wrap('<div class="precisionSlider"></div>');

            precSlider = precSlider.parent();

            console.log('PrecisionSliderClass = ' + precSlider.attr('class'));

            var container = precSlider.children();
            var slides = container.children();
            var slideWidth = $(slides[0]).width();
            var slideHeight = $(slides[0]).height();
            var count = slides.length;
            var currentIndex = 0;
            var sliderWidth = slideWidth * count;




            //= CSS for Precision Tween Slider
            //====================================================================
            precSlider.css({
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                height: slideHeight+config.navHeight

            });


            container.css({
                width: (slideWidth * count),
                overflowX: 'hidden',
                position: 'relative',
                height: slideHeight,
                top: config.navHeight+1
            });


            var slideDistance = precSlider.width();



            if(slideDistance - slideWidth > 100){
                precSlider.css({
                    width: slideWidth,
                    minHeight: 180,
                    height: slideHeight+config.navHeight
                });
                slideDistance = precSlider.width();
            }


            console.log('Slide Distance = ' + slideDistance);




            //= RESPONSIVE SLIDER CODE
            //====================================================================
            $(window).resize(function(){
                slideDistance = precSlider.width();

                slides.css({
                    width: slideDistance - 20
                });
                $(slides.not(':eq(' + currentIndex + ')')).css({
                    left: slideDistance
                });
                container.css({
                    height: precSlider.height()
                });
            });


            //= Add Class to Each Slide in Slider
            //====================================================================
            slides.each(function(n){
                var _this = $(this);

                if($(this).width() < slideWidth || $(this).width > slideWidth){

                    if(_this.is(':not("div")')){
                        console.log('Not Div');
                    }

                    if(_this.is('img')){
                        var width = _this.width();
                        var height = _this.height();
                        var ratio = width/height;

                        if(width > slideWidth || height > slideHeight){
                            _this.css({
                                height: slideHeight
                            });
                        }
                    }

                    _this.wrap('<div></div>');

                    _this = _this.parent();

                    _this.css({
                        overflow: 'hidden'
                    });
                }

                _this.addClass('precisionSlide' + (n + 1));
            });

            slides = container.children();

            slides.css({
                left: slideDistance,
                overflowX: 'hidden'
            });


            $(slides[0]).css({
                left: 0
            });
            $(slides[count - 1]).css({
                left: -slideDistance
            });

            slides.css({
                width: slideWidth,
                position: 'absolute',
                float: 'left'
            });

            console.log('Number of Slides = ' + count);
            console.log('Slide width = ' + slideWidth + ', Slide height = ' + slideHeight);



            //= ANIMATION METHODS
            //====================================================================
            $.fn.animateOutLeft = function(speed){
                var tl = new TimelineMax();

                tl.to(this, speed, {
                    left: -slideDistance
                });
            };
            $.fn.animateOutRight = function(speed){
                var tl = new TimelineMax();

                tl.to(this, speed, {
                    left: slideDistance
                });
            };
            $.fn.animateIn = function(speed){
                var tl = new TimelineMax();

                tl.to(this, speed, {
                    left: 0
                });
            };



            //= Initiate Slider // NOT USED YET
            //====================================================================
            initSlider = function(){
                var changeWidth = precSlider.width();

                var currentSlide = $(slides).eq(currentIndex);

                currentSlide.each(function(){
                    currentSlide.width();
                });
                console.log('slide index= ' + currentSlide);
            };


            var slideIndex = 0;
            var state = 1;

            var timer = null;


            //= START SLIDE SHOW FUNCTION
            //====================================================================
            runShow = function(){
                if(!config.startPaused){
                    timer = setInterval(function(){
                        precNextSlide(currentIndex);
                    }, config.delay);

                    navPause.text('||');

                    TweenMax.to(navPause, 0.2, {
                        backgroundColor: '#ff6400'
                    });

                    state = 1;
                }
            };

            //= PAUSE SLIDE SHOW FUNCTION
            //====================================================================
            pauseShow = function(){
                clearInterval(timer);
                timer = null;
                navPause.text('>');

                TweenMax.to(navPause, 0.2, {
                    backgroundColor: '#39b528'
                });

                state = 0;
            };


            //= RUN SLIDE SHOW FUNCTIONS
            //====================================================================
            runSlideShow = function(index, direction){

                slideIndex = index;

                if(index > count){
                    slideIndex = 0;
                } else if (index < 0){
                    slideIndex = count-1;
                }

                $(slides).removeClass('active');
                $(slides[slideIndex]).addClass('active');

                if(direction == 'next'){
                    if (index >= count - 1) {

                        $(slides.not(':eq(' + (index - 1) + ')')).css({
                            left: slideDistance
                        });

                        if(index >= count){
                            index = 0;
                            $(slides[0]).css({
                                left: slideDistance
                            });

                            $(slides[count - 1]).animateOutLeft(config.fadeSpeed);
                        } else {
                            $(slides[index - 1]).animateOutLeft(config.fadeSpeed);
                        }

                    } else if (index == 1) {

                        $(slides[index]).css({
                            left: slideDistance
                        });

                        $(slides[0]).animateOutLeft(config.fadeSpeed);

                    } else {

                        $(slides[index+1]).css({
                            left: slideDistance
                        });

                        $(slides[index-1]).animateOutLeft(config.fadeSpeed);

                    }

                } else {
                    console.log('SlidePrevious');
                    if (index < 0){

                        $(slides[count-1]).css({
                            left: -slideDistance
                        });

                        $(slides[0]).animateOutRight(config.fadeSpeed);

                        index = count-1;

                    } else if (index == 0) {

                        $(slides[0]).css({
                            left: -slideDistance
                        });

                        $(slides[index+1]).animateOutRight(config.fadeSpeed);

                    } else {

                        $(slides[index]).css({
                            left: -slideDistance
                        });
                        $(slides[index+1]).animateOutRight(config.fadeSpeed);
                    }
                }

                // Slide Current Slide Into Viewport
                $(slides[index]).animateIn(config.fadeSpeed);

                // Set the current index
                currentIndex = index;
                precSlider.find('.precisionBullet').removeClass('active');
                precSlider.find('.precisionBullet.slide' + currentIndex).addClass('active');
            };


            //= GO TO SPECIFIC SLIDE FUNCTIONS
            //====================================================================
            goToSlide = function(index){
                console.log('GoToSlide, Index = ' + index);
                if (index >= count - 1) {

                    $(slides.not(':eq(' + index + ')')).css({
                        left: -slideDistance
                    });
                    $(slides[index+1]).css({
                        left: slideDistance
                    });

                } else if (index == 0) {
                    $(slides.not(':eq(' + index + ')')).css({
                        left: -slideDistance
                    });
                    $(slides[index+1]).css({
                        left: slideDistance
                    });

                } else {

                    $(slides.not(':eq(' + index + ')')).css({
                        left: -slideDistance
                    });

                    $(slides[currentIndex]).animateOutLeft(config.clickSpeed);
                }
                // Slide Current Slide Into Viewport
                $(slides[index]).animateIn(config.clickSpeed);

                // Set the current index
                currentIndex = index;
                console.log('CurrentIndex = ' + index);
                precSlider.find('.precisionBullet').removeClass('active');
                precSlider.find('.precisionBullet.slide' + currentIndex).addClass('active');
            };

            //= GO TO NEXT SLIDE FUNCTIONS
            //====================================================================
            goToNextSlide = function(index){
                console.log('SlideNext, Index = ' + index);
                if (index >= count - 1) {

                    $(slides.not(':eq(' + (index - 1) + ')')).css({
                        left: slideDistance
                    });

                    if(index >= count){
                        index = 0;
                        $(slides[0]).css({
                            left: slideDistance
                        });

                        $(slides[count - 1]).animateOutLeft(config.clickSpeed);
                    } else {
                        $(slides[index - 1]).animateOutLeft(config.clickSpeed);
                    }

                } else if (index == 1) {

                    $(slides[index]).css({
                        left: slideDistance
                    });

                    $(slides[0]).animateOutLeft(config.clickSpeed);

                } else {

                    $(slides[index+1]).css({
                        left: slideDistance
                    });

                    $(slides[index-1]).animateOutLeft(config.clickSpeed);

                }

                // Slide Current Slide Into Viewport
                $(slides[index]).animateIn(config.clickSpeed);

                // Set the current index
                currentIndex = index;
                console.log('CurrentIndex = ' + index);
                precSlider.find('.precisionBullet').removeClass('active');
                precSlider.find('.precisionBullet.slide' + currentIndex).addClass('active');
            };

            //= GO TO PREVIOUS SLIDE FUNCTIONS
            //====================================================================
            goToPrevSlide = function(index){

                console.log('SlidePrevious, Index = ' + index);
                if (index < 0){

                    $(slides[count-1]).css({
                        left: -slideDistance
                    });

                    $(slides[0]).animateOutRight(config.clickSpeed);

                    index = count-1;

                } else if (index == 0) {

                    $(slides[0]).css({
                        left: -slideDistance
                    });

                    $(slides[index+1]).animateOutRight(config.clickSpeed);

                } else {

                    $(slides[index]).css({
                        left: -slideDistance
                    });
                    $(slides[index+1]).animateOutRight(config.clickSpeed);
                }

                // Slide Current Slide Into Viewport
                $(slides[index]).animateIn(config.clickSpeed);

                // Set the current index
                currentIndex = index;
                precSlider.find('.precisionBullet').removeClass('active');
                precSlider.find('.precisionBullet.slide' + currentIndex).addClass('active');
            };

            //Functions Based on Settings
            //=====================================================================
            var precNextSlide = function(index){
                var direction = 'next';

                runSlideShow(index + 1, direction);
            };

            //=Go to Previous Slide
            var precPrevSlide = function(index){
                var direction = 'prev';

                runSlideShow(index - 1, direction);

            };


            //******************************************************
            //= Slide Show Navigation
            //======================================================
            //======================================================


            //= Build Bullet Navigation
            //======================================================
            var bullets = function(){
                var bulletNav = '';
                var width = (100/count);
                width += '%';
                for(var i = 0; i < count; i++){
                    bulletNav += '<div style="width:' + width + '" class="precisionBullet slide' + i + '"></div>';
                }

                return bulletNav;
            };
            var navigation = '<div class="precisionNav"><span class="precisionPrev precisionArrow"><</span><span class="precisionNext precisionArrow">></span><span class="precisionPause precisionArrow"></span></div><div class="precisionBullets">' + bullets() + '</div>';

            //= Append Navigation to Slider
            //======================================================
            precSlider.append(navigation);

            var nav = precSlider.find('.precisionNav');
            var navPrev = nav.find('.precisionPrev');
            var navNext = nav.find('.precisionNext');
            var navArrow = nav.find('.precisionArrow');
            var navPause = nav.find('.precisionPause');
            var bulletNav = precSlider.find('.precisionBullets');
            var bullet = bulletNav.find('.precisionBullet');

            $(bullet[0]).addClass('active');

            bullet.css({
                height: config.bulletHeight
            });

            if(config.bulletPosition == 'offset'){
                bulletNav.css({
                    bottom: '-' + config.bulletHeight
                });
            }

            //= Set Navigation CSS
            //======================================================
            if(config.vertNav == true){
                navArrow.css({
                    float: 'left',
                    display: 'block',
                    fontSize: '40px',
                    fontWeight: 100,
                    textAlign: 'center',
                    width: 20,
                    background: '#333',
                    lineHeight: '60px',
                    color: '#fff',
                    cursor: 'pointer'
                });

                navPrev.css({
                    borderBottom: '1px solid #aaa'
                });
                navNext.css({
                    borderBottom: '1px solid #aaa'
                });
                navPause.css({
                    fontSize: '17px'
                });
                nav.css({
                    width: '20px',
                    position: 'absolute',
                    top: 0,
                    height: 180
                });
            } else {
                navArrow.css({
                    float: 'left',
                    display: 'block',
                    fontSize: '25px',
                    fontWeight: 100,
                    textAlign: 'center',
                    width: '33.3333333%',
                    background: '#333',
                    lineHeight: config.navHeight + 'px',
                    color: '#fff',
                    cursor: 'pointer',
                    height: config.navHeight
                });

                navPrev.css({
                    borderRight: '1px solid #eee',
                    borderTop: '1px solid #eee'
                });
                navNext.css({
                    borderRight: '1px solid #eee',
                    borderTop: '1px solid #eee'
                });
                navPause.css({
                    fontSize: '17px',
                    borderTop: '1px solid #eee'
                });
                nav.css({
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    height: 25
                });
            }



            //Navigation Arrow Functions
            //=======================================

            //= show first image


            if(config.direction == 'left'){

                runShow();


                //= Navigation Arrows Click Functions
                //======================================================
                navArrow.on('click', function(){
                    if($(this).is('.precisionPrev')){
                        goToPrevSlide(currentIndex - 1);
                        pauseShow();
                    } else if($(this).is('.precisionNext')) {
                        goToNextSlide(currentIndex + 1);
                        pauseShow();
                    }
                });


                //= Bullet Nav Click Functions
                //======================================================
                bullet.on('click', function(){
                    pauseShow();
                    currentIndex = $(this).attr('class').split(' ', 2);
                    currentIndex = currentIndex[1];

                    if(count >= 10){
                        currentIndex = parseInt(currentIndex.substr(-2));
                    } else {
                        currentIndex = parseInt(currentIndex.substr(-1));
                    }

                    goToSlide(currentIndex);
                    console.log("CurrentBullet Index = " +currentIndex);
                });


                //= Pause/Play Click Functions
                //======================================================
                navPause.on('click', function(){
                    if(state == 0){
                        $(this).html('||');

                        TweenMax.to($(this), 0.2, {
                            backgroundColor: '#ff6400'
                        });
                        runShow();
                    } else {
                        $(this).html('>');

                        TweenMax.to($(this), 0.2, {
                            backgroundColor: '#39b528'
                        });
                        pauseShow();
                    }
                });
            }
        });



    };
})(jQuery);


$(function(){
    $('#sideBar .ProductList').each(function(){

        if($(this).children().length > 1){
            $(this).precisionSlider({
                delay: 3000,
                fadeSpeed: 1,
                fadeType: 'Back.easeOut',
                direction: 'left',
                width: '100%'
            }).css({
                    position: 'relative',
                    padding: '40px 0'
                });
        }


    });
});




