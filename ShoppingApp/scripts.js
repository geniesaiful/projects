const navItems = document.querySelectorAll('nav ul li');
const sections = document.querySelectorAll('.content');

document.getElementById('contentHomeId').classList.add('active');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');

        sections.forEach(sec => sec.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        item.classList.add('active');
    });
});