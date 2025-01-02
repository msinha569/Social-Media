import { useEffect } from 'react'
import Messaging from './Messaging'
import WebRTC from './WebRTC'


const Omegle = () => {
 const { socket ,remoteStream, localStream, opponentId,status} = WebRTC()
 useEffect(() => {
  return () => {
    // Cleanup logic
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
   
    if (socket) {
      socket.disconnect(); // Optionally disconnect the socket when leaving the page
    }
  };
}, [remoteStream, localStream, socket]);

const remoteLoading = () => {
  if (!remoteStream) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
        <div className="text-white">Waiting for your partner to join...<br />Automatic Reload...</div>
      </div>
    );
  }
}

return (
  <div className="m-5 space-y-4">
    {/* Status Display */}
    <div className="text-center text-lg font-medium text-gray-700">{status}</div>

    <div className="flex flex-col md:flex-row md:space-x-5">
     

      {/* Video Streams */}
      <div className="flex flex-wrap justify-center gap-4 mt-5 md:mt-0 md:w-2/3">
        {/* Local Video */}
        <video
        autoPlay
        muted
        playsInline
        ref={(video) => {
          if (video && localStream) {
            video.srcObject = localStream;
          }
        }}
        className="w-full md:w-1/2 h-60 border border-gray-300 rounded-lg shadow-md object-cover -scale-x-100"
      />

        {/* Remote Video */}
       {remoteStream ? (<video
        autoPlay
        playsInline
        ref={(video) => {
          if (video && remoteStream) {
            video.srcObject = remoteStream;
          }
        }}
        className="w-full md:w-1/2 h-60 border border-gray-300 rounded-lg shadow-md object-cover -scale-x-100"
      />) : (
        remoteLoading()
      )}
        
      </div>
       {/* Messaging Section */}
       <div className="w-full md:w-1/3">
        <Messaging socket={socket} opponentId={opponentId} />
      </div>
    </div>
  </div>
);
}

export default Omegle