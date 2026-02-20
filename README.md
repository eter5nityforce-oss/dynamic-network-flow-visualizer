# 동적 네트워크 흐름 시각화 대시보드 (Dynamic Network Flow Visualizer)

This is a browser-based interactive data visualization and analysis dashboard designed to visualize complex, evolving network data with dynamic flows and interactive analysis capabilities.

## Features

*   **High-Performance Rendering:** Utilizes HTML5 Canvas for smooth rendering of thousands of nodes and edges.
*   **Dynamic Layout:** Implements a force-directed graph layout that adjusts in real-time.
*   **Data Flow Visualization:** Represents data flow along edges using animated particles.
*   **Interactive Controls:** Supports panning, zooming, and node dragging.
*   **Real-time Data Simulation:** Continuously updates the network with simulated data.
*   **Web Worker Optimization:** Offloads layout calculations to a Web Worker to maintain a responsive UI.
*   **Contextual Details:** Displays information about selected nodes.

## Demo

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Serve the project:**
    Since this project is built with static HTML, CSS, and JavaScript files, you need to serve it using a local web server. The browser's security policies prevent loading modules (`import`/`export`) directly from the file system (`file:///...`).

    **Option A: Using Python's built-in server**
    If you have Python installed, you can run one of the following commands from the project's root directory:

    *   For Python 3:
        ```bash
        python -m http.server
        ```
    *   For Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```

    **Option B: Using Node.js and `http-server`**
    If you have Node.js, you can use the `http-server` package.

    *   Install `http-server` globally:
        ```bash
        npm install -g http-server
        ```
    *   Run the server from the project's root directory:
        ```bash
        http-server
        ```

3.  **Launch the project:**
    Open your web browser and navigate to the URL provided by the local server (usually `http://localhost:8000` or `http://localhost:8080`).

## How to Interact

*   **Pan:** Click and drag on an empty area of the canvas to move the entire graph.
*   **Zoom:** Use your mouse wheel to zoom in and out.
*   **Drag Nodes:** Click and drag a node to move it to a new position. The layout will dynamically adjust.
*   **View Details:** Click on a node to see its details in the panel on the left.
