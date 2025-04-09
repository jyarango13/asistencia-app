
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import Swal from 'sweetalert2';

const CameraCapture = forwardRef(({ dni }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { width: 300, height: 300 },
      audio: false
    }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Cam error:', err);
      setCameraReady(false);
      setLoading(true);
      Swal.fire({
        title: 'Error Cámara',
        text: 'No se pudo acceder a la cámara. Por favor, verifica la conexión y luego actualiza la página.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }, []);


  const handleCapture = () => {

    //← ✅EN CASO NO HAYA CAMARA
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    //← ✅EN CASO NO HAYA CAMARA

    const now = new Date();
    const filename = `f-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-h-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-d-${now.getDay()}-${dni}.jpg`;

    const enlace = document.createElement('a');
    enlace.download = filename;

    //← ✅EN CASO NO HAYA CAMARA
    enlace.href = canvas.toDataURL();
    //← ✅EN CASO NO HAYA CAMARA

    enlace.click();
  };

  // Exponer método al padre (AsistenciaCard)
  useImperativeHandle(ref, () => ({
    capture: handleCapture,
    //aqui se puede agregar el estado de la camara
    isCameraReady: cameraReady
  }));

  return (


    <div className="camera-section text-center">
      {loading ? (
        <div className="spinner-container mb-3">
          <div className="spinner-border text-info" role="status" />
          <div className="text-white mt-2">Cargando cámara...</div>
        </div>
      ) : (
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline width={300} height={300} />
          <canvas ref={canvasRef} width={300} height={300} hidden />
        </div>
      )}
    </div>

  );

});

export default CameraCapture;
