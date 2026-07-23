/* ================================================================
   BLOBFISH BIOLABS — SCRIPT
   This file controls BEHAVIOR / INTERACTIVITY.
   Two jobs:
     1. Open/close the "About" dropdown menu in the navbar.
     2. Switch between "pages" (Home, Registration, Volunteers,
        About Us, Our Board, Our Schedule) without reloading the
        browser — this is what makes the site feel like it has real
        separate pages while still being just one index.html file.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------------
     PART 1: ABOUT DROPDOWN
     Find every element with class "dropdown" (there's just one:
     the "About" nav item). Clicking its trigger toggles the "open"
     class, which style.css uses to show/hide the vertical menu.
     -------------------------------------------------------------- */
  var dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.dropdown-trigger');

    trigger.addEventListener('click', function (e) {
      e.stopPropagation(); // don't let this click also trigger the "close all" listener below
      var isOpen = dropdown.classList.contains('open');

      // close any other open dropdowns first (only one should be open at a time)
      dropdowns.forEach(function (d) { d.classList.remove('open'); });

      // then open this one, unless it was already open (that means "toggle closed")
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  // clicking anywhere else on the page closes the dropdown
  document.addEventListener('click', function () {
    dropdowns.forEach(function (d) { d.classList.remove('open'); });
  });


  /* --------------------------------------------------------------
     PART 2: PAGE SWITCHING (single-page app navigation)
     Every "page" of the site lives in the HTML as:
       <div class="page" id="page-home">...</div>
       <div class="page" id="page-registration">...</div>
       etc.
     Only the one with class "active" is visible (see style.css:
     .page { display:none } .page.active { display:block }).

     Any link meant to navigate — e.g. <a data-page="registration">
     — gets intercepted here: instead of following a real URL, we
     just swap which .page div has the "active" class.
     -------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('[data-page]');
  var pages = document.querySelectorAll('.page');

  function showPage(pageId) {
    pages.forEach(function (p) {
      // turn on "active" only for the matching page, turn it off for all others
      p.classList.toggle('active', p.id === 'page-' + pageId);
    });
    window.scrollTo(0, 0); // jump to top of the new "page" instead of staying scrolled down
    history.replaceState(null, '', '#' + pageId); // updates the URL bar (e.g. #registration) without reloading
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // stop the browser from trying to follow the href
      showPage(link.getAttribute('data-page'));
      dropdowns.forEach(function (d) { d.classList.remove('open'); }); // close About menu if it was open
    });
  });

  // On page load, check if the URL already has a hash (e.g. someone
  // bookmarked yoursite.com#board) and jump straight to that page.
  // Otherwise default to "home".
  var initial = window.location.hash ? window.location.hash.substring(1) : 'home';
  if (!document.getElementById('page-' + initial)) initial = 'home'; // fallback if hash is invalid
  showPage(initial);

  // Clicking anywhere inside an open FAQ's answer also closes it
document.querySelectorAll('.faq-body').forEach(function (body) {
  body.addEventListener('click', function () {
    body.closest('details').removeAttribute('open');
  });
});

// Toggle the mobile menu open/closed when the hamburger is tapped
document.querySelector('.hamburger').addEventListener('click', function (e) {
  e.stopPropagation();
  document.querySelector('.nav-links').classList.toggle('mobile-open');
});

document.querySelector('.mobile-menu-close').addEventListener('click', function () {
  document.querySelector('.nav-links').classList.remove('mobile-open');
});

navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    showPage(link.getAttribute('data-page'));
    dropdowns.forEach(function (d) { d.classList.remove('open'); });
    document.querySelector('.nav-links').classList.remove('mobile-open'); // closes the mobile menu too
  });
});

// Whichever page just became active fades in
var newPage = document.getElementById('page-' + pageId);
if (newPage) {
  newPage.style.animation = 'none';
  void newPage.offsetWidth; // restart the animation each time a page is shown
  newPage.style.animation = 'fadeIn 0.5s ease';
}
});