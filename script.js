'use strict';

///////////////////////////////////////
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// MODAL WINDOW
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

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// PAGE NAVIGATION (navbar)
// WITHOUT EVENT DELEGATION
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// PAGE NAVIGATION (navbar) (smooth scrolling to each section)
// WITH EVENT DELEGATION (Power of Event Bubbling to implement Event Delegation)
// 1. Add Event Listener to common Parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);

  // Matching Strategy to targetted element
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// IMPLEMENTING SMOOTH SCROLLING (click on 'Learn more ↓')

// OLD WAY
// btnScrollTo.addEventListener('click', function (e) {
//   // Coordinates of Section1
// const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect());
//   console.log('Current Scroll (X/Y)', window.scrollX, scrollY);
//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );
//   // Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.scrollX,
//   //   s1coords.top + window.scrollY
//   // );
//     window.scrollTo({
//       left: s1coords.left + window.scrollX,
//       top: s1coords.top + window.scrollY,
//       behavior : 'smooth',
//   });
// });

// MODERN WAY
btnScrollTo.addEventListener('click', function (e) {
  // Coordinates of Section1
  const s1coords = section1.getBoundingClientRect();
  // Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// TABBED COMPONENTS (Instant Tranfers...)
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // returns button whether we click on button or on the number(span)

  // Guard Clause
  if (!clicked) return; // to remove the error when we click outside the button

  // Initially Remove the ACTIVE class from each of the buttons
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // then add the class one by one
  clicked.classList.add('operations__tab--active');

  // Active Content Area
  // Hiding the Content Area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // then showing only that content area for which the button is clicked
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION [NAVBAR] (only the element which is being focused is bright and other elements will fade out)
// [Passing Arguments in EventHandlers]

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // 'this' here --> value of opacity
    });
    logo.style.opacity = this;
  }
};
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

// Bind Method to pass argument in event handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
// Get back to the original layout from the menu fade animation when we remove the cursor
nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVIGATION
// window.scroll should  be avoided, this is for learning purpose
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// A BETTER WAY: STICKY NAVIGATION (Using INTERSECTION OBSERVER API)
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // entire viewport
  threshold: 0,
  rootMargin: `-${navHeight}px`, // '-90px' // this is to prevent overlapping of navbar on features section
});
headerObserver.observe(header);

// REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  else entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Hiding the Sections
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING ANIMATION (IMAGES --> Features Section)
const loadImg = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
};
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `${200}px`,
});
imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlides = slides.length;

  // ADDING DOTS UNDER SLIDER
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // Adding the Dark Grey Value on active dot
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      // 0%, 100%, 200% ...
    );
  };

  // NEXT SLIDE
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // PREVIOUS SLIDE
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlides - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Using Keyboard's Arrow Buttons
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
    // e.key === 'ArrowRight' && nextSlide();
  });

  // Dot Actions
  dotContainer.addEventListener('click', function (e) {
    // console.log(e.target);
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// Selecting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and Inserting Elements
// 1 .insertAdjacentHtml (previous section)

// Other Methods
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'we use  cookies for improved functinality and analytics';
message.innerHTML =
  'we use  cookies for improved functinality and analytics. <button class = "btn btn--close-cookie"> got it!</button>';

// header.prepend(message); // First Child of header element
header.append(message); // Last Child of header element
// header.append(message.cloneNode(true));  // first child as well as last child

// header.before(message);
header.after(message);

// Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height);
console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message));
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful Minimalist Logo';

// Non Standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

const link1 = document.querySelector('.nav__link--btn');
console.log(link1.href);
console.log(link1.getAttribute('href'));

// Data Attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); 

// Don't Use
// logo.className = 'jonas'
*/

/*
// Types of Event Handlers
const h1 = document.querySelector('h1');
const alertH1 = function () {
  alert('addEventListener:Great');
  //  h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1);
// Remove Event Listener
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

// h1.onmouseenter = function(e){
//   alert('addEventListener:Great');
// };
*/

/*
// Event Propagation: Bubbling and Capturing
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop Propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
},true); // true ---> First Capturing Phase: NAV will be the first to load
*/

/*
// DOM TRAVERSING
const h1 = document.querySelector('h1');

// Going Downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'green';

// Going Upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going Sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);
// All Siblings
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (e) {
  if (e !== h1) {
    e.style.transform = 'scale(.5)';
  }
});
*/

/*
// INTERSECTION OBSERVER API

// This function will be called each time when observed element(target element (here section1)) intersecting root element at threshold defined.
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0,0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

/*
// LIFECYCLE DOM EVENTS

// This will get loaded before other elements
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

// This will get loaded after the page is completely loaded
window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded', e);
});

// This will get loaded after clicking the leave page option
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
//   // e.returnValue = 'message';
// });
*/

// DIFFERENT WAYS OF LOADING SCRIPTS: EFFICIENT WAY = defer and async


