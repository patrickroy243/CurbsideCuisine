import { useState, useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { 
  Search, 
  Filter, 
  Navigation, 
  Star,
  X,
  Utensils,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Users,
  ChevronDown,
  ChevronUp,
  Loader,
  Sparkles,
  Target,
  Eye,
  AlertCircle
} from 'lucide-react';
import { distance } from '@turf/distance';
import apiService from '../services/api';
import { Link } from 'react-router-dom';
import 'maplibre-gl/dist/maplibre-gl.css';

const CurbsideMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLocationOverride, setShowLocationOverride] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    isOpen: false,
    cuisines: [],
    maxDistance: 25,
    sortBy: 'distance'
  });

  const [availableCuisines, setAvailableCuisines] = useState([]);
  const markersRef = useRef([]);
  const popupRef = useRef(null);

  const mapStyle = 'https://tiles.openfreemap.org/styles/bright';

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [168.3685, -46.3878],
        zoom: 13,
        attributionControl: false
      });

      map.current.addControl(
        new maplibregl.AttributionControl({
          customAttribution: '© OpenFreeMap contributors'
        }),
        'bottom-right'
      );

      map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        setError('Failed to load map. Please refresh the page.');
      });

    } catch (error) {
      setError('Failed to initialize map. Please check your connection.');
    }

    return () => {
      if (map.current) {
        clearMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const fetchFoodTrucks = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await apiService.getFoodTrucks(1, 100);
      const trucks = data.items || data.data || data || [];
      
      if (trucks.length === 0) {
        setError('No food trucks found. The database might be empty.');
      }
      
      setFoodTrucks(trucks);
      setFilteredTrucks(trucks);
      
      const cuisines = [...new Set(trucks.map(truck => truck.cuisine).filter(Boolean))];
      setAvailableCuisines(cuisines);
      
    } catch (err) {
      setError('Failed to load food trucks. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setGettingLocation(true);
    setError('Getting your location...');
    
    let bestPosition = null;
    let watchId = null;
    let timeoutId = null;
    
    // First, try to get a quick position with getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        bestPosition = position;
        
        // If accuracy is good enough (< 50m), use it immediately
        if (accuracy <= 50) {
          console.log(`📍 Quick location found: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
          setUserLocation({ latitude, longitude });
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              duration: 2000
            });
          }
          setError('');
          setGettingLocation(false);
          return;
        }
        
        // Otherwise, start watching for better accuracy
        console.log(`📍 Initial location: ${latitude}, ${longitude} (accuracy: ${accuracy}m) - improving...`);
        setError(`Location found (accuracy: ${accuracy.toFixed(0)}m) - improving...`);
        
        watchId = navigator.geolocation.watchPosition(
          (newPosition) => {
            const newAccuracy = newPosition.coords.accuracy;
            
            // Update if this is more accurate
            if (!bestPosition || newAccuracy < bestPosition.coords.accuracy) {
              bestPosition = newPosition;
              console.log(`📍 Better location: ${newPosition.coords.latitude}, ${newPosition.coords.longitude} (accuracy: ${newAccuracy}m)`);
              setError(`Improving accuracy: ${newAccuracy.toFixed(0)}m`);
            }
            
            // Stop if we reach good accuracy (< 50m)
            if (newAccuracy <= 50) {
              navigator.geolocation.clearWatch(watchId);
              clearTimeout(timeoutId);
              
              const { latitude, longitude } = newPosition.coords;
              setUserLocation({ latitude, longitude });
              
              if (map.current) {
                map.current.flyTo({
                  center: [longitude, latitude],
                  zoom: 15,
                  duration: 2000
                });
              }
              setError('');
              setGettingLocation(false);
            }
          },
          (error) => {
            console.error('Watch position error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
        
        // Stop watching after 10 seconds and use best position available
        timeoutId = setTimeout(() => {
          if (watchId) {
            navigator.geolocation.clearWatch(watchId);
          }
          
          if (bestPosition) {
            const { latitude, longitude, accuracy } = bestPosition.coords;
            console.log(`📍 Final location: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
            setUserLocation({ latitude, longitude });
            
            if (map.current) {
              map.current.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                duration: 2000
              });
            }
            setError('');
          }
          setGettingLocation(false);
        }, 10000);
      },
      (error) => {
        let errorMessage = 'Could not get your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        console.error('Geolocation error:', error);
        setError(errorMessage);
        setGettingLocation(false);
        setShowLocationOverride(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  }, []);

  const setLocationToInvercargill = useCallback(() => {
    const sitCoords = { latitude: -46.4019, longitude: 168.3646 };
    setUserLocation(sitCoords);
    
    if (map.current) {
      map.current.flyTo({
        center: [sitCoords.longitude, sitCoords.latitude],
        zoom: 15,
        duration: 2000
      });
    }
    
    setError('');
    setShowLocationOverride(false);
    console.log('📍 Location manually set to SIT Invercargill');
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    
    if (map.current && map.current.isStyleLoaded()) {
      ['foodtruck-points', 'foodtruck-pins', 'user-location'].forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
      });
      ['foodtrucks', 'user-location'].forEach(sourceId => {
        if (map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      });
    }
  };

  const createFoodTruckPin = (truck, isSelected = false) => {
    const pinEl = document.createElement('div');
    pinEl.className = 'food-truck-marker';
    
    const color = truck.isOpen ? '#10B981' : '#EF4444';
    const size = isSelected ? 32 : 28;
    
    pinEl.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      transform-origin: center center;
      position: absolute;
      top: 0;
      left: 0;
    `;
    
    pinEl.innerHTML = `
      <svg width="14" height="11" fill="white" viewBox="0 0 24 18" style="pointer-events: none;">
        <path d="M19 7c0-1.1-.9-2-2-2h-3V3c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2H4c-1.1 0-2 .9-2 2v6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V7zM7 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    `;

    if (truck.isOpen !== undefined) {
      const statusDot = document.createElement('div');
      statusDot.style.cssText = `
        position: absolute;
        top: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        background: ${truck.isOpen ? '#10B981' : '#EF4444'};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        pointer-events: none;
      `;
      pinEl.appendChild(statusDot);
    }

    return pinEl;
  };

  const createMapPin = (truck, isSelected = false) => {
    const pinEl = document.createElement('div');
    pinEl.className = 'map-pin-marker';
    
    const color = truck.isOpen ? '#10B981' : '#EF4444';
    const size = isSelected ? 40 : 32;
    const height = isSelected ? 50 : 40;
    
    pinEl.style.cssText = `
      width: ${size}px;
      height: ${height}px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-50%, -100%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
      transform-origin: center bottom;
      pointer-events: auto;
      z-index: ${isSelected ? '100' : '1'};
      transition: transform 0.2s ease, z-index 0.2s ease;
    `;
    
    pinEl.innerHTML = `
      <svg width="${size}" height="${height}" viewBox="0 0 32 40" style="
        display: block;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        pointer-events: none;
      ">
        <!-- Main pin shape -->
        <path d="M16 0C7.2 0 0 7.2 0 16C0 16 0 16 0 16C0 25 16 40 16 40C16 40 32 25 32 16C32 16 32 16 32 16C32 7.2 24.8 0 16 0Z" 
              fill="${color}" stroke="white" stroke-width="2"/>
        
        <!-- Inner circle -->
        <circle cx="16" cy="16" r="10" fill="white" fill-opacity="0.95"/>
        
        <!-- Food truck icon -->
        <g transform="translate(16, 16)" pointer-events="none">
          <svg x="-7" y="-5" width="14" height="10" fill="${color}" viewBox="0 0 24 18">
            <path d="M19 7c0-1.1-.9-2-2-2h-3V3c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2H4c-1.1 0-2 .9-2 2v6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V7zM7 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        </g>
        
        <!-- Status dot -->
        <circle cx="24" cy="8" r="4" fill="${truck.isOpen ? '#10B981' : '#EF4444'}" stroke="white" stroke-width="2"/>
      </svg>
    `;

    return pinEl;
  };

  const createUserPin = () => {
    const userEl = document.createElement('div');
    userEl.style.cssText = `
      width: 24px;
      height: 24px;
      background: #3B82F6;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: center center;
    `;
    
    const pulseRing = document.createElement('div');
    pulseRing.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: userPulse 2s infinite;
      pointer-events: none;
    `;
    
    userEl.appendChild(pulseRing);
    return userEl;
  };

  const showTruckPopup = (truck) => {
    if (popupRef.current) {
      popupRef.current.remove();
    }

    const distanceText = userLocation 
      ? `${distance(
          [userLocation.longitude, userLocation.latitude],
          [truck.longitude, truck.latitude],
          { units: 'kilometers' }
        ).toFixed(1)} km away`
      : '';

    const popupHTML = `
      <div style="padding: 0; width: 320px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 12px 0; color: #111827; line-height: 1.3;">${truck.name}</h3>
          
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="
              background: ${truck.isOpen ? '#10B981' : '#EF4444'};
              color: white;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ${truck.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">${truck.cuisine || 'Various cuisines'}</span>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <div style="display: flex; align-items: center;">
              <span style="color: #F59E0B; margin-right: 6px; font-size: 16px;">★</span>
              <span style="font-size: 14px; color: #111827; font-weight: 600;">${(truck.averageRating || 0).toFixed(1)}</span>
              <span style="color: #9CA3AF; font-size: 13px; margin-left: 6px;">(${truck.totalReviews || 0} reviews)</span>
            </div>
            ${distanceText ? `
              <span style="color: #6B7280; font-size: 13px; font-weight: 500; white-space: nowrap;">${distanceText}</span>
            ` : ''}
          </div>
        </div>

        ${truck.description ? `
          <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6B7280; word-wrap: break-word; overflow-wrap: break-word;">${truck.description.length > 150 ? truck.description.substring(0, 150) + '...' : truck.description}</p>
          </div>
        ` : ''}

        <div style="padding: 20px;">
          <div style="display: flex; gap: 12px;">
            <a href="/food-trucks/${truck.foodTruckId}" 
               style="
                 flex: 1;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 padding: 12px 20px;
                 background: #3B82F6;
                 color: white;
                 text-decoration: none;
                 border-radius: 8px;
                 font-size: 14px;
                 font-weight: 600;
                 transition: background-color 0.2s ease;
                 text-align: center;
               "
               onmouseover="this.style.background='#2563EB'"
               onmouseout="this.style.background='#3B82F6'">
              View Details
            </a>
            ${truck.phone ? `
              <a href="tel:${truck.phone}" 
                 style="
                   padding: 12px 16px;
                   background: #10B981;
                   color: white;
                   text-decoration: none;
                   border-radius: 8px;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   transition: background-color 0.2s ease;
                   min-width: 48px;
                 "
                 onmouseover="this.style.background='#059669'"
                 onmouseout="this.style.background='#10B981'">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    popupRef.current = new maplibregl.Popup({ 
      closeOnClick: false,
      closeButton: true,
      offset: [0, -30],
      className: 'custom-popup',
      maxWidth: '350px'
    })
      .setLngLat([truck.longitude, truck.latitude])
      .setHTML(popupHTML)
      .addTo(map.current);

    if (map.current) {
      map.current.flyTo({
        center: [truck.longitude, truck.latitude],
        zoom: Math.max(map.current.getZoom(), 15),
        duration: 1000
      });
    }
  };

  const centerMapOnTrucks = useCallback(() => {
    if (!map.current || !mapLoaded || filteredTrucks.length === 0) return;

    const validTrucks = filteredTrucks.filter(truck => {
      const lat = parseFloat(truck.latitude);
      const lng = parseFloat(truck.longitude);
      return truck.longitude && truck.latitude && 
        !isNaN(lng) && !isNaN(lat) &&
        Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
        !(lat === 0 && lng === 0);
    }).map(truck => ({
      ...truck,
      latitude: parseFloat(truck.latitude),
      longitude: parseFloat(truck.longitude)
    }));

    if (validTrucks.length === 0) {
      console.log('⚠️ No trucks with valid coordinates found');
      return;
    }

    if (validTrucks.length === 1) {
      map.current.flyTo({
        center: [validTrucks[0].longitude, validTrucks[0].latitude],
        zoom: 15,
        duration: 2000
      });
    } else {
      const bounds = new maplibregl.LngLatBounds();
      validTrucks.forEach(truck => {
        bounds.extend([truck.longitude, truck.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 2000
      });
    }
  }, [filteredTrucks, mapLoaded]);

  const addMarkersToMap = useCallback(async () => {
    if (!map.current || !mapLoaded || !map.current.isStyleLoaded()) {
      return;
    }

    clearMarkers();

    const validTrucks = filteredTrucks.filter((truck) => {
      const lat = parseFloat(truck.latitude);
      const lng = parseFloat(truck.longitude);
      
      if (!truck.longitude || !truck.latitude || 
          isNaN(lng) || isNaN(lat) ||
          Math.abs(lat) > 90 || Math.abs(lng) > 180 ||
          lat === 0 && lng === 0) {
        console.log(`❌ Invalid coordinates for ${truck.name}: lat=${truck.latitude} (${lat}), lng=${truck.longitude} (${lng})`);
        return false;
      }
      return true;
    });

    const createMapPinIcon = (color, isSelected = false) => {
      const size = isSelected ? 48 : 32;
      const svg = `
        <svg width="${size}" height="${size * 1.25}" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          <!-- Pin shadow -->
          <path d="M16 2C8.2 2 2 8.2 2 16C2 25 16 38 16 38C16 38 30 25 30 16C30 8.2 23.8 2 16 2Z" 
                fill="rgba(0,0,0,0.2)" transform="translate(1,1)"/>
          <!-- Main pin shape -->
          <path d="M16 0C8.2 0 2 6.2 2 14C2 23 16 40 16 40C16 40 30 23 30 14C30 6.2 23.8 0 16 0Z" 
                fill="${color}" stroke="white" stroke-width="2"/>
          <!-- Inner circle for icon -->
          <circle cx="16" cy="14" r="8" fill="white" fill-opacity="0.95"/>
          <!-- Food truck icon -->
          <g transform="translate(16, 14)">
            <path d="M-5 -3 L-5 -1 L-3 -1 L-3 0 L3 0 L3 -1 L5 -1 L5 1 L3 1 L3 3 L1 3 L1 2 L-1 2 L-1 3 L-3 3 L-3 1 L-5 1 Z M-3 1 L-3 2 L-1 2 L-1 1 Z M1 1 L1 2 L3 2 L3 1 Z" 
                  fill="${color}" transform="scale(0.8)"/>
          </g>
        </svg>
      `;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const openPinIcon = 'open-pin';
    const closedPinIcon = 'closed-pin';
    const openPinSelectedIcon = 'open-pin-selected';
    const closedPinSelectedIcon = 'closed-pin-selected';

    if (!map.current.hasImage(openPinIcon)) {
      const openPinImg = new Image();
      openPinImg.onload = () => map.current.addImage(openPinIcon, openPinImg);
      openPinImg.src = createMapPinIcon('#10B981', false);
    }

    if (!map.current.hasImage(closedPinIcon)) {
      const closedPinImg = new Image();
      closedPinImg.onload = () => map.current.addImage(closedPinIcon, closedPinImg);
      closedPinImg.src = createMapPinIcon('#EF4444', false);
    }

    if (!map.current.hasImage(openPinSelectedIcon)) {
      const openPinSelectedImg = new Image();
      openPinSelectedImg.onload = () => map.current.addImage(openPinSelectedIcon, openPinSelectedImg);
      openPinSelectedImg.src = createMapPinIcon('#10B981', true);
    }

    if (!map.current.hasImage(closedPinSelectedIcon)) {
      const closedPinSelectedImg = new Image();
      closedPinSelectedImg.onload = () => map.current.addImage(closedPinSelectedIcon, closedPinSelectedImg);
      closedPinSelectedImg.src = createMapPinIcon('#EF4444', true);
    }

    if (validTrucks.length > 0) {
      const geojson = {
        type: 'FeatureCollection',
        features: validTrucks.map(truck => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(truck.longitude), parseFloat(truck.latitude)]
          },
          properties: {
            id: truck.foodTruckId,
            name: truck.name,
            isOpen: truck.isOpen,
            cuisine: truck.cuisine,
            description: truck.description,
            averageRating: truck.averageRating || 0,
            totalReviews: truck.totalReviews || 0,
            phone: truck.phone,
            isSelected: selectedTruck?.foodTruckId === truck.foodTruckId
          }
        }))
      };

      if (!map.current.getSource('foodtrucks')) {
        map.current.addSource('foodtrucks', {
          type: 'geojson',
          data: geojson
        });
      } else {
        map.current.getSource('foodtrucks').setData(geojson);
      }

      setTimeout(() => {
        if (!map.current.getLayer('foodtruck-pins')) {
          map.current.addLayer({
            id: 'foodtruck-pins',
            type: 'symbol',
            source: 'foodtrucks',
            layout: {
              'icon-image': [
                'case',
                ['get', 'isSelected'],
                [
                  'case',
                  ['get', 'isOpen'], openPinSelectedIcon,
                  closedPinSelectedIcon
                ],
                [
                  'case',
                  ['get', 'isOpen'], openPinIcon,
                  closedPinIcon
                ]
              ],
              'icon-size': 1,
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true
            }
          });

          map.current.on('click', 'foodtruck-pins', (e) => {
            const feature = e.features[0];
            const truck = validTrucks.find(t => t.foodTruckId === feature.properties.id);
            if (truck) {
              console.log('Map pin clicked:', truck.name);
              setSelectedTruck(truck);
              showTruckPopup({
                ...truck, 
                latitude: parseFloat(truck.latitude), 
                longitude: parseFloat(truck.longitude)
              });
            }
          });

          map.current.on('mouseenter', 'foodtruck-pins', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', 'foodtruck-pins', () => {
            map.current.getCanvas().style.cursor = '';
          });
        }
      }, 100);
    }

    if (userLocation) {
      const userGeojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [userLocation.longitude, userLocation.latitude]
          },
          properties: {}
        }]
      };

      if (!map.current.getSource('user-location')) {
        map.current.addSource('user-location', {
          type: 'geojson',
          data: userGeojson
        });
      } else {
        map.current.getSource('user-location').setData(userGeojson);
      }

      if (!map.current.getLayer('user-location')) {
        map.current.addLayer({
          id: 'user-location',
          type: 'circle',
          source: 'user-location',
          paint: {
            'circle-radius': 8,
            'circle-color': '#3B82F6',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
            'circle-stroke-opacity': 1
          }
        });
      }
    }
  }, [filteredTrucks, userLocation, mapLoaded, selectedTruck]);

  const getDistanceToUser = useCallback((truck) => {
    if (!userLocation || !truck.longitude || !truck.latitude) return null;
    return distance(
      [userLocation.longitude, userLocation.latitude],
      [truck.longitude, truck.latitude],
      { units: 'kilometers' }
    ).toFixed(1);
  }, [userLocation]);

  useEffect(() => {
    let filtered = [...foodTrucks];

    if (searchTerm.trim()) {
      filtered = filtered.filter(truck =>
        truck.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.isOpen) {
      filtered = filtered.filter(truck => truck.isOpen);
    }

    if (filters.cuisines.length > 0) {
      filtered = filtered.filter(truck => 
        truck.cuisine && filters.cuisines.includes(truck.cuisine)
      );
    }

    if (userLocation && filters.maxDistance < 50) {
      filtered = filtered.filter(truck => {
        if (!truck.longitude || !truck.latitude) return false;
        const dist = distance(
          [userLocation.longitude, userLocation.latitude],
          [truck.longitude, truck.latitude],
          { units: 'kilometers' }
        );
        return dist <= filters.maxDistance;
      });
    }

    if (filters.sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => {
        if (!a.longitude || !a.latitude || !b.longitude || !b.latitude) return 0;
        const distA = distance([userLocation.longitude, userLocation.latitude], [a.longitude, a.latitude], { units: 'kilometers' });
        const distB = distance([userLocation.longitude, userLocation.latitude], [b.longitude, b.latitude], { units: 'kilometers' });
        return distA - distB;
      });
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    setFilteredTrucks(filtered);
  }, [foodTrucks, searchTerm, filters, userLocation]);

  useEffect(() => {
    if (mapLoaded) {
      addMarkersToMap();
    }
  }, [addMarkersToMap, mapLoaded]);

  useEffect(() => {
    if (map.current && map.current.getSource('foodtrucks') && selectedTruck) {
      addMarkersToMap();
    }
  }, [selectedTruck, addMarkersToMap]);



  useEffect(() => {
    if (mapLoaded && foodTrucks.length > 0 && !userLocation) {
      console.log('🎯 Auto-centering map on food trucks');
      centerMapOnTrucks();
    }
  }, [foodTrucks, mapLoaded, userLocation, centerMapOnTrucks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCuisineFilter = (cuisine) => {
    setFilters(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      isOpen: false,
      cuisines: [],
      maxDistance: 25,
      sortBy: 'distance'
    });
    setSearchTerm('');
  };

  const handleTruckSelect = (truck) => {
    const lat = parseFloat(truck.latitude);
    const lng = parseFloat(truck.longitude);
    
    setSelectedTruck(truck);
    showTruckPopup({...truck, latitude: lat, longitude: lng});
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 1500
      });
    }
  };

  useEffect(() => {
    fetchFoodTrucks();
  }, [fetchFoodTrucks]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes userPulse {
        0% { 
          transform: translate(-50%, -50%) scale(1); 
          opacity: 0.8; 
        }
        100% { 
          transform: translate(-50%, -50%) scale(2); 
          opacity: 0; 
        }
      }
      
      .maplibregl-marker {
        will-change: transform !important;
        transform-style: preserve-3d !important;
      }
      
      .maplibregl-marker .map-pin-marker {
        pointer-events: auto !important;
        will-change: auto !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
        transform-style: flat !important;
      }
      
      .map-pin-marker * {
        pointer-events: none !important;
      }
      
      .maplibregl-marker {
        will-change: auto !important;
        transform-style: flat !important;
      }
      
      .maplibregl-map {
        transform: translateZ(0) !important;
      }
      
      .custom-popup .maplibregl-popup-content {
        padding: 0 !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.1) !important;
        border: 1px solid #e5e7eb !important;
        max-width: 350px !important;
        width: 320px !important;
        overflow: hidden !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      .custom-popup .maplibregl-popup-close-button {
        font-size: 20px !important;
        padding: 8px !important;
        color: #9CA3AF !important;
        background: transparent !important;
        border: none !important;
        top: 12px !important;
        right: 12px !important;
        width: 28px !important;
        height: 28px !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.2s ease !important;
      }
      
      .custom-popup .maplibregl-popup-close-button:hover {
        background: #F3F4F6 !important;
        color: #374151 !important;
        transform: scale(1.1) !important;
      }
      
      .custom-popup .maplibregl-popup-tip {
        border-top-color: white !important;
      }
      
      .sidebar-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #dadce0 transparent;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-thumb {
        background-color: #dadce0;
        border-radius: 3px;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #bdc1c6;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-gradient-to-br from-sky-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Utensils className="w-6 h-6" />}
      </button>

      {/* Sidebar - hidden on mobile unless mobileMenuOpen is true */}
      <div className={`
        ${sidebarCollapsed ? 'w-16' : 'w-full md:w-96'} 
        bg-white/90 backdrop-blur-md border-r border-sky-200 flex flex-col transition-all duration-300 relative shadow-2xl
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-40' : 'hidden md:flex md:z-10'}
      `}>
        <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative p-6">
            {!sidebarCollapsed && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Find Food Trucks</h1>
                      <p className="text-sky-100 text-sm">Discover amazing street food</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSidebarCollapsed(true);
                      setMobileMenuOpen(false);
                    }}
                    className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm hidden md:block"
                  >
                    <ChevronDown className="w-5 h-5 text-white transform rotate-90" />
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm md:hidden"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search food trucks, cuisines..."
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={getUserLocation}
                    disabled={gettingLocation}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-white/30 font-medium"
                  >
                    <Navigation className={`w-4 h-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                    {gettingLocation ? 'Finding...' : 'My Location'}
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm font-medium ${
                      showFilters ? 'bg-white text-sky-600' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {showLocationOverride && (
                  <div className="mb-4 p-4 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
                    <p className="text-white/90 text-sm mb-3 font-medium">
                      GPS showing wrong location?
                    </p>
                    <button
                      onClick={setLocationToInvercargill}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-sky-600 rounded-xl hover:bg-white/95 transition-all duration-300 font-medium shadow-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      Set Location to Invercargill
                    </button>
                  </div>
                )}

                {filteredTrucks.length > 0 && (
                  <button
                    onClick={centerMapOnTrucks}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/95 text-sky-600 rounded-xl hover:bg-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Target className="w-4 h-4" />
                    Show All Food Trucks
                  </button>
                )}
            </>
          )}

            {sidebarCollapsed && (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronDown className="w-5 h-5 text-white transform -rotate-90" />
                </button>
                <button
                  onClick={getUserLocation}
                  disabled={gettingLocation}
                  className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl disabled:opacity-50 transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  <Navigation className={`w-4 h-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {showFilters && (
              <div className="bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-lg">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Filter className="w-5 h-5 text-sky-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-sky-600 p-2 hover:bg-sky-100 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200">
                    <input
                      type="checkbox"
                      id="openNow"
                      checked={filters.isOpen}
                      onChange={(e) => handleFilterChange('isOpen', e.target.checked)}
                      className="w-4 h-4 text-sky-600 border-sky-300 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="openNow" className="ml-3 text-sm text-gray-800 font-medium">
                      Open now only
                    </label>
                  </div>

                  {userLocation && (
                    <div className="p-4 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl border border-cyan-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Distance: {filters.maxDistance} km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={filters.maxDistance}
                        onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                        className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer shadow-inner"
                        style={{
                          background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(filters.maxDistance / 50) * 100}%, #e2e8f0 ${(filters.maxDistance / 50) * 100}%, #e2e8f0 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                        <span>1 km</span>
                        <span>50 km</span>
                      </div>
                    </div>
                  )}

                  {availableCuisines.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <Utensils className="w-4 h-4 mr-2 text-blue-600" />
                        Cuisines ({filters.cuisines.length} selected)
                      </label>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto sidebar-scrollbar">
                        {availableCuisines.map((cuisine) => (
                          <label key={cuisine} className="flex items-center hover:bg-white/80 rounded-lg p-2 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.cuisines.includes(cuisine)}
                              onChange={() => toggleCuisineFilter(cuisine)}
                              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">{cuisine}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                      Sort by
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-gray-800 font-medium"
                    >
                      {userLocation && <option value="distance">Distance (closest first)</option>}
                      <option value="rating">Rating (highest first)</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>

                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-3 text-sm text-sky-600 border-2 border-sky-300 rounded-xl hover:bg-sky-600 hover:text-white transition-all duration-300 font-semibold bg-white/80 backdrop-blur-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {loading ? 'Loading...' : `${filteredTrucks.length} food trucks found`}
                  </h3>
                </div>
                {userLocation && filters.maxDistance < 50 && (
                  <span className="text-sm text-sky-600 bg-sky-100 px-3 py-1 rounded-full font-medium">within {filters.maxDistance}km</span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto sidebar-scrollbar">
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                    </div>
                    <span className="text-gray-700 font-medium">Loading food trucks...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-6">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 mr-4 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-red-700 font-medium mb-3">{error}</p>
                        <button
                          onClick={() => {
                            setError('');
                            fetchFoodTrucks();
                          }}
                          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && filteredTrucks.length === 0 && (
                <div className="p-6 text-center">
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-8 border border-sky-200 backdrop-blur-sm">
                    <Utensils className="w-16 h-16 text-sky-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold mb-3 text-lg">No food trucks found</p>
                    <p className="text-gray-600 mb-6">
                      {foodTrucks.length === 0 
                        ? 'No food trucks exist in the database yet. Create some food trucks first!'
                        : 'Try adjusting your filters or search terms'
                      }
                    </p>
                    {foodTrucks.length === 0 ? (
                      <Link
                        to="/dashboard"
                        className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-sky-700 transition-all duration-200 shadow-md inline-flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Go to Dashboard to Add Food Trucks
                      </Link>
                    ) : (
                      <button
                        onClick={clearAllFilters}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-md inline-flex items-center gap-2"
                      >
                        <Target className="w-4 h-4" />
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!loading && !error && filteredTrucks.length > 0 && (
                <div className="space-y-3 p-3">
                  {filteredTrucks.map((truck) => (
                    <div
                      key={truck.foodTruckId}
                      className={`p-6 cursor-pointer rounded-xl border transition-all duration-200 hover:shadow-lg ${
                        selectedTruck?.foodTruckId === truck.foodTruckId 
                          ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-300 shadow-md' 
                          : 'bg-white hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50 border-gray-200 hover:border-sky-300'
                      }`}
                      onClick={() => handleTruckSelect(truck)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">{truck.name}</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              truck.isOpen 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' 
                                : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm'
                            }`}>
                              {truck.isOpen ? 'Open' : 'Closed'}
                            </span>
                            <span className="text-sm text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded-lg">{truck.cuisine}</span>
                          </div>
                        </div>
                        {userLocation && (
                          <div className="text-right">
                            <div className="bg-gradient-to-r from-sky-100 to-blue-100 px-3 py-2 rounded-lg">
                              <div className="text-sm font-semibold text-sky-700">
                                {getDistanceToUser(truck)} km
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {truck.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{truck.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-sm text-gray-800 font-semibold">
                            {(truck.averageRating || 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({truck.totalReviews || 0} reviews)
                          </span>
                        </div>

                        <Link
                          to={`/food-trucks/${truck.foodTruckId}`}
                          className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-sky-700 transition-all duration-200 shadow-md flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile backdrop overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 relative">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default CurbsideMap;