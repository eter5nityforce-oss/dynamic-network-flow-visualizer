// This is a simplified version of the layout algorithm, adapted for a worker
const REPULSION_STRENGTH = 500;
const ATTRACTION_STRENGTH = 0.05;
const CENTERING_STRENGTH = 0.05;
const DAMPING = 0.95;
const SPRING_LENGTH = 150;

function updateLayout(nodes, edges, width, height) {
    const CENTER_X = width / 2;
    const CENTER_Y = height / 2;

    // Calculate repulsion forces
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];

            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const force = REPULSION_STRENGTH / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            if (nodeA.fx == null) {
                nodeA.vx -= fx;
                nodeA.vy -= fy;
            }
            if (nodeB.fx == null) {
                nodeB.vx += fx;
                nodeB.vy += fy;
            }
        }
    }

    // Calculate attraction forces
    edges.forEach(edge => {
        const source = nodes[edge.source];
        const target = nodes[edge.target];

        const dx = target.x - source.x;
        const dy = target.y - source.y;

        const fx = dx * ATTRACTION_STRENGTH;
        const fy = dy * ATTRACTION_STRENGTH;

        if (source.fx == null) {
            source.vx += fx;
            source.vy += fy;
        }
        if (target.fx == null) {
            target.vx -= fx;
            target.vy -= fy;
        }
    });

    // Add centering force
    nodes.forEach(node => {
        if (node.fx == null) {
            const dx = CENTER_X - node.x;
            const dy = CENTER_Y - node.y;
            node.vx += dx * CENTERING_STRENGTH;
            node.vy += dy * CENTERING_STRENGTH;
        }
    });


    // Update node positions
    nodes.forEach(node => {
        if (node.fx != null) {
            node.x = node.fx;
            node.y = node.fy;
            node.vx = 0;
            node.vy = 0;
        } else {
            node.vx *= DAMPING;
            node.vy *= DAMPING;
            node.x += node.vx;
            node.y += node.vy;
        }
    });
}

self.onmessage = function(e) {
    const { nodes, edges, width, height } = e.data;
    updateLayout(nodes, edges, width, height);
    self.postMessage({ nodes: nodes });
};
