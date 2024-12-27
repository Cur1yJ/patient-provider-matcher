'use client';

import { useState } from 'react';
import ProviderResults from './provider-results';

export default function Home() {
    const [searchResults, setSearchResults] = useState([]);

    const [formState, setFormState] = useState({
        languages: new Set(["English"]),
        modalities: new Set(),
        state: '',
        areasOfConcern: new Set(),
        paymentMethods: new Set(),
        therapistPreferences: new Set()
    });

    const updateSet = (field, value) => {
        setFormState(prev => {
            const newSet = new Set(prev[field]);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return {
                ...prev,
                [field]: newSet
            };
        });
    };

    const updateState = (stateValue) => {
        setFormState(prev => ({
            ...prev,
            state: stateValue
        }));
    };

    const handleSearch = async () => {
        const searchParams = {
            areas_of_concern: Array.from(formState.areasOfConcern),
            preferred_treatment_modality: Array.from(formState.modalities),
            languages: Array.from(formState.languages).map(lang => lang.toLowerCase()),
            payment_methods: Array.from(formState.paymentMethods),
            therapist_preferences: Array.from(formState.therapistPreferences),
            locations: formState.state ? [formState.state.toLowerCase()] : []
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/providers/search', { // this should be an environment variable
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Find a mental health services provider</h1>

            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <StateSelector
                selected={formState.state}
                onChange={updateState}
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Areas of Concern</h2>
            <p className="mb-4">Select the areas you'd like to work on with your provider.</p>
            <AreasOfConcern
                selected={formState.areasOfConcern}
                onChange={(value) => updateSet('areasOfConcern', value)}
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Languages</h2>
            <p className="mb-4">Choose any languages you're comfortable speaking to your health provider in.</p>
            <LanguageSelector
                selected={formState.languages}
                onChange={(value) => updateSet('languages', value)}
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Preferred Treatment Modality</h2>
            <p className="mb-4">If there are any treatment modalities you prefer, select them below.</p>
            <TreatmentModalities
                selected={formState.modalities}
                onChange={(value) => updateSet('modalities', value)}
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Payment Methods</h2>
            <p className="mb-4">Select your preferred payment methods.</p>
            <PaymentMethods
                selected={formState.paymentMethods}
                onChange={(value) => updateSet('paymentMethods', value)}
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Therapist Preferences</h2>
            <p className="mb-4">Select any preferences you have regarding your therapist.</p>
            <TherapistPreferences
                selected={formState.therapistPreferences}
                onChange={(value) => updateSet('therapistPreferences', value)}
            />

            <button
                className="p-4 w-64 block mx-auto mt-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSearch}
            >
                Search
            </button>


            {searchResults.length > 0 && (
                <div className="mt-8">
                    <ProviderResults results={searchResults} />
                </div>
            )}

        </div>
    );
}

const AreasOfConcern = ({ selected, onChange }) => {
    const areas = [
        'Anxiety',
        'Depression',
        'Trauma',
        'Relationships',
        'Self-esteem',
        'Stress',
        'Grief',
        'Identity',
        'Life Transitions',
        'Career',
        'Family Issues',
        'Anger Management'
    ].sort();

    return (
        <div className="grid grid-cols-3 gap-2">
            {areas.map((area) => (
                <div key={area} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`area-${area}`}
                        checked={selected.has(area.toLowerCase())}
                        onChange={() => onChange(area.toLowerCase())}
                        className="mr-2"
                    />
                    <label htmlFor={`area-${area}`}>{area}</label>
                </div>
            ))}
        </div>
    );
};

const PaymentMethods = ({ selected, onChange }) => {
    const methods = [
        'Insurance',
        'Credit Card',
        'Cash',
        'Check',
        'Sliding Scale',
        'Medicare',
        'Medicaid'
    ].sort();

    return (
        <div className="grid grid-cols-3 gap-2">
            {methods.map((method) => (
                <div key={method} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`payment-${method}`}
                        checked={selected.has(method.toLowerCase())}
                        onChange={() => onChange(method.toLowerCase())}
                        className="mr-2"
                    />
                    <label htmlFor={`payment-${method}`}>{method}</label>
                </div>
            ))}
        </div>
    );
};

const TherapistPreferences = ({ selected, onChange }) => {
    const preferences = [
        'Female',
        'Male',
        'Non-binary',
        'LGBTQ+',
        'BIPOC'
    ].sort();

    return (
        <div className="grid grid-cols-3 gap-2">
            {preferences.map((pref) => (
                <div key={pref} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`pref-${pref}`}
                        checked={selected.has(pref.toLowerCase())}
                        onChange={() => onChange(pref.toLowerCase())}
                        className="mr-2"
                    />
                    <label htmlFor={`pref-${pref}`}>{pref}</label>
                </div>
            ))}
        </div>
    );
};

const TreatmentModalities = ({ selected, onChange }) => {
    const modalities = [
        { id: 'act', label: 'Acceptance and Commitment Therapy (ACT)', value: 'Acceptance and Commitment Therapy' },
        { id: 'art', label: 'Art Therapy', value: 'Art Therapy' },
        { id: 'cbt', label: 'Cognitive Behavioral Therapy (CBT)', value: 'CBT' },
        { id: 'contextual', label: 'Contextual Therapy', value: 'Contextual Therapy' },
        { id: 'dbt', label: 'Dialectical Behavioral Therapy (DBT)', value: 'DBT' },
        { id: 'emdr', label: 'EMDR', value: 'EMDR' },
        { id: 'eft', label: 'Emotionally Focused Therapy', value: 'Emotionally Focused Therapy' },
        { id: 'family', label: 'Family Systems Therapy', value: 'Family Systems Therapy' },
        { id: 'mbct', label: 'Mindfulness-Based (MBCT)', value: 'MBCT' },
        { id: 'mi', label: 'Motivational Interviewing', value: 'MI' },
        { id: 'narrative', label: 'Narrative Therapy', value: 'Narrative Therapy' },
        { id: 'person', label: 'Person Centered Therapy', value: 'Person Centered Therapy' },
        { id: 'psychodynamic', label: 'Psychodynamic Therapy', value: 'Psychodynamic' },
        { id: 'prolonged', label: 'Prolonged Exposure Therapy', value: 'Prolonged Exposure Therapy' },
        { id: 'relational', label: 'Relational-Cultural Therapy', value: 'Relational-Cultural Therapy' },
        { id: 'restoration', label: 'Restoration Therapy', value: 'Restoration Therapy' },
        { id: 'tfcbt', label: 'Trauma Focused CBT', value: 'Trauma Focused CBT' },
    ].sort((a, b) => a.label.localeCompare(b.label));

    return (
        <div className="columns-3">
            {modalities.map(({ id, label, value }) => (
                <div key={id}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={selected.has(value)}
                        onChange={() => onChange(value)}
                    />
                    <label htmlFor={id}>
                        {label}
                    </label>
                </div>
            ))}
        </div>
    );
};

const LanguageSelector = ({ selected, onChange }) => {
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh', name: 'Mandarin' },
        { code: 'zh2', name: 'Cantonese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'hi', name: 'Hindi' },
        { code: 'th', name: 'Thai' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ms', name: 'Malay' },
        { code: 'tl', name: 'Tagalog' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ar', name: 'Arabic' },
        { code: 'tr', name: 'Turkish' },
        { code: 'fa', name: 'Persian' },
        { code: 'bn', name: 'Bengali' },
        { code: 'ur', name: 'Urdu' },
        { code: 'my', name: 'Burmese' },
        { code: 'km', name: 'Khmer' },
        { code: 'lo', name: 'Lao' }
    ];

    return (
        <div className="columns-3">
            {languages.map(({ code, name }) => (
                <div key={code}>
                    <input
                        type="checkbox"
                        id={code}
                        checked={selected.has(name)}
                        onChange={() => onChange(name)}
                    />
                    <label htmlFor={code}>{name}</label>
                </div>
            ))}
        </div>
    );
};

const StateSelector = ({ selected, onChange }) => {
    return (
        <select
            name="state"
            id="state"
            value={selected}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select a State</option>
            <option value="AL">Alabama - AL</option>
            <option value="AK">Alaska - AK</option>
            <option value="AZ">Arizona - AZ</option>
            <option value="AR">Arkansas - AR</option>
            <option value="CA">California - CA</option>
            <option value="CO">Colorado - CO</option>
            <option value="CT">Connecticut - CT</option>
            <option value="DE">Delaware - DE</option>
            <option value="FL">Florida - FL</option>
            <option value="GA">Georgia - GA</option>
            <option value="HI">Hawaii - HI</option>
            <option value="ID">Idaho - ID</option>
            <option value="IL">Illinois - IL</option>
            <option value="IN">Indiana - IN</option>
            <option value="IA">Iowa - IA</option>
            <option value="KS">Kansas - KS</option>
            <option value="KY">Kentucky - KY</option>
            <option value="LA">Louisiana - LA</option>
            <option value="ME">Maine - ME</option>
            <option value="MD">Maryland - MD</option>
            <option value="MA">Massachusetts - MA</option>
            <option value="MI">Michigan - MI</option>
            <option value="MN">Minnesota - MN</option>
            <option value="MS">Mississippi - MS</option>
            <option value="MO">Missouri - MO</option>
            <option value="MT">Montana - MT</option>
            <option value="NE">Nebraska - NE</option>
            <option value="NV">Nevada - NV</option>
            <option value="NH">New Hampshire - NH</option>
            <option value="NJ">New Jersey - NJ</option>
            <option value="NM">New Mexico - NM</option>
            <option value="NY">New York - NY</option>
            <option value="NC">North Carolina - NC</option>
            <option value="ND">North Dakota - ND</option>
            <option value="OH">Ohio - OH</option>
            <option value="OK">Oklahoma - OK</option>
            <option value="OR">Oregon - OR</option>
            <option value="PA">Pennsylvania - PA</option>
            <option value="RI">Rhode Island - RI</option>
            <option value="SC">South Carolina - SC</option>
            <option value="SD">South Dakota - SD</option>
            <option value="TN">Tennessee - TN</option>
            <option value="TX">Texas - TX</option>
            <option value="UT">Utah - UT</option>
            <option value="VT">Vermont - VT</option>
            <option value="VA">Virginia - VA</option>
            <option value="WA">Washington - WA</option>
            <option value="WV">West Virginia - WV</option>
            <option value="WI">Wisconsin - WI</option>
            <option value="WY">Wyoming - WY</option>
        </select>
    );
};