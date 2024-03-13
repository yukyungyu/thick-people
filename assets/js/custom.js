const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

lenis.stop();

// Loading...
$(window).on('load', function(){
  // 로딩 끝나면
  setTimeout(() => {
    $('body').removeClass('hidden')
    $('.loading').addClass('hide');
    introMotion.play()
    lenis.start();
  }, 1000);
});


// 헤더
let scrollFlag = false;
let lastScroll = 0;

$(window).scroll(function(){
  let curr = $(this).scrollTop();

  if (curr > lastScroll) {
    $('#header').addClass('active')
  } else {
    $('#header').removeClass('active')
  }

  lastScroll = curr;
})


// 마우스 이벤트
const cursor = $('.cursor-follower');

let mouseX = 0;
let mouseY = 0;

$(document).on("mousemove", function(e){
  mouseX = e.clientX - ($('.cursor-follower').width()/2);
  mouseY = e.clientY - ($('.cursor-follower').height()/2);

  cursor.css("transform", `translate(${mouseX}px, ${mouseY}px)`);
})



// sc-intro
const introMotion = gsap.from('.sc-intro .intro-text', {
  autoAlpha: 0,
  transform:'rotateX(-90deg) translate3d(0,100%,0) scale3d(.75,1,1)',
  stagger: 0.1,
  paused: true,
})

$('[data-motion="mtext"]').each(function(i, el){
  gsap.from($(el).find('span'), 1.8, {
    scrollTrigger: {
      trigger: $(el),
      start: "0% 80%",
      end: "100% 85%",
      toggleActions: "play none restart none",
    },
    delay: 0.5,
    autoAlpha: 0, 
    yPercent: 100, 
  })
})

$('[data-motion="btext"]').each(function(el, i){
  gsap.from($(this).find('span'), 2, {
    scrollTrigger: {
      trigger: $(this),
      start: "0% 60%",
      end: "100% 100%",
      scrub: 1,
    },
    autoAlpha: 0,
    transform:'rotateX(-90deg) translate3d(0,100%,0) scale3d(.75,1,1)',
    stagger: 0.1
  })
})

$('[data-motion="rtext"]').each(function(el, i){
  gsap.to($(this), 1.8, {
    scrollTrigger: {
      trigger: $(this),
      start: "0% 90%",
      end: "100% 100%",
      scrub: 1,
    },
    autoAlpha: 1,
    rotateX: 0,
    Z: 0,
    scale: 1,
    delay: 0.1,
  })
})


/************* sc-sequence [satrt] **************/
  // 캔버스 요소와 2D 컨텍스트를 가져옴
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  // 캔버스 크기 설정
  canvas.width = 705;
  canvas.height = 705;

  //총이미지 프레임수
  const frameCount = 446;

  // 현재 프레임의 이미지 경로를 반환하는 함수


  const currentFrame = (idx) => {
      return `https://thickpickle.com/images/seq/${idx.toString().padStart(4, '0')}.webp?alt=media`;
  }; // 리턴 필수

  // 이미지 배열 초기화
  const images = [];
  const card = {
      frame: 0,
  };

  // 이미지를 미리 로드
  for (let i = 0; i < frameCount; i++) {
      const img = new Image(); // Image 객체를 생성
      img.src = currentFrame(i + 1);// currentFrame 함수를 사용하여 현재 프레임의 이미지 경로를 설정  i + 1을 통해 1부터 시작하는 프레임 순서를 얻습니다
      images.push(img);// 생성한 Image 객체를 images 배열에 추가
  }

  gsap.to(card, {
      frame: frameCount - 1, //마지막 프레임으로 가게끔 to 할꺼다~
      snap: 'frame', //스크롤 위치에 따라 애니메이션의 특정 프레임 값에 스냅핑되도록 하는 설정
      ease: 'none',
      scrollTrigger: {
          trigger: '.sc-sequence',
          scrub: 1,
          start: '0% 50%',
          end: '100% 100%',
          // markers: true
      },
      onUpdate: function(){
        render();
        // console.log(card.frame);
        if (card.frame >= 410) {
          $('.sc-sequence .text-wrap').removeClass('show')
        } 
        else if (card.frame >= 340) {
          $('.sc-sequence .text-wrap:nth-child(3)').addClass('show')
        } 
        else if(card.frame >= 260){
          $('.sc-sequence .text-wrap').removeClass('show')
        }
        else if(card.frame >= 250){
          $('.sc-sequence .text-wrap').removeClass('show')
        }
        else if(card.frame >= 200){
          $('.sc-sequence .text-wrap:nth-child(2)').addClass('show')
        }
        else if(card.frame >= 140){
          $('.sc-sequence .text-wrap').removeClass('show')
        }
        else if(card.frame >= 80){
          $('.sc-sequence .text-wrap').removeClass('show')
        }
        else if(card.frame >= 30){
          $('.sc-sequence .text-wrap:nth-child(1)').addClass('show')
        } 
        else if(card.frame < 30) {
          $('.sc-sequence .text-wrap').removeClass('show')
        }
      },// 프레임이 업데이트 될 때마다 render 함수 호출
  });

  // 첫 번째 이미지 로드 후 render 함수 호출
  images[0].onload = render;


  // 이미지를 캔버스에 렌더링하는 함수
  function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 버스의 전체 영역을 클리어하여 투명으로 만듭니다. 
      // 이는 다음 프레임의 이미지를 그리기 전에 이전 프레임의
      //  이미지를 지우는 역할을 합니다.
      //   이것을 통해 애니메이션이 부드럽게 보이게 됩니다.

      ctx.drawImage(images[card.frame], 0, 0, 705, 705);
      /**
       * images[card.frame]: card 객체의 frame 속성에 해당하는 이미지를 가져옵니다. 현재 애니메이션 프레임에 해당하는 이미지를 그립니다.
          0, 0: 캔버스 상의 x, y 좌표에서 이미지를 그립니다. 여기서는 (0, 0) 위치부터 시작합니다.
          705, 705: 그려지는 이미지의 너비와 높이입니다. 이 경우에는 705x705 픽셀 크기의 이미지를 그립니다.
      */
  }
/************* sc-sequence [end] **************/



// sc-thick

/* marquee */
marqeeMotion1 = gsap.to('.sc-thick .pacts-area.marquee .inner', 20, {
  repeat: -1,
  xPercent: -33.33,
  ease:'none',
  paused: true,
})
marqeeMotion2 = gsap.to('.sc-thick .pacts-area.marquee .inner', 20, {
  repeat: -1,
  xPercent: 33.33, /* 3등분 */
  ease: 'none',
  paused: true,
})

// 스크롤링할 때 가속 조절
const scrubMarquee = gsap.to('.sc-thick .pacts-area.marquee .marquee-wrapper',{
  xPercent: -5,
})


ScrollTrigger.create({
  animation: scrubMarquee,
  trigger: '.sc-thick .pacts-area.marquee',
  start: "0% 100%",
  end: "100% 0%",
  scrub: 1,
  onUpdate: self => {
    // console.log(self.direction);

    if (self.direction == 1) { //스크롤 내릴때

      if (marqeeMotion2.isActive()) {
        //실행중인 모션 되돌린다.
        marqeeMotion2.reverse().eventCallback("onReverseComplete",function(){
            marqeeMotion1.play();
        });
      } else {
          marqeeMotion1.play();
      }

    } else { // 스크롤 올릴때
      if (marqeeMotion1.isActive()) {
          marqeeMotion1.reverse().eventCallback("onReverseComplete",function(){
              marqeeMotion2.play();
          });
      } else {
          marqeeMotion2.play();
      }
    }
  }
})



/* banner */
$('.sc-thick .banner-area').each(function(){
  const bannerTl = gsap.timeline({
  scrollTrigger: {
      trigger: $(this).find('.banner-inner'),
      start: "0% 60%",
      end: "100% 100%",
      scrub: true,
    },
  });
    
  bannerTl
  .to($(this).find('.banner-inner'), {'--scaleX': 0}, )
})



/* circle */
circleMotion1 = gsap.to('.sc-thick .group-circle .circle-wrapper .circle', 20, {
  repeat: -1,
  ease:'none',
  rotation: 360,
})
circleMotion2 = gsap.to('.sc-thick .group-circle .circle-wrapper .circle', 20, {
  repeat: -1,
  ease:'none',
  rotation: -360,
})

// 스크롤링할 때 가속 조절
const circleOuter = gsap.to('.sc-thick .group-circle .circle-wrapper', {

  scrollTrigger: {
    trigger: ".group-circle",
    start: "0% 100%",
    end: "100% 0%",
    scrub: true,
  },

  ease: 'none',
  rotation: 360,
})

ScrollTrigger.create({
  trigger: '.sc-thick .group-circle',
  start: "0% 95%",
  end: "100% 0%",
  scrub: 1,
  onUpdate: self => {

    if (self.direction == 1) { //스크롤 내릴때
      
      if (circleMotion2.isActive()) {
        circleMotion2.reverse().eventCallback("onReverseComplete",function(){
          circleMotion1.play();
      });
      } else {
        circleMotion1.play();
      }
    } else if (self.direction == -1) { // 스크롤 올릴때
      
      if (circleMotion1.isActive()) {
        circleMotion1.reverse().eventCallback("onReverseComplete",function(){
          circleMotion2.play();
      });
      } else {
        circleMotion2.play();
      }
    }
  }
})



// sc-slider
/* swiper slide */
const prdSlide = new Swiper('.prd-swiper',{
  effect: "fade",
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".prd-swiper .btn-next",
    prevEl: ".prd-swiper .btn-prev",
  },
  pagination: {
    el: ".prd-swiper .swiper-pagination",
    clickable: true,
  },
})


$('.sc-slider .group-img').mousemove(function(e) {
  offsetX = e.offsetX;
  offsetY = e.offsetY;

  w = $(this).innerWidth();
  h = $(this).innerHeight();

  pointerX = (offsetX - w/2)/1000;
  pointerY = (offsetY - h/2)/100;


  $(this).find('.swrap').each(function(i, el) {
    $(el).css('--pointer-x', pointerX);
    $(el).css('--pointer-y', pointerY);
  });
});
$('.sc-slider .group-img').mouseout(function(e){
  $(this).find('.snippet').css("transform", "translate(0, 0)");
})




