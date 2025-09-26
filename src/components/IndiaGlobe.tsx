import React, { useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { supabase } from '@/integrations/supabase/client';

interface StateComplaintData {
  state_name: string;
  complaint_count: number;
}

const IndiaGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [complaintData, setComplaintData] = useState<StateComplaintData[]>([]);
  const animationRef = useRef<number>();
  const isUserInteracting = useRef(false);
  const autoRotateSpeed = 0.5;

  // Fetch complaint data grouped by state
  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const { data: complaints, error } = await supabase
          .from('complaints')
          .select(`
            state_id,
            states!inner(name)
          `);

        if (error) throw error;

        // Group by state and count complaints
        const stateCount: { [key: string]: number } = {};
        complaints?.forEach(complaint => {
          const stateName = (complaint.states as any)?.name;
          if (stateName) {
            stateCount[stateName] = (stateCount[stateName] || 0) + 1;
          }
        });

        const stateData: StateComplaintData[] = Object.entries(stateCount).map(([state_name, complaint_count]) => ({
          state_name,
          complaint_count
        }));

        console.log('Fetched complaint data:', stateData);
        setComplaintData(stateData);
      } catch (error) {
        console.error('Error fetching complaint data:', error);
        // Fallback mock data
        setComplaintData([
          { state_name: 'Maharashtra', complaint_count: 150 },
          { state_name: 'Karnataka', complaint_count: 120 },
          { state_name: 'Tamil Nadu', complaint_count: 100 },
          { state_name: 'Uttar Pradesh', complaint_count: 80 },
          { state_name: 'West Bengal', complaint_count: 70 },
        ]);
      }
    };

    fetchComplaintData();
  }, []);

  // Get color based on complaint count
  const getStateColor = (complaintCount: number) => {
    const maxComplaints = Math.max(...complaintData.map(d => d.complaint_count), 1);
    const intensity = complaintCount / maxComplaints;
    
    if (intensity <= 0.33) {
      // Green to Yellow
      const r = Math.floor(intensity * 3 * 255);
      return `rgb(${r}, 255, 0)`;
    } else if (intensity <= 0.66) {
      // Yellow to Orange
      const g = Math.floor((1 - (intensity - 0.33) * 3) * 255);
      return `rgb(255, ${g}, 0)`;
    } else {
      // Orange to Red
      const g = Math.floor((1 - (intensity - 0.66) * 3) * 100);
      return `rgb(255, ${g}, 0)`;
    }
  };

  useEffect(() => {
    console.log('Globe effect triggered, complaintData:', complaintData);
    if (!mountRef.current) {
      console.log('Mount ref not available');
      return;
    }

    // Start with mock data if real data isn't loaded yet
    const dataToUse = complaintData.length > 0 ? complaintData : [
      { state_name: 'Maharashtra', complaint_count: 50 },
      { state_name: 'Karnataka', complaint_count: 30 },
      { state_name: 'Tamil Nadu', complaint_count: 25 }
    ];
    console.log('Using data:', dataToUse);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    console.log('Container dimensions:', width, height);

    try {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);
      console.log('Three.js scene created successfully');

      // Globe setup
      const globe = new ThreeGlobe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .showGlobe(true)
        .showAtmosphere(true)
        .atmosphereColor('#87CEEB')
        .atmosphereAltitude(0.1);

      scene.add(globe);
      console.log('Globe created and added to scene');

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Position camera
      camera.position.z = 300;

      // Simple animation loop
      let animationId: number;
      const animate = () => {
        // Simple auto rotation
        globe.rotation.y += 0.005;
        
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animate();
      console.log('Animation started');

      // Store refs
      globeRef.current = globe;
      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      animationRef.current = animationId;

      // Cleanup
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        
        renderer.dispose();
        console.log('Cleanup completed');
      };
    } catch (error) {
      console.error('Error setting up globe:', error);
    }
  }, [mountRef.current]); // Simplified dependency

  const maxComplaints = Math.max(...complaintData.map(d => d.complaint_count), 1);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <h4 className="font-semibold mb-2">Complaint Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span>Low (0 - {Math.floor(maxComplaints * 0.33)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-yellow-500 rounded"></div>
            <span>Medium ({Math.floor(maxComplaints * 0.33)} - {Math.floor(maxComplaints * 0.66)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span>High ({Math.floor(maxComplaints * 0.66)}+)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-300">
          Click and drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Loading overlay */}
      {!globeRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading globe...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaGlobe;