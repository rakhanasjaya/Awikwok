let lastKnownScrollPosition = 0;
const navbar = document.getElementById("navbar");
const main = document.getElementById("main");

function doSomething() {
    //Do something with the scroll position
    navbar.classList.add("delete");
    main.classList.add("sticky");
}

function doSomethingReverse() {
    navbar.classList.remove("delete");
    navbar.classList.remove("sticky");
    navbar.classList.remove("reveal");
    main.classList.remove("sticky");
    navbar.classList.remove("remove");
}

if (navbar.classList != "sticky") {
    document.addEventListener("scroll", (event) => {
        event.preventDefault();
        let lastKnownScrollPosition = window.scrollY;

        if (lastKnownScrollPosition > 150) {
            doSomething();
            setTimeout(() => {
                navbar.classList.add("sticky");
            }, 50);
        }
        if (lastKnownScrollPosition <= 0) {
            navbar.classList.add("remove");
            setTimeout(doSomethingReverse, 50);
        }
    });
}
