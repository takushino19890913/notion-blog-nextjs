
import React, { useState, useEffect } from 'react';

const MetaCard = ({ url, metaData }) => {

    return (
      <div className="my-3 link-card cursor-pointer" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }} onClick={(() => { window.open(url);})}>
        <div className="flex flex-row justify-between">
        {metaData.image && <img src={metaData.image} alt={metaData.title} style={{ maxWidth: '30%'}} />}
          <div className="flex flex-col my-auto">
            <h3>{metaData.title}</h3>
            <p>{metaData.description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default MetaCard;