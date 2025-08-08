"use client";

import React, { useMemo } from "react";
import ReactFlow, { Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import Link from "next/link";

export interface SystemicLensProps {
  centerLabel: string; // e.g., org/repo
  countryPolicies: string[]; // labels like Org/Repo
  cityPolicies: string[]; // labels like Org/Repo
}

export default function SystemicLens({ centerLabel, countryPolicies, cityPolicies }: SystemicLensProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Center node
    nodes.push({ id: "center", position: { x: 0, y: 0 }, data: { label: labelToLink(centerLabel) }, style: centerStyle });

    // Country side (left)
    countryPolicies.forEach((p, i) => {
      const id = `c-${i}`;
      nodes.push({ id, position: { x: -250, y: i * 80 - (countryPolicies.length - 1) * 40 }, data: { label: labelToLink(p) }, style: sideStyle });
      edges.push({ id: `e-${id}`, source: id, target: "center", animated: false, style: edgeStyle });
    });

    // City side (right)
    cityPolicies.forEach((p, i) => {
      const id = `s-${i}`;
      nodes.push({ id, position: { x: 250, y: i * 80 - (cityPolicies.length - 1) * 40 }, data: { label: labelToLink(p) }, style: sideStyle });
      edges.push({ id: `e-${id}`, source: "center", target: id, animated: false, style: edgeStyle });
    });

    return { nodes, edges };
  }, [centerLabel, countryPolicies, cityPolicies]);

  return (
    <div className="h-[360px] w-full rounded-md border border-neutral-800 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
      >
        <Background color="#2a2a2a" gap={16} />
      </ReactFlow>
    </div>
  );
}

const centerStyle = {
  background: "#0b0b0b",
  color: "#e5e7eb",
  border: "1px solid #262626",
  padding: 8,
  borderRadius: 8,
};

const sideStyle = {
  background: "#0f0f10",
  color: "#e5e7eb",
  border: "1px solid #2c2c2c",
  padding: 6,
  borderRadius: 8,
};

const edgeStyle = { stroke: "#3f3f46" } as const;

function labelToLink(label: string) {
  const [org, repo] = label.split("/");
  const href = `/libraries/${encodeURIComponent(org)}/${encodeURIComponent(repo)}`;
  return (
    <Link href={href} className="underline-offset-4 hover:underline">
      {label}
    </Link>
  );
}


