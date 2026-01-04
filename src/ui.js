import { getNodes, getEdges } from './data.js';

let canvas;
let ctx;
let onTransformChange;
let detailsContent;

let transform = {
    x: 0,
    y: 0,
    scale: 1
};

let isPanning = false;
let lastMousePosition = { x: 0, y: 0 };
let draggedNode = null;
let selectedElement = null;
let nodeFilter = '';
let currentTime = 100;

export function init(transformCallback, timeChangeCallback) {
    canvas = document.getElementById('network-canvas');
    ctx = canvas.getContext('2d');
    detailsContent = document.getElementById('details-content');
    onTransformChange = transformCallback;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseout', onMouseUp);
    canvas.addEventListener('wheel', onWheel);

    const playbackSlider = document.getElementById('playback-slider');
    playbackSlider.addEventListener('input', (e) => {
        currentTime = parseInt(e.target.value, 10);
        if (timeChangeCallback) {
            timeChangeCallback(currentTime);
        }
    });

    const nodeFilterInput = document.getElementById('node-filter');
    nodeFilterInput.addEventListener('input', (e) => {
        nodeFilter = e.target.value.toLowerCase();
        onTransformChange(transform); // Redraw canvas on filter change
    });
}

function onMouseDown(e) {
    const mousePos = getMousePosition(e);
    const nodes = getNodes();
    const hoveredNode = getHoveredNode(mousePos, nodes);

    if (hoveredNode) {
        draggedNode = hoveredNode;
        draggedNode.fx = draggedNode.x;
        draggedNode.fy = draggedNode.y;
        selectedElement = hoveredNode;
        updateDetailsPanel();
    } else {
        isPanning = true;
    }

    lastMousePosition = mousePos;
}

function onMouseMove(e) {
    const mousePos = getMousePosition(e);
    const dx = mousePos.x - lastMousePosition.x;
    const dy = mousePos.y - lastMousePosition.y;

    if (draggedNode) {
        draggedNode.fx += dx / transform.scale;
        draggedNode.fy += dy / transform.scale;
        draggedNode.x = draggedNode.fx;
        draggedNode.y = draggedNode.fy;
    } else if (isPanning) {
        transform.x += dx;
        transform.y += dy;
        onTransformChange(transform);
    }

    lastMousePosition = mousePos;
}

function onMouseUp() {
    isPanning = false;
    if (draggedNode) {
        draggedNode.fx = null;
        draggedNode.fy = null;
        draggedNode = null;
    }
}

function onWheel(e) {
    e.preventDefault();
    const scaleAmount = 1.1;
    const mousePos = getMousePosition(e);

    const worldX = (mousePos.x - transform.x) / transform.scale;
    const worldY = (mousePos.y - transform.y) / transform.scale;

    if (e.deltaY < 0) {
        transform.scale *= scaleAmount;
    } else {
        transform.scale /= scaleAmount;
    }

    transform.x = mousePos.x - worldX * transform.scale;
    transform.y = mousePos.y - worldY * transform.scale;

    onTransformChange(transform);
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function getHoveredNode(mousePos, nodes) {
    const worldX = (mousePos.x - transform.x) / transform.scale;
    const worldY = (mousePos.y - transform.y) / transform.scale;

    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const dx = worldX - node.x;
        const dy = worldY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < 5) { // Node radius
            return node;
        }
    }
    return null;
}

function updateDetailsPanel() {
    if (selectedElement) {
        const edges = getEdges();
        const neighbors = new Set();
        edges.forEach(edge => {
            if (edge.source.id === selectedElement.id) {
                neighbors.add(edge.target.id);
            } else if (edge.target.id === selectedElement.id) {
                neighbors.add(edge.source.id);
            }
        });

        let neighborsHTML = '<ul>';
        neighbors.forEach(neighborId => {
            neighborsHTML += `<li>${neighborId}</li>`;
        });
        neighborsHTML += '</ul>';

        detailsContent.innerHTML = `
            <h3>Node Details</h3>
            <p><strong>ID:</strong> ${selectedElement.id}</p>
            <p><strong>Neighbors (${neighbors.size}):</strong></p>
            ${neighborsHTML}
        `;
    } else {
        detailsContent.innerHTML = `<p>Select a node or edge to see details.</p>`;
    }
}


export function getTransform() {
    return transform;
}

export function getNodeFilter() {
    return nodeFilter;
}

export function getTime() {
    return currentTime;
}
