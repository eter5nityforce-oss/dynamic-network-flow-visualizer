import { initializeData, getDataAtTime } from './data.js';
import { init as initCanvas, draw } from './canvas.js';
import { init as initUI, getTransform, getNodeFilter, getTime } from './ui.js';
import { updateFlow, getParticles, resetParticles } from './flow.js';

console.log("Dynamic Network Flow Visualizer Initialized");

// Initialization
initializeData();
initCanvas();

let nodes, edges;
let filteredNodes, filteredEdges;

function updateAndDraw() {
    const currentTime = getTime();
    const currentData = getDataAtTime(currentTime);
    nodes = currentData.nodes;
    edges = currentData.edges;

    const filter = getNodeFilter();
    filteredNodes = nodes.filter(node => node.id.toLowerCase().includes(filter));

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = edges.filter(edge =>
        filteredNodeIds.has(edge.source.id) && filteredNodeIds.has(edge.target.id)
    );

    resetParticles(filteredEdges);
    draw(filteredNodes, filteredEdges, getParticles(), getTransform());
}

// The UI module needs callbacks for transform and time changes
initUI(updateAndDraw, (newTime) => {
    updateAndDraw();
});

// Initial draw
updateAndDraw();

const worker = new Worker('src/worker.js');

// Listen for messages from the worker
worker.onmessage = function(e) {
    const updatedNodes = e.data.nodes;
    nodes.forEach((node, i) => {
        // Only update if the node is not being dragged
        if (!node.fx) {
            node.x = updatedNodes[i].x;
            node.y = updatedNodes[i].y;
            node.vx = updatedNodes[i].vx;
            node.vy = updatedNodes[i].vy;
        }
    });
};

// Main application loop
function animate() {
    const workerEdges = filteredEdges.map(edge => ({
        source: filteredNodes.indexOf(edge.source),
        target: filteredNodes.indexOf(edge.target)
    })).filter(edge => edge.source !== -1 && edge.target !== -1);

    const canvas = document.getElementById('network-canvas');
    const nodesForWorker = JSON.parse(JSON.stringify(filteredNodes));
    worker.postMessage({
        nodes: nodesForWorker,
        edges: workerEdges,
        width: canvas.width,
        height: canvas.height
    });

    // Update and draw the flow visualization
    updateFlow(filteredEdges);
    draw(filteredNodes, filteredEdges, getParticles(), getTransform());

    requestAnimationFrame(animate);
}

// Start the animation
animate();
