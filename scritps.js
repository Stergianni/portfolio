/* ---------- Slide Left ---------- */
/*Interactivity to determine when an animated element in in view. In view elements trigger our animation*/
$(document).ready(function () {

    //window and animation items
    var animation_elements = $.find('.animation-element');
    var web_window = $(window);

    //check to see if any animation containers are currently in view
    function check_if_in_view() {
        //get current window information
        var window_height = web_window.height();
        var window_top_position = web_window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        //iterate through elements to see if its in view
        $.each(animation_elements, function () {

            //get the element sinformation
            var element = $(this);
            var element_height = $(element).outerHeight();
            var element_top_position = $(element).offset().top;
            var element_bottom_position = (element_top_position + element_height);

            //check to see if this current container is visible (its viewable if it exists between the viewable space of the viewport)
            if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                element.addClass('in-view');
            } else {
                element.removeClass('in-view');
            }
        });

    }

    //on or scroll, detect elements in view
    $(window).on('scroll resize', function () {
        check_if_in_view()
    })
    //trigger our scroll event on initial load
    $(window).trigger('scroll');


});


/* ---------- Copy Email to Clipboard ---------- */

$('a').tooltip({
    trigger: 'click',
    placement: 'bottom'
});

function setTooltip(btn, message) {
    $(btn).tooltip('hide')
        .attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function () {
        $(btn).tooltip('hide');
    }, 1000);
}

// Clipboard
var clipboard = new Clipboard('a');

clipboard.on('success', function (e) {
    setTooltip(e.trigger, 'Copied!');
    hideTooltip(e.trigger);
});

clipboard.on('error', function (e) {
    setTooltip(e.trigger, 'Failed!');
    hideTooltip(e.trigger);
});






/*LOADING*/
var $body = document.body,
    $wrap = document.getElementById('wrap'),

    areawidth = window.innerWidth,
    areaheight = window.innerHeight,

    canvassize = 500,

    length = 30,
    radius = 5.6,

    rotatevalue = 0.035,
    acceleration = 0,
    animatestep = 0,
    toend = false,

    pi2 = Math.PI * 2,

    group = new THREE.Group(),
    mesh, ringcover, ring,

    camera, scene, renderer;


camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
camera.position.z = 150;

scene = new THREE.Scene();
// scene.add(new THREE.AxisHelper(30));
scene.add(group);

mesh = new THREE.Mesh(
    new THREE.TubeGeometry(new (THREE.Curve.create(function () { },
        function (percent) {

            var x = length * Math.sin(pi2 * percent),
                y = radius * Math.cos(pi2 * 3 * percent),
                z, t;

            t = percent % 0.25 / 0.25;
            t = percent % 0.25 - (2 * (1 - t) * t * -0.0185 + t * t * 0.25);
            if (Math.floor(percent / 0.25) == 0 || Math.floor(percent / 0.25) == 2) {
                t *= -1;
            }
            z = radius * Math.sin(pi2 * 2 * (percent - t));

            return new THREE.Vector3(x, y, z);

        }
    ))(), 200, 1.1, 2, true),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
        // , wireframe: true
    })
);
group.add(mesh);

ringcover = new THREE.Mesh(new THREE.PlaneGeometry(50, 15, 1), new THREE.MeshBasicMaterial({ color: 0xd1684e, opacity: 0, transparent: true }));
ringcover.position.x = length + 1;
ringcover.rotation.y = Math.PI / 2;
group.add(ringcover);

ring = new THREE.Mesh(new THREE.RingGeometry(4.3, 5.55, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true }));
ring.position.x = length + 1.1;
ring.rotation.y = Math.PI / 2;
group.add(ring);

// fake shadow
(function () {
    var plain, i;
    for (i = 0; i < 10; i++) {
        plain = new THREE.Mesh(new THREE.PlaneGeometry(length * 2 + 1, radius * 3, 1), new THREE.MeshBasicMaterial({ color: 0xd1684e, transparent: true, opacity: 0.13 }));
        plain.position.z = -2.5 + i * 0.5;
        group.add(plain);
    }
})();

renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvassize, canvassize);
renderer.setClearColor('#d1684e');

$wrap.appendChild(renderer.domElement);

$body.addEventListener('mousedown', start, false);
$body.addEventListener('touchstart', start, false);
$body.addEventListener('mouseup', back, false);
$body.addEventListener('touchend', back, false);

animate();


function start() {
    toend = true;
}

function back() {
    toend = false;
}

function tilt(percent) {
    group.rotation.y = percent * 0.5;
}

function render() {

    var progress;

    animatestep = Math.max(0, Math.min(240, toend ? animatestep + 1 : animatestep - 4));
    acceleration = easing(animatestep, 0, 1, 240);

    if (acceleration > 0.35) {
        progress = (acceleration - 0.35) / 0.65;
        group.rotation.y = -Math.PI / 2 * progress;
        group.position.z = 50 * progress;
        progress = Math.max(0, (acceleration - 0.97) / 0.03);
        mesh.material.opacity = 1 - progress;
        ringcover.material.opacity = ring.material.opacity = progress;
        ring.scale.x = ring.scale.y = 0.9 + 0.1 * progress;
    }

    renderer.render(scene, camera);

}

function animate() {
    mesh.rotation.x += rotatevalue + acceleration;
    render();
    requestAnimationFrame(animate);
}

function easing(t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b; }