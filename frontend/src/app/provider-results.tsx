import React from 'react';

const ProviderResults = ({ results = [] }) => {
//   const formatList = (str) => {
//     if (!str) return [];
//     return str.split(/,|\n/).map(item => item.trim()).filter(Boolean);
//   };

  return (
    <div>
      {results.map((provider, index) => (
        <article key={index}>
          <header>
            <h2>
              {provider.first_name} {provider.last_name}
            </h2>
            <div>
              {provider.gender_identity && (
                <div>{provider.gender_identity}</div>
              )}
              {provider.ethnic_identity && (
                <div>{provider.ethnic_identity}</div>
              )}
            </div>
          </header>
          
          <div>
            <div>
              <span>{provider.location}</span>
            </div>
            
            {provider.language && (
              <div>
                <div>{provider.language}</div>
              </div>
            )}
            
            <div>
              <div>
                <p>{provider.bio}</p>
              </div>
            </div>

            {/* {provider.treatment_modality && (
              <div>
                <h3>Treatment Modalities</h3>
                <div>
                  {formatList(provider.treatment_modality).map((modality, idx) => (
                    <span key={idx}>{modality}</span>
                  ))}
                </div>
              </div>
            )}

            {provider.areas_of_concern && (
              <div>
                <h3>Areas of Expertise</h3>
                <div>
                  {formatList(provider.areas_of_concern).map((area, idx) => (
                    <span key={idx}>{area}</span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProviderResults;