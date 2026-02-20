const NUM_NODES = 50;
const MAX_EDGES = 100;

let historicalData = [];

// A simple seeded random number generator for deterministic results
function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateDataAtTime(t) {
    const nodes = [];
    const edges = [];
    const seed = t * 12345; // Base seed for this timestamp

    // Generate nodes - their positions will evolve over time
    for (let i = 0; i < NUM_NODES; i++) {
        const angle = seededRandom(seed + i) * 2 * Math.PI;
        const radius = seededRandom(seed + i * 2) * 200 + 50;
        nodes.push({
            id: `n${i}`, // Give nodes string IDs
            x: 400 + Math.cos(angle) * radius,
            y: 300 + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
        });
    }

    // Determine the number of edges at this time
    const numEdges = Math.floor(seededRandom(seed + 1) * MAX_EDGES);

    // Generate edges
    for (let i = 0; i < numEdges; i++) {
        const sourceIdx = Math.floor(seededRandom(seed + i * 3) * NUM_NODES);
        let targetIdx = Math.floor(seededRandom(seed + i * 4) * NUM_NODES);

        // Avoid self-loops
        if (targetIdx === sourceIdx) {
            targetIdx = (targetIdx + 1) % NUM_NODES;
        }

        edges.push({
            source: nodes[sourceIdx],
            target: nodes[targetIdx],
            flow: seededRandom(seed + i * 5) * 10,
        });
    }

    return { nodes, edges };
}


export function initializeData() {
    for (let t = 0; t <= 100; t++) {
        historicalData.push(generateDataAtTime(t));
    }
}

export function getDataAtTime(t) {
    const index = Math.max(0, Math.min(100, Math.floor(t)));
    // Return a deep copy to prevent mutations from affecting the history
    return JSON.parse(JSON.stringify(historicalData[index]));
}

// These functions will now return the initial state (t=100)
export function getNodes() {
    return getDataAtTime(100).nodes;
}

export function getEdges() {
    return getDataAtTime(100).edges;
}
