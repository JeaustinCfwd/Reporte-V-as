import React from 'react';
import Plasma from '../components/Plasma';
import RegisterForm from '../components/RegisterForm';

const RegisterLayout = () => {
  return (
    <div style={{ 
      position: 'relative', 
      minHeight: 'calc(100vh - 60px)', 
      width: '100%', 
      overflow: 'hidden',
      isolation: 'isolate'
    }}>
      <Plasma 
        color="#1a1a2e"
        speed={0.4}
        direction="forward"
        scale={1.2}
        opacity={1}
        mouseInteractive={false}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'inherit' }}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterLayout;
