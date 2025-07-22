import React from 'react';
// import Logo from Logo.jpeg;

function Logo({width = '100px', height = '50px'}) {

    return (
        <img style={{width: width, height: height}} src="/Logo.jpeg" alt='Logo'/>
    );
}

export default Logo;