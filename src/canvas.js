let canvas;
let ctx;
let selectedNode = null; // Keep track of the selected node

export function init() {
    canvas = document.getElementById('network-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

export function setSelectedNode(node) {
    selectedNode = node;
}


export function draw(nodes, edges, particles, transform) {
    if (!ctx) {
        return;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Draw edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1 / transform.scale;
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.source.x, edge.source.y);
        ctx.lineTo(edge.target.x, edge.target.y);
        ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5 / transform.scale, 0, 2 * Math.PI);
        if (node === selectedNode) {
            ctx.fillStyle = 'rgba(255, 165, 0, 1)'; // Highlight selected node in orange
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
            ctx.lineWidth = 2 / transform.scale;
            ctx.stroke();
        } else {
            ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
        }
        ctx.fill();
    });

    // Draw flow particles
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    particles.forEach(particle => {
        const edge = particle.edge;
        const x = edge.source.x + (edge.target.x - edge.source.x) * particle.progress;
        const y = edge.source.y + (edge.target.y - edge.source.y) * particle.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2 / transform.scale, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.restore();
}