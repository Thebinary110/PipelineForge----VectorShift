"""
main.py
FastAPI backend for the VectorShift pipeline builder.
Receives a pipeline payload (nodes + edges), counts them, and checks for DAG validity.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI(title="VectorShift Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Returns True if the pipeline graph is a directed acyclic graph.

    Uses 3-color DFS to detect back edges (cycles):
      0 = unvisited, 1 = currently in DFS stack, 2 = fully processed.
    Iterates all nodes to handle disconnected components.
    """
    node_ids = {node["id"] for node in nodes}

    adjacency: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source in adjacency and target in adjacency:
            adjacency[source].append(target)

    color: Dict[str, int] = {nid: 0 for nid in node_ids}

    def dfs(node_id: str) -> bool:
        color[node_id] = 1  # mark as in-stack
        for neighbor in adjacency[node_id]:
            if color[neighbor] == 1:
                return False  # back edge → cycle detected
            if color[neighbor] == 0 and not dfs(neighbor):
                return False
        color[node_id] = 2  # mark as fully processed
        return True

    for node_id in node_ids:
        if color[node_id] == 0:
            if not dfs(node_id):
                return False

    return True


@app.get("/")
def read_root():
    return {"status": "VectorShift pipeline API is running"}


@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: PipelineData):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}
