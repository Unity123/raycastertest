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
var playerangle = 0;
var playerheight = 16;

var gridsize = 16;
var gridheight = 32;

var fov = 120;

var angle_transform = 360/512;

function render_frame() {
    var canvas = $("#render")[0];
    var ctx = canvas.getContext("2d");
    
    for (var i = -fov/2; i < fov/2; i++) {
        var angle = playerangle + i;
        var dist = get_hit_distance(angle);
        var height = 4096 / dist;
        ctx.moveTo(fov/2 + i, 80 - height/2);
        ctx.lineTo(fov/2 + i, 80 + height/2);
        ctx.stroke();
        ctx.moveTo(fov/2 + i + 1, 80 - height/2);
        ctx.lineTo(fov/2 + i + 1, 80 + height/2);
        ctx.stroke();
    }
}

function get_hit_distance(angle) {
    var x_distance = get_x_distance(angle);
    var y_distance = get_y_distance(angle);

    return Math.min(x_distance, y_distance);
}

function get_x_distance(angle) {
    var x, y;
    var dx, dy;
    if (angle > 256) {
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
    if (angle > 128 && angle < 384) {
        x = Math.floor(playerx / gridsize) * gridsize - 1;
        dx = -gridsize;
    } else {
        x = Math.floor(playerx / gridsize) * gridsize + gridsize;
        dx = gridsize;
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
    return (Math.abs(x1 - x2) / Math.cos(a)) * Math.cos(b);
}