const PARTICLES_PER_EDGE = 3;
const PARTICLE_SPEED_MULTIPLIER = 0.1;

let particles = [];

export function resetParticles(edges) {
    particles = [];
    edges.forEach(edge => {
        for (let i = 0; i < PARTICLES_PER_EDGE; i++) {
            particles.push({
                edge: edge,
                progress: Math.random()
            });
        }
    });
}

export function updateFlow(edges) {
    // If there are no particles, create them
    if (particles.length === 0 && edges.length > 0) {
        resetParticles(edges);
    }

    // Update particle positions
    particles.forEach(particle => {
        const edge = particle.edge;
        const speed = edge.flow * PARTICLE_SPEED_MULTIPLIER;
        particle.progress += speed / 100;

        if (particle.progress > 1) {
            particle.progress = 0;
        }
    });
}

export function getParticles() {
    return particles;
}
