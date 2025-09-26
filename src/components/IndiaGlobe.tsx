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
    if (!mountRef.current || complaintData.length === 0) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Globe setup
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#87CEEB')
      .atmosphereAltitude(0.1);

    scene.add(globe);

    // Load Indian states GeoJSON
    fetch('/data/india-states-simple.geojson')
      .then(response => response.json())
      .then(geoData => {
        // Add complaint data to features
        geoData.features.forEach((feature: any) => {
          const stateName = feature.properties.NAME_1 || feature.properties.name;
          const stateData = complaintData.find(d => 
            d.state_name.toLowerCase().includes(stateName.toLowerCase()) ||
            stateName.toLowerCase().includes(d.state_name.toLowerCase())
          );
          
          feature.properties.complaintCount = stateData?.complaint_count || 0;
          feature.properties.color = getStateColor(feature.properties.complaintCount);
        });

        globe
          .polygonsData(geoData.features)
          .polygonCapColor((d: any) => d.properties.color || '#666')
          .polygonSideColor(() => 'rgba(0, 0, 0, 0.1)')
          .polygonStrokeColor(() => '#111')
          .polygonAltitude(0.01);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 300;

    // Mouse controls
    let mouse = { x: 0, y: 0 };
    let mouseOnDown = { x: 0, y: 0 };
    let targetOnDown = { x: 0, y: 0 };
    let target = { x: Math.PI * 3/2, y: Math.PI / 6.0 };
    let targetOnDownPointer = { x: 0, y: 0 };
    let isMouseDown = false;

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown = true;
      isUserInteracting.current = true;
      
      mouseOnDown.x = -event.clientX;
      mouseOnDown.y = event.clientY;
      targetOnDown.x = target.x;
      targetOnDown.y = target.y;
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      mouse.x = -event.clientX;
      mouse.y = event.clientY;
      
      const zoomDamp = camera.position.z / 1000;
      target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
      target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;
      
      target.y = target.y > Math.PI / 2 ? Math.PI / 2 : target.y;
      target.y = target.y < -Math.PI / 2 ? -Math.PI / 2 : target.y;
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 2000); // Resume auto-rotation after 2 seconds
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseWheel = (event: WheelEvent) => {
      event.preventDefault();
      isUserInteracting.current = true;
      
      const zoomSpeed = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.z = Math.min(Math.max(camera.position.z * zoomSpeed, 150), 800);
      
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 2000);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('wheel', onMouseWheel);

    // Animation loop
    const animate = () => {
      // Auto-rotation when not interacting
      if (!isUserInteracting.current) {
        target.x += autoRotateSpeed * 0.01;
      }
      
      // Smooth camera movement
      const rotationX = target.x;
      const rotationY = target.y;
      
      camera.position.x = Math.cos(rotationY) * Math.cos(rotationX) * camera.position.z;
      camera.position.y = Math.sin(rotationY) * camera.position.z;
      camera.position.z = Math.cos(rotationY) * Math.sin(rotationX) * camera.position.z;
      
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Store refs
    globeRef.current = globe;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('wheel', onMouseWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [complaintData]);

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
      {complaintData.length === 0 && (
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