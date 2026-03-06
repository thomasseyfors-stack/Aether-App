import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

interface ProfileIntakeProps {
  onComplete?: (data: any) => void;
  onSubmit?: (data: any) => void;
  onCalculate?: (data: any) => void;
}

export default function ProfileIntake({ onComplete, onSubmit, onCalculate }: ProfileIntakeProps) {
  const [firstName, setFirstName] = useState(localStorage.getItem('aether_user_fname') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('aether_user_lname') || '');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [utcOffset, setUtcOffset] = useState('');
  
  // Spatial Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [validationError, setValidationError] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Predictive Geolocation Search via Nominatim API
  useEffect(() => {
    if (searchQuery.length < 3) {
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
  }, [searchQuery]);

  // If user edits the search bar after selecting a city, wipe the spatial coordinates to force a re-selection
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
    setValidationError(''); // Clear any previous errors
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
      // 1. Robust Time Parsing (Armor against AM/PM string collisions)
      let hours = 0;
      let minutes = 0;
      
      const timeStrLower = birthTime.toLowerCase();
      if (timeStrLower.includes('p') || timeStrLower.includes('a')) {
         const cleanTime = birthTime.replace(/[^0-9:]/g, ''); // Strips all letters
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
      
      // 2. Calculate timestamp as if local time was UTC
      const utcEquivalent = Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes);
      
      // 3. Subtract offset (e.g., -10 hours) to shift to True UTC
      const offsetMs = Number(utcOffset) * 60 * 60 * 1000;
      const trueUtcTime = new Date(utcEquivalent - offsetMs);

      // Validate structural integrity before building payload
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
    } catch (err: any) {
      console.error("Temporal Calculation Error:", err);
      setValidationError(`Calculation Error: ${err.message || "Invalid temporal format."}`);
      return; // Abort launch
    }

    // 4. Fire payload OUTSIDE the try-catch to prevent swallowing App routing errors
    try {
      if (onSubmit) {
        onSubmit(payload);
      } else if (onComplete) {
        onComplete(payload);
      } else if (onCalculate) {
        onCalculate(payload);
      } else {
        throw new Error("Missing submission prop. Parent component did not connect the data line.");
      }
    } catch (err: any) {
      console.error("Payload Routing Error:", err);
      setValidationError("System Warning: The Main Application rejected the matrix payload. Check console.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
        <MapPin className="w-6 h-6" /> Spatial & Temporal Calibration
      </h2>
      
      <form onSubmit={handleCommence} className="space-y-6">
        {/* Identity Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        {/* Temporal Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Year</label>
            <input type="number" placeholder="YYYY" value={birthYear} onChange={e => setBirthYear(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Month</label>
            <input type="number" placeholder="MM" min="1" max="12" value={birthMonth} onChange={e => setBirthMonth(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Day</label>
            <input type="number" placeholder="DD" min="1" max="31" value={birthDay} onChange={e => setBirthDay(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Local Time</label>
            <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" required />
          </div>
        </div>

        {/* Spatial Grid */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-slate-400 flex items-center gap-2">
              <Search className="w-4 h-4" /> Birth City Search
            </label>
            <input 
              type="text" 
              placeholder="e.g., Adak, Alaska" 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" 
            />
            
            {/* Predictive Radar Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => selectLocation(result)}
                    className="px-3 py-2 hover:bg-emerald-900/50 cursor-pointer text-sm border-b border-slate-700 last:border-0"
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium mb-1 text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Historical UTC Offset
              </label>
              <select value={utcOffset} onChange={e => setUtcOffset(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none" required>
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
              <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded border border-slate-700">
                <span className="block text-emerald-400 font-mono">LAT: {latitude || '---'}</span>
                <span className="block text-emerald-400 font-mono">LON: {longitude || '---'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* UI Validation Shield */}
        {validationError && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <p>{validationError}</p>
          </div>
        )}

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors">
          Commence Calculation <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
