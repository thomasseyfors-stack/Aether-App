import React, { useState } from 'react';

export default function ProfileIntake() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthTime: '',
    birthCity: '',
    birthState: '',
    birthCountry: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payload, setPayload] = useState<any>(null);

  const currentYear = new Date().getFullYear();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    
    if (!formData.birthYear) {
      newErrors.birthYear = 'Required';
    } else if (parseInt(formData.birthYear) > currentYear) {
      newErrors.birthYear = 'Cannot be in the future';
    } else if (parseInt(formData.birthYear) < 1900) {
      newErrors.birthYear = 'Invalid year';
    }

    if (!formData.birthMonth) newErrors.birthMonth = 'Required';
    
    if (!formData.birthDay) {
      newErrors.birthDay = 'Required';
    } else if (formData.birthMonth && formData.birthYear) {
      const maxDays = getDaysInMonth(parseInt(formData.birthMonth), parseInt(formData.birthYear));
      if (parseInt(formData.birthDay) > maxDays || parseInt(formData.birthDay) < 1) {
        newErrors.birthDay = `Invalid day for selected month (Max: ${maxDays})`;
      }
    }

    if (!formData.birthCity) newErrors.birthCity = 'Required';
    if (!formData.birthCountry) newErrors.birthCountry = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // 12:00 PM Fail-Safe
      const finalTime = formData.birthTime.trim() === '' ? '12:00' : formData.birthTime;
      
      const submissionPayload = {
        ...formData,
        birthTime: finalTime,
        timestamp: new Date().toISOString()
      };
      
      setPayload(submissionPayload);
      console.log('Calculation Payload:', submissionPayload);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-nebula-purple/30 pb-6">
          <h1 className="text-3xl font-bold text-astral-gold tracking-widest uppercase mb-2">Structural Life Mapping</h1>
          <p className="text-ash-grey text-sm tracking-widest uppercase">Temporal & Spatial Coordinates Intake</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Section */}
          <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
            <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
              Identity Matrix
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">First Name *</label>
                <input 
                  type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  className={`w-full bg-obsidian border ${errors.firstName ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Middle Name</label>
                <input 
                  type="text" name="middleName" value={formData.middleName} onChange={handleChange}
                  className="w-full bg-obsidian border border-ash-grey/30 rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Last Name *</label>
                <input 
                  type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  className={`w-full bg-obsidian border ${errors.lastName ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Gender (Optional)</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="w-full md:w-1/3 bg-obsidian border border-ash-grey/30 rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors appearance-none"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </section>

          {/* Temporal Coordinates */}
          <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
            <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
              Temporal Coordinates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth Year *</label>
                <input 
                  type="number" name="birthYear" value={formData.birthYear} onChange={handleChange} placeholder="YYYY"
                  className={`w-full bg-obsidian border ${errors.birthYear ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth Month *</label>
                <select 
                  name="birthMonth" value={formData.birthMonth} onChange={handleChange}
                  className={`w-full bg-obsidian border ${errors.birthMonth ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors appearance-none`}
                >
                  <option value="">MM</option>
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>}
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth Day *</label>
                <input 
                  type="number" name="birthDay" value={formData.birthDay} onChange={handleChange} placeholder="DD"
                  className={`w-full bg-obsidian border ${errors.birthDay ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.birthDay && <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>}
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth Time</label>
                <input 
                  type="time" name="birthTime" value={formData.birthTime} onChange={handleChange}
                  className="w-full bg-obsidian border border-ash-grey/30 rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors [color-scheme:dark]"
                />
                <p className="text-ash-grey/50 text-[10px] mt-1 uppercase">Defaults to 12:00 PM if blank</p>
              </div>
            </div>
          </section>

          {/* Spatial Coordinates */}
          <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
            <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
              Spatial Coordinates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth City *</label>
                <input 
                  type="text" name="birthCity" value={formData.birthCity} onChange={handleChange}
                  className={`w-full bg-obsidian border ${errors.birthCity ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.birthCity && <p className="text-red-500 text-xs mt-1">{errors.birthCity}</p>}
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth State/Province</label>
                <input 
                  type="text" name="birthState" value={formData.birthState} onChange={handleChange}
                  className="w-full bg-obsidian border border-ash-grey/30 rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-ash-grey text-xs uppercase tracking-wider mb-2">Birth Country *</label>
                <input 
                  type="text" name="birthCountry" value={formData.birthCountry} onChange={handleChange}
                  className={`w-full bg-obsidian border ${errors.birthCountry ? 'border-red-500' : 'border-ash-grey/30'} rounded-lg px-4 py-2 text-starlight-white focus:outline-none focus:border-astral-gold transition-colors`}
                />
                {errors.birthCountry && <p className="text-red-500 text-xs mt-1">{errors.birthCountry}</p>}
              </div>
            </div>
          </section>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm">
              <p className="font-semibold uppercase tracking-wider mb-1">Validation Error</p>
              <p>Please correct the highlighted fields before proceeding.</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-astral-gold hover:bg-astral-gold/90 text-obsidian font-bold py-4 px-6 rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(245,208,97,0.3)]"
          >
            Commence Calculation
          </button>
        </form>

        {payload && (
          <div className="mt-8 p-6 bg-obsidian border border-astral-gold/30 rounded-xl">
            <h3 className="text-astral-gold font-semibold uppercase tracking-widest text-sm mb-4">Payload Generated</h3>
            <pre className="text-ash-grey text-xs overflow-x-auto p-4 bg-black/50 rounded-lg border border-ash-grey/10 font-mono">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
