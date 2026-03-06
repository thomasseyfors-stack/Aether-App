import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, ArrowRight, AlertTriangle, Info } from 'lucide-react';

interface ProfileIntakeProps {
  onComplete?: (data: any) => void;
  onSubmit?: (data: any) => void;
  onCalculate?: (data: any) => void;
}

export default function ProfileIntake({ onComplete, onSubmit, onCalculate }: ProfileIntakeProps) {
  // 1. Memory Extraction: Load previously saved telemetry from the local Black Box
  const savedData = JSON.parse(localStorage.getItem('aether_form_data') || '{}');

  const [firstName, setFirstName] = useState(savedData.firstName || localStorage.getItem('aether_user_fname') || '');
  const [lastName, setLastName] = useState(savedData.lastName || localStorage.getItem('aether_user_lname') || '');
  const [birthYear, setBirthYear] = useState(savedData.birthYear || '');
  const [birthMonth, setBirthMonth] = useState(savedData.birthMonth || '');
  const [birthDay, setBirthDay] = useState(savedData.birthDay || '');
  const [birthTime, setBirthTime] = useState(savedData.birthTime || '');
  const [utcOffset, setUtcOffset] = useState(savedData.utcOffset || '');
  
  const [searchQuery, setSearchQuery] = useState(savedData.searchQuery || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [latitude, setLatitude] = useState(savedData.latitude || '');
  const [longitude, setLongitude] = useState(savedData.longitude || '');
  
  const [validationError, setValidationError] = useState('');
  const [isModified, setIsModified] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Modification Sensor: Detects shifts in core geometry
  useEffect(() => {
    if (savedData.birthYear) { // Only track modifications if there is a baseline saved
      const hasChanged = 
        birthYear !== savedData.birthYear ||
        birthMonth !== savedData.birthMonth ||
        birthDay !== savedData.birthDay ||
        birthTime !== savedData.birthTime ||
        utcOffset !== savedData.utcOffset ||
        latitude !== savedData.latitude ||
        longitude !== savedData.longitude;
      
      setIsModified(hasChanged);
    }
  }, [birthYear, birthMonth, birthDay, birthTime, utcOffset, latitude, longitude]);

  // Predictive Geolocation Search via Nominatim API
  useEffect(() => {
    if (searchQuery.length < 3 || searchQuery === savedData.searchQuery) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Spatial Radar Error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  }, [searchQuery, savedData.searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (latitude || longitude) {
      setLatitude('');
      setLongitude('');
    }
  };

  const selectLocation = (result: any) => {
    setSearchQuery(result.display_name);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setSearchResults([]);
    setValidationError(''); 
  };

  const handleCommence = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!birthYear || !birthMonth || !birthDay || !birthTime) {
      setValidationError("System Warning: Temporal coordinates (Date & Time) are required.");
      return;
    }

    if (!utcOffset) {
      setValidationError("System Warning: Historical UTC Offset is required to map true orbital positions.");
      return;
    }

    if (!latitude || !longitude) {
      setValidationError("System Warning: You must click a specific Birth City from the predictive dropdown to lock your GPS coordinates.");
      return;
    }

    let payload;
    try {
      let hours = 0;
      let minutes = 0;
      
      const timeStrLower = birthTime.toLowerCase();
      if (timeStrLower.includes('p') || timeStrLower.includes('a')) {
         const cleanTime = birthTime.replace(/[^0-9:]/g, ''); 
         const [h, m] = cleanTime.split(':').map(Number);
         hours = h;
         minutes = m;
         if (timeStrLower.includes('p') && hours < 12) hours += 12;
         if (timeStrLower.includes('a') && hours === 12) hours = 0;
      } else {
         const [h, m] = birthTime.split(':').map(Number);
         hours = h;
         minutes = m;
      }
      
      const utcEquivalent = Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes);
      const offsetMs = Number(utcOffset) * 60 * 60 * 1000;
      const trueUtcTime = new Date(utcEquivalent - offsetMs);

      if (isNaN(trueUtcTime.getTime())) {
         throw new Error("Mathematical rendering returned an Invalid Date. Check input sequence.");
      }

      payload = {
        firstName,
        lastName,
        birthYear: trueUtcTime.getUTCFullYear().toString(),
        birthMonth: (trueUtcTime.getUTCMonth() + 1).toString(),
        birthDay: trueUtcTime.getUTCDate().toString(),
        birthTime: `${trueUtcTime.getUTCHours().toString().padStart(2, '0')}:${trueUtcTime.getUTCMinutes().toString().padStart(2, '0')}`,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      // 3. Cache Write: Save successful structural inputs to local memory
      localStorage.setItem('aether_form_data', JSON.stringify({
        firstName, lastName, birthYear, birthMonth, birthDay, birthTime, utcOffset, searchQuery, latitude, longitude
      }));

    } catch (err: any) {
      console.error("Temporal Calculation Error:", err);
      setValidationError(`Calculation Error: ${err.message || "Invalid temporal format."}`);
      return; 
    }

    try {
      if (onSubmit) onSubmit(payload);
      else if (onComplete) onComplete(payload);
      else if (onCalculate) onCalculate(payload);
      else throw new Error("Missing submission prop.");
    } catch (err: any) {
      console.error("Payload Routing Error:", err);
      setValidationError("System Warning: The Main Application rejected the matrix payload.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-obsidian border border-nebula-purple/30 rounded-xl shadow-[0_0_30px_rgba(106,13,173,0.1)] text-starlight-white">
      <h2 className="text-2xl font-bold mb-6 text-astral-gold border-b border-ash-grey/20 pb-4 flex items-center gap-2 uppercase tracking-widest">
        <MapPin className="w-6 h-6" /> Spatial & Temporal Calibration
      </h2>
      
      <form onSubmit={handleCommence} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">Year</label>
            <input type="number" placeholder="YYYY" value={birthYear} onChange={e => setBirthYear(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">Month</label>
            <input type="number" placeholder="MM" min="1" max="12" value={birthMonth} onChange={e => setBirthMonth(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">Day</label>
            <input type="number" placeholder="DD" min="1" max="31" value={birthDay} onChange={e => setBirthDay(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey">Local Time</label>
            <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" required />
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-lg border border-ash-grey/10 space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey flex items-center gap-2">
              <Search className="w-4 h-4" /> Birth City Search
            </label>
            <input 
              type="text" 
              placeholder="e.g., Adak, Alaska" 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors" 
            />
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-obsidian border border-ash-grey/20 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => selectLocation(result)}
                    className="px-4 py-3 hover:bg-nebula-purple/30 cursor-pointer text-sm border-b border-ash-grey/10 last:border-0 transition-colors"
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ash-grey flex items-center gap-2">
                <Clock className="w-4 h-4" /> Historical UTC Offset
              </label>
              <select value={utcOffset} onChange={e => setUtcOffset(e.target.value)} className="w-full bg-black/50 border border-ash-grey/20 rounded-lg px-3 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors appearance-none" required>
                <option value="">Select Offset...</option>
                <option value="-11">-11 (Samoa)</option>
                <option value="-10">-10 (Hawaii-Aleutian)</option>
                <option value="-9">-9 (Alaska)</option>
                <option value="-8">-8 (Pacific)</option>
                <option value="-7">-7 (Mountain)</option>
                <option value="-6">-6 (Central)</option>
                <option value="-5">-5 (Eastern)</option>
                <option value="0">0 (GMT/UTC)</option>
                <option value="1">+1 (Central European)</option>
                <option value="5.5">+5.5 (India)</option>
                <option value="8">+8 (China/AWST)</option>
                <option value="10">+10 (AEST)</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="text-xs text-ash-grey bg-black/50 p-3 rounded-lg border border-ash-grey/10">
                <span className="block text-astral-gold font-mono">LAT: {latitude ? parseFloat(latitude).toFixed(4) : '---'}</span>
                <span className="block text-astral-gold font-mono">LON: {longitude ? parseFloat(longitude).toFixed(4) : '---'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Modification Warning Shield */}
        {isModified && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
            <Info className="w-5 h-5 shrink-0 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-bold text-sm uppercase tracking-wider mb-1">Structural Modification Detected</p>
              <p className="text-xs leading-relaxed">
                Altering your temporal or spatial coordinates from the baseline will fundamentally recalculate your entire celestial matrix and shift your geometric patterns.
              </p>
            </div>
          </div>
        )}

        {validationError && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <p className="text-sm">{validationError}</p>
          </div>
        )}

        <button type="submit" className="w-full bg-nebula-purple hover:bg-nebula-purple/80 text-starlight-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors uppercase tracking-widest">
          Commence Calculation <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
