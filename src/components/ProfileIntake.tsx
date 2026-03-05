import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';

interface ProfileIntakeProps {
  onComplete: (data: any) => void;
}

export default function ProfileIntake({ onComplete }: ProfileIntakeProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    }, 600); // 600ms debounce to prevent API flooding
  }, [searchQuery]);

  const selectLocation = (result: any) => {
    setSearchQuery(result.display_name);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setSearchResults([]);
  };

  const handleCommence = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthYear || !birthMonth || !birthDay || !birthTime || !utcOffset || !latitude || !longitude) {
      alert("System Warning: Spatial and Temporal coordinates are required to lock the matrix.");
      return;
    }

    // The Temporal Transducer: Convert local input to true UTC
    const sign = Number(utcOffset) >= 0 ? '+' : '-';
    const pad = (num: number) => Math.abs(num).toString().padStart(2, '0');
    const offsetString = `${sign}${pad(Number(utcOffset))}:00`;

    // Construct an ISO string to force the browser to calculate the exact UTC shift
    const localDate = new Date(`${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}T${birthTime}:00${offsetString}`);

    // Extract the mathematically aligned UTC coordinates
    const payload = {
      firstName,
      lastName,
      birthYear: localDate.getUTCFullYear().toString(),
      birthMonth: (localDate.getUTCMonth() + 1).toString(),
      birthDay: localDate.getUTCDate().toString(),
      birthTime: `${localDate.getUTCHours().toString().padStart(2, '0')}:${localDate.getUTCMinutes().toString().padStart(2, '0')}`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    onComplete(payload);
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
              onChange={e => setSearchQuery(e.target.value)} 
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
                {/* Additional offsets can be expanded here */}
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

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors">
          Commence Calculation <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
