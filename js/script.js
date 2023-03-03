'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');

const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const imgTargets = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//Smooth scrolling

btnScroll.addEventListener('click', function (e) {
  //old way
  //   const s1coords = section1.getBoundingClientRect(); //s1所在的页面坐标 里面的 x y left bottom等属性会随着用户界面的滑动改变
  //   window.scrollTo({
  //     left: s1coords.left + window.scrollX,
  //     top: s1coords.top + window.scrollY,
  //     behavior: 'smooth',
  //   });
  //modern
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //不使用html页面内的anchor href进行跳转
//     const id = this.getAttribute('href'); //相对地址
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //选择跳转目标
//   });
// });

// 1. Add event listener to common parent element
// 2. Determin what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //不使用html页面内的anchor href进行跳转
  // matching
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //相对地址
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //选择跳转目标
  }
});

///////////////////////////////////////
//Tabbed Component

tabContainer.addEventListener('click', function (e) {
  const tab = e.target.closest('.operations__tab');
  console.log(tab);
  if (!tab) return;

  // Remove
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //Active
  tab.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${tab.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Nav Sticky

/* const initCoord = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  console.log(initCoord.top);
  console.log(window.scrollY);
  if (initCoord.top < window.scrollY) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
 */
// Sticky navigation: Intersection Observer API

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Revealing Elements on Scroll

const sectionReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

///////////////////////////////////////
// Lazy loading images

const imgLazyLoading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //   entry.target.src = `${entry.target.getAttribute('data-src')}`;
  entry.target.src = entry.target.dataset.src;
  //   entry.target.classList.remove('lazy-img');   这里如果直接删除，替换图片的速度会比remove blur慢很多
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); //这样就同步
  });
  observer.unobserve(entry.target); //加载一次之后重新划到当前页面的时候就不需要一直检测交互
};
const imgObserver = new IntersectionObserver(imgLazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //加大root的匹配范围，让target提前进入视野 就开始进行加载
});
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0); // 将slide排开
  };

  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
      curSlide = slide;
    }
  });
};
slider();
