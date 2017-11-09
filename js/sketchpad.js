(function () {

    'use strict';

    var svg = document.querySelector('svg'),
    label = svg.querySelector('text'),
    path = null,
    coords = null;

    function handleDrawMove(e) {

        e.preventDefault();

        if (e.touches) {
            e = e.touches[0];
        }

        var rect = document.getElementById('sketch').getBoundingClientRect();

        if (e.pageY < rect.top) {
            return;
        }

        coords += 'L' + (e.pageX - rect.left) + ' ' + (e.pageY - rect.top);

        path.setAttribute('d', coords);

    }

    function handleDrawStart(e) {
        event = e;
        if (e.touches) {
            e = e.touches[0];
        }

        var rect = document.getElementById('sketch').getBoundingClientRect();

        if (e.pageY < rect.top) {
            return;
        }
        event.preventDefault();

        if (label) {
            svg.removeChild(label);
            label = null;
        }

        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        svg.appendChild(path);

        var rect = document.getElementById('sketch').getBoundingClientRect();
        coords = 'M' + (e.pageX - rect.left) + ' ' + (e.pageY - rect.top);

        path.setAttribute('d', coords);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', localStorage.currentColor);
        path.setAttribute('stroke-width', 2);

        svg.addEventListener('mousemove', handleDrawMove);
        //svg.addEventListener('touchmove', handleDrawMove);
        document.addEventListener('touchmove', handleDrawMove);

    }

    function handleDrawEnd() {

        path = null;
        coords = null;

        svg.removeEventListener('mousemove', handleDrawMove);
        //svg.removeEventListener('touchmove', handleDrawMove);
        document.removeEventListener('touchmove', handleDrawMove);

    }

    svg.addEventListener('mousedown', handleDrawStart);
    //svg.addEventListener('touchstart', handleDrawStart);
    document.addEventListener('touchstart', handleDrawStart);

    svg.addEventListener('mouseup', handleDrawEnd);
    //svg.addEventListener('touchend', handleDrawEnd);
    document.addEventListener('touchend', handleDrawEnd);

}
    ());