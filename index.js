var map = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1
];

var playerx = 64;
var playery = 64;
var playerxdelta = 0;
var playerydelta = 0;
var playerangle = 0;
var playerangledelta = 0;
var playerheight = 16;

var gridsize = 16;
var gridheight = 32;

var fov = 120;

var angle_transform = Math.PI/256;

function render_frame() {
    playerx += playerxdelta;
    playery += playerydelta;
    playerangle += playerangledelta;
    
    var canvas = $("#render")[0];
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    
    for (var i = -fov/2; i < fov/2; i++) {
        var angle = playerangle + i;
        var dist = get_hit_distance(angle);
        console.log(dist);
        var height = 4096 / dist;
        ctx.moveTo(fov/2 + (i * 2), 80 - height/2);
        ctx.lineTo(fov/2 + (i * 2), 80 + height/2);
        ctx.stroke();
        ctx.moveTo(fov/2 + (i * 2) + 1, 80 - height/2);
        ctx.lineTo(fov/2 + (i * 2) + 1, 80 + height/2);
        ctx.stroke();
    }
    requestAnimationFrame(render_frame);
}

function get_hit_distance(angle) {
    var x_distance = get_x_distance(angle);
    var y_distance = get_y_distance(angle);

    return Math.min(x_distance, y_distance);
}

function get_x_distance(angle) {
    var x, y;
    var dx, dy;
    if (angle % 512 > 256) {
        y = Math.floor(playery / gridsize) * gridsize - 1;
        dy = -gridsize;
    } else {
        y = Math.floor(playery / gridsize) * gridsize + gridsize;
        dy = gridsize;
    }
    x = playerx + (playery - y) / Math.tan(angle * angle_transform);
    dx = gridsize / Math.tan(angle * angle_transform);
    while (map[Math.floor(y/gridsize)*8 + Math.floor(x/gridsize)] == 0) {
        x += dx;
        y += dy;
    }
    return distance(playerx, x, angle, angle - playerangle);
}

function get_y_distance(angle) {
    var x, y;
    var dx, dy;
    if (angle % 512 > 128 && angle % 512 < 384) {
        x = Math.floor(playerx / gridsize) * gridsize + gridsize;
        dx = gridsize;
    } else {
        x = Math.floor(playerx / gridsize) * gridsize - 1;
        dx = -gridsize;
    }
    y = playery + (playerx - x) * Math.tan(angle * angle_transform);
    dy = gridsize * Math.tan(angle * angle_transform);
    while (map[Math.floor(y/gridsize)*8 + Math.floor(x/gridsize)] == 0) {
        x += dx;
        y += dy;
    }
    return distance(playerx, x, angle, angle - playerangle);
}

function distance(x1, x2, a, b) {
    return (Math.abs(x1 - x2) / Math.cos(a * angle_transform)) * Math.cos(b * angle_transform);
}

render_frame();
$(document).keydown(function (event) {
    if (event.which == 38) {
        playerxdelta = Math.sin(playerangle * angle_transform);
        playerydelta = -Math.cos(playerangle * angle_transform);
    }
    if (event.which == 40) {
        playerxdelta = -Math.sin(playerangle * angle_transform);
        playerydelta = Math.cos(playerangle * angle_transform);
    }
    if (event.which == 37) {
        playerangledelta = -1;
    }
    if (event.which == 39) {
        playerangledelta = 1;
    }
});
$(document).keyup(function (event) {
    if (event.which == 38) {
        playerxdelta = 0;
        playerydelta = 0;
    }
    if (event.which == 40) {
        playerxdelta = 0;
        playerydelta = 0;
    }
    if (event.which == 37) {
        playerangledelta = 0;
    }
    if (event.which == 39) {
        playerangledelta = 0;
    }
});
